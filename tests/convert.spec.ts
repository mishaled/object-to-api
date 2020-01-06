import 'mocha';
import { expect } from 'chai';
import chai from 'chai';
import chaiHttp from 'chai-http';
import convert from '../src/convert';
import baseSwaggerJson from '../src/swagger.json';
import uuid from 'uuid';
import { Method, methods } from '../src/Options';

chai.use(chaiHttp);
chai.should();

const performChecksForMethod = (method?: Method) => {
    describe(method || 'No method override', () => {
        it('Swagger true - Swagger JSON paths should include correct path', async () => {
            const RESULT = { someString: 'true' };
            const obj = {
                hartaFunc: () => {
                    return RESULT;
                },
            };
            const [router, swaggerJson] = convert<{}>(obj, { swagger: true, methods: method && { hartaFunc: method } });

            const funcPathJson = swaggerJson.paths['/hartaFunc'];
            const currentMethod = method ? method.toLowerCase() : 'post';

            expect(funcPathJson).to.not.be.empty;
            expect(funcPathJson[currentMethod]).to.not.be.undefined;
            expect(funcPathJson[currentMethod]).to.not.be.null;
            expect(funcPathJson[currentMethod]).to.not.be.empty;
        });

        it('Swagger true - Swagger JSON should include default swaggerJson', async () => {
            const RESULT = { someString: 'true' };
            const obj = {
                hartaFunc: () => {
                    return RESULT;
                },
            };
            const [router, swaggerJson] = convert<{}>(obj, { swagger: true, methods: method && { hartaFunc: method } });
            expect(swaggerJson).to.deep.include(baseSwaggerJson);
        });

        it('Swagger options exists - Swagger JSON should include base swaggerJson from options', async () => {
            const obj = {
                hartaFunc: () => {
                    return {};
                },
            };
            const expected = {
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
            };

            const [router, swaggerJson] = convert<{}>(obj, {
                swagger: expected,
                methods: method && { hartaFunc: method },
            });

            expect(swaggerJson).to.deep.include(expected);
        });

        it('Swagger options exists - Swagger JSON should include correct path', async () => {
            const obj = {
                hartaFunc: () => {
                    return {};
                },
            };
            const expected = {
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
            };

            const [router, swaggerJson] = convert<{}>(obj, {
                swagger: expected,
                methods: method && { hartaFunc: method },
            });

            const funcPathJson = swaggerJson.paths['/hartaFunc'];
            const currentMethod = method ? method.toLowerCase() : 'post';

            expect(funcPathJson).to.not.be.empty;
            expect(funcPathJson[currentMethod]).to.not.be.undefined;
            expect(funcPathJson[currentMethod]).to.not.be.null;
            expect(funcPathJson[currentMethod]).to.not.be.empty;
        });
    });
};

describe('Convert', function() {
    describe('Swagger', () => {
        performChecksForMethod();

        describe('Method override exists', () => {
            methods.map((method: Method) => performChecksForMethod(method));
        });
    });
});
