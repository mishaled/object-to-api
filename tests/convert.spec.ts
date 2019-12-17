import 'mocha';
import { expect } from 'chai';
import chai from 'chai';
import chaiHttp from 'chai-http';
import convert from '../src/convert';
import express from 'express';
import { Server } from 'http';
import baseSwaggerJson from '../src/swagger.json';
import uuid from 'uuid';

chai.use(chaiHttp);
chai.should();

describe('convert', function() {
    let server: Server = null;

    afterEach(() => {
        if (server) {
            server.close();
        }
    });

    [undefined, null, {}].forEach(val => {
        it('Empty object - should pass', () => {
            const obj = val;
            convert<{}>(obj);
        });
    });

    [undefined, null, { swagger: {} }].forEach(val => {
        it(`Empty options - should not throw`, () => {
            const obj = {};
            convert<{}>(obj, val);
        });
    });

    it(`Should reach correct function`, async () => {
        const obj = {
            hartaFunc: () => {},
        };
        const [router] = convert<{}>(obj);

        const app = express();
        app.use('/', router);

        const PORT = 4000;

        server = app.listen({ port: PORT }, async () => {
            const res = await chai.request(app).post(`/hartaFunc`);

            res.should.have.status(200);
        });
    });

    it(`Should return correct result`, async () => {
        const RESULT = { someString: 'true' };
        const obj = {
            hartaFunc: () => {
                return RESULT;
            },
        };
        const [router] = convert<{}>(obj);

        const app = express();
        app.use('/', router);

        const PORT = 4000;

        server = app.listen({ port: PORT }, async () => {
            const res = await chai.request(app).post(`/hartaFunc`);

            res.should.have.status(200);
            expect(res.body).to.be.deep.equal(RESULT);
        });
    });

    it(`Emppty options - should return empty swaggerJson`, async () => {
        const obj = {
            hartaFunc: () => {
                return {};
            },
        };

        const [router, swaggerJson] = convert<{}>(obj);

        expect(swaggerJson).to.be.undefined;
    });

    it(`Swagger true - Swagger JSON paths should include correct path`, async () => {
        const RESULT = { someString: 'true' };
        const obj = {
            hartaFunc: () => {
                return RESULT;
            },
        };

        const [router, swaggerJson] = convert<{}>(obj, { swagger: true });

        expect(Object.keys(swaggerJson.paths)).to.include('/hartaFunc');
    });

    it(`Swagger true - Swagger JSON should include default swaggerJson`, async () => {
        const RESULT = { someString: 'true' };
        const obj = {
            hartaFunc: () => {
                return RESULT;
            },
        };

        const [router, swaggerJson] = convert<{}>(obj, { swagger: true });

        expect(swaggerJson).to.deep.include(baseSwaggerJson);
    });

    it(`Swagger options exists - Swagger JSON paths should include swaggerJson param`, async () => {
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

        const [router, swaggerJson] = convert<{}>(obj, { swagger: expected });

        expect(swaggerJson).to.deep.include(expected);
    });
});
