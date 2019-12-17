import 'mocha';
import { expect } from 'chai';
import chai from 'chai';
import chaiHttp from 'chai-http';
import { Server } from 'http';
import uuid from 'uuid';
import objectToApi from '../src';

chai.use(chaiHttp);
chai.should();

describe('objectToApi', function() {
    let server: Server = null;

    afterEach(() => {
        if (server) {
            server.close();
        }
    });

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

    it(`Should reach correct function`, async () => {
        const obj = {
            hartaFunc: () => {},
        };
        const app = objectToApi<{}>(obj);

        const PORT = 4000;
        server = app.listen({ port: PORT }, async () => {
            const res = await chai.request(app).post(`/hartaFunc`);

            res.should.have.status(200);
        });
    });

    it(`Should return correct trsult`, async () => {
        const RESULT = { someString: 'true' };
        const obj = {
            hartaFunc: () => {
                return RESULT;
            },
        };
        const app = objectToApi<{}>(obj);

        const PORT = 4000;
        server = app.listen({ port: PORT }, async () => {
            const res = await chai.request(app).post(`/hartaFunc`);

            res.should.have.status(200);
            expect(res.body).to.be.deep.equal(RESULT);
        });
    });

    it(`Swagger should not exist`, async () => {
        const obj = {
            hartaFunc: () => {},
        };
        const app = objectToApi<{}>(obj);

        const PORT = 4000;
        server = app.listen({ port: PORT }, async () => {
            const res = await chai.request(app).get(`/api-docs`);

            res.should.have.status(404);
        });
    });

    it(`Swagger options is true - Swagger should exist`, async () => {
        const obj = {
            hartaFunc: () => {},
        };
        const app = objectToApi<{}>(obj, { swagger: true });

        const PORT = 4000;
        server = app.listen({ port: PORT }, async () => {
            const res = await chai.request(app).get(`/api-docs`);

            expect(res.status).to.be.equal(200);
        });
    });

    it(`Swagger options is JSON - Swagger should exist`, async () => {
        const obj = {
            hartaFunc: () => {},
        };
        const app = objectToApi<{}>(obj, {
            swagger: {
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
            },
        });

        const PORT = 4000;
        server = app.listen({ port: PORT }, async () => {
            const res = await chai.request(app).get(`/api-docs`);

            expect(res.status).to.be.equal(200);
        });
    });
});
