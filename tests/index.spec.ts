import 'mocha';
import chai, { expect } from 'chai';
import express from 'express';
import chaiHttp from 'chai-http';
import { Server } from 'http';
import uuid from 'uuid';
import objectToApi from '../src';
import queryString from 'query-string';
import { Method } from '../src/Options';

chai.use(chaiHttp);
chai.should();

const PORT = 4000;

const generateBaseSwagger = () => ({
    swagger: '2.0',
    info: {
        description: uuid(),
        version: '1.0.0',
        title: uuid(),
        termsOfService: uuid(),
        contact: {
            email: uuid(),
        },
        license: {
            name: uuid(),
            url: uuid(),
        },
    },
    host: `${uuid()}:3000`,
    basePath: `/${uuid()}`,
    tags: [],
    schemes: ['https', 'http'],
    paths: {},
    securityDefinitions: {},
    definitions: {},
    externalDocs: {
        description: uuid(),
        url: uuid(),
    },
});

const performChecksForMethod = (method?: 'GET' | 'POST' | 'DELETE' | 'PUT') => {
    describe(method || 'POST', () => {
        let server: Server = null;

        afterEach(() => {
            if (server) {
                server.close();
            }
        });

        const generateRequestFunc = (app: express.Express) => chai.request(app)[method ? method.toLowerCase() : 'post'];

        const promisifyServer = (app: express.Express, port: number) => {
            return new Promise((res, rej) => {
                server = app.listen({ port }, async () => {
                    res();
                });
            });
        };

        it('Should reach correct function', async () => {
            const obj = {
                hartaFunc: () => {},
            };
            const app = objectToApi<{}>(obj, { methods: method && { hartaFunc: method } });

            await promisifyServer(app, PORT);
            const res = await generateRequestFunc(app)(`/hartaFunc`);

            res.should.have.status(200);
        });

        it('Should return correct result', async () => {
            const EXPECTED = { arg1: uuid(), arg2: uuid() };
            const obj = {
                hartaFunc: (arg1: string, arg2: string) => {
                    return { arg1, arg2 };
                },
            };

            const app = objectToApi<{}>(obj, { methods: method && { hartaFunc: method } });
            await promisifyServer(app, PORT);

            let url;
            let body;
            if (['GET', 'DELETE'].includes(method)) {
                url = `/hartaFunc?${queryString.stringify(EXPECTED)}`;
                body = {};
            } else {
                url = `/hartaFunc`;
                body = Object.values(EXPECTED);
            }

            const res = await generateRequestFunc(app)(url)
                .set('Content-Type', 'application/json')
                .send(body);

            res.should.have.status(200);
            expect(res.body).to.be.deep.equal(EXPECTED);
        });

        describe('Swagger', () => {
            it('Swagger should not exist', async () => {
                const obj = {
                    hartaFunc: () => {},
                };

                const app = objectToApi<{}>(obj, { methods: method && { hartaFunc: method } });
                await promisifyServer(app, PORT);
                const res = await chai.request(app).get(`/api-docs`);

                res.should.have.status(404);
            });

            it('Swagger options is true - Swagger should exist', async () => {
                const obj = {
                    hartaFunc: () => {},
                };

                const app = objectToApi<{}>(obj, {
                    swagger: true,
                    methods: method && { hartaFunc: method },
                });
                await promisifyServer(app, PORT);
                const res = await chai.request(app).get(`/api-docs`);

                expect(res.status).to.be.equal(200);
            });

            it('Swagger options is JSON - Swagger should exist', async () => {
                const obj = {
                    hartaFunc: () => {},
                };
                const app = objectToApi<{}>(obj, {
                    swagger: generateBaseSwagger(),
                    methods: { hartaFunc: method },
                });

                await promisifyServer(app, PORT);
                const res = await chai.request(app).get(`/api-docs`);

                expect(res.status).to.be.equal(200);
            });

            it('Swagger options is JSON - Swagger should exist', async () => {
                const obj = {
                    hartaFunc: () => {},
                };
                const app = objectToApi<{}>(obj, {
                    swagger: generateBaseSwagger(),
                    methods: { hartaFunc: method },
                });

                await promisifyServer(app, PORT);
                const res = await chai.request(app).get(`/api-docs`);

                expect(res.status).to.be.equal(200);
            });
        });
    });
};

describe('ObjectToApi', function() {
    describe('Signature', () => {
        [undefined, null, {}].forEach(val => {
            it('Empty object - should pass', () => {
                const obj = val;
                objectToApi<{}>(obj);
            });
        });

        [undefined, null].forEach(val => {
            it(`Empty path - should not throw`, () => {
                const obj = {};
                objectToApi<{}>(obj, val);
            });
        });

        [undefined, null, { methods: {} }].forEach(val => {
            it(`Empty options - should not throw`, () => {
                const obj = {};
                objectToApi<{}>(obj, val);
            });
        });
    });

    performChecksForMethod();

    describe('Method override exists', () => {
        ['GET', 'POST', 'PUT', 'DELETE'].map((method: Method) => performChecksForMethod(method));
    });
});
