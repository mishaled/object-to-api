import { Router } from 'express';
import baseSwaggerJson from './swagger.json';
import { JsonObject } from 'swagger-ui-express';
import Options, { Method } from './Options.js';
import queryString from 'query-string';

const updateSwaggerJson = (pathSoFar: string, path: string, newSwaggerjson: JsonObject, method: Method) => {
    const newPath = `${pathSoFar && `/${pathSoFar}`}/${path}`;
    newSwaggerjson.paths[newPath] = {
        [method.toLowerCase()]: {
            tags: [],
            summary: newPath,
            description: newPath,
            operationId: path,
            produces: ['application/xml', 'application/json'],
            parameters: [
                {
                    in: 'body',
                    name: 'body',
                    description: 'List of arguments',
                    required: true,
                },
            ],
            responses: {
                default: {
                    description: 'successful operation',
                },
            },
        },
    };
};

const handleFunction = <T>(
    path: string,
    func: Function,
    obj: T,
    pathSoFar: string,
    newSwaggerjson: JsonObject,
    methods: {}
) => {
    const childRouter = Router();

    const currentMethod = methods[path];
    switch (currentMethod) {
        case 'GET': {
            childRouter.get(`/${path}`, async (req, res) => {
                res.send(await func.apply(obj, Object.values(req.query)));
            });

            break;
        }
        case 'PUT': {
            childRouter.put(`/${path}`, async ({ body }, res) => {
                res.send(await func.apply(obj, body));
            });
            break;
        }
        case 'DELETE': {
            childRouter.delete(`/${path}`, async (req, res) => {
                res.send(await func.apply(obj, Object.values(req.query)));
            });

            break;
        }
        default: {
            childRouter.post(`/${path}`, async (req, res) => {
                res.send(await func.apply(obj, req.body));
            });
            break;
        }
    }

    if (newSwaggerjson) {
        updateSwaggerJson(pathSoFar, path, newSwaggerjson, currentMethod || 'POST');
    }

    return childRouter;
};

const convert = <T extends object>(
    obj: T,
    options?: Options<T>,
    methods?: {},
    path: string = '',
    pathSoFar: string = path,
    newSwaggerjson?: JsonObject
): [Router, JsonObject] => {
    if (!newSwaggerjson && options && options.swagger) {
        if (typeof options.swagger === 'object') {
            newSwaggerjson = { ...options.swagger, basePath: options.swagger.basePath + pathSoFar };
        } else {
            newSwaggerjson = { ...baseSwaggerJson, basePath: baseSwaggerJson.basePath + pathSoFar };
        }
    }

    const papaRouter: Router = Router();

    if (!obj) {
        return [papaRouter, newSwaggerjson];
    }

    Object.keys(obj).forEach(key => {
        const val = obj[key];

        if (key.startsWith('_') || !val) {
            return;
        }

        let childRouter;
        if (typeof val === 'function') {
            childRouter = handleFunction(key, val, obj, pathSoFar, newSwaggerjson, methods);
        } else if (typeof val === 'object') {
            [childRouter] = convert(val, options, options.methods[key] || {}, key, pathSoFar + `/${key}`);
        }

        if (!childRouter) {
            return;
        }

        papaRouter.use(`/${path}`, childRouter);
    });

    return [papaRouter, newSwaggerjson];
};

export default <T extends object>(obj: T, options?: Options<T>) =>
    convert<T>(obj, options, (options && options.methods) || {});
