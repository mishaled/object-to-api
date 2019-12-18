// import 'mocha';
// import { expect } from 'chai';
// import chai from 'chai';
// import chaiHttp from 'chai-http';
// import convert from '../src/convert';
// import express from 'express';
// import { Server } from 'http';
// import baseSwaggerJson from '../src/swagger.json';
// import uuid from 'uuid';
// import queryString from 'query-string';

// chai.use(chaiHttp);
// chai.should();

// //TODO: check for params passing correctness
// describe.only('convert', function() {
//     let server: Server = null;

//     const promisifyServer = (app: express.Express, port: number) => {
//         return new Promise((res, rej) => {
//             server = app.listen({ port }, async () => {
//                 res();
//             });
//         });
//     };

//     afterEach(() => {
//         if (server) {
//             server.close();
//         }
//     });

//     describe('signature', () => {
//         [undefined, null, {}].forEach(val => {
//             it('Empty object - should pass', () => {
//                 const obj = val;
//                 convert<{}>(obj);
//             });
//         });

//         [undefined, null, { swagger: {} }].forEach(val => {
//             it(`Empty options - should not throw`, () => {
//                 const obj = {};
//                 convert<{}>(obj, val);
//             });
//         });

//         [undefined, null, { methods: {} }].forEach(val => {
//             it(`Empty options - should not throw`, () => {
//                 const obj = {};
//                 convert<{}>(obj, val);
//             });
//         });
//     });

//     it(`No method override - Should reach correct function`, async () => {
//         const obj = {
//             hartaFunc: () => {},
//         };
//         const [router] = convert<{}>(obj);

//         const app = express();
//         app.use('/', router);

//         const PORT = 4000;

//         server = app.listen({ port: PORT }, async () => {
//             const res = await chai.request(app).post(`/hartaFunc`);

//             res.should.have.status(200);
//         });
//     });

//     it(`No method override - Should return correct result`, async () => {
//         const RESULT = { someString: 'true' };
//         const obj = {
//             hartaFunc: () => {
//                 return RESULT;
//             },
//         };
//         const [router] = convert<{}>(obj);

//         const app = express();
//         app.use('/', router);

//         const PORT = 4000;

//         server = app.listen({ port: PORT }, async () => {
//             const res = await chai.request(app).post(`/hartaFunc`);

//             res.should.have.status(200);
//             expect(res.body).to.be.deep.equal(RESULT);
//         });
//     });

//     it(`Empty options - should return empty swaggerJson`, async () => {
//         const obj = {
//             hartaFunc: () => {
//                 return {};
//             },
//         };

//         const [router, swaggerJson] = convert<{}>(obj);

//         expect(swaggerJson).to.be.undefined;
//     });

//     it(`Swagger true - Swagger JSON paths should include correct path`, async () => {
//         const RESULT = { someString: 'true' };
//         const obj = {
//             hartaFunc: () => {
//                 return RESULT;
//             },
//         };

//         const [router, swaggerJson] = convert<{}>(obj, { swagger: true });

//         expect(Object.keys(swaggerJson.paths)).to.include('/hartaFunc');
//     });

//     it(`Swagger true - Swagger JSON should include default swaggerJson`, async () => {
//         const RESULT = { someString: 'true' };
//         const obj = {
//             hartaFunc: () => {
//                 return RESULT;
//             },
//         };

//         const [router, swaggerJson] = convert<{}>(obj, { swagger: true });

//         expect(swaggerJson).to.deep.include(baseSwaggerJson);
//     });

//     it(`Swagger options exists - Swagger JSON paths should include swaggerJson param`, async () => {
//         const obj = {
//             hartaFunc: () => {
//                 return {};
//             },
//         };

//         const expected = {
//             swagger: '2.0',
//             info: {
//                 description: uuid(),
//                 version: '1.0.0',
//                 title: uuid(),
//                 termsOfService: uuid(),
//                 contact: {
//                     email: uuid(),
//                 },
//                 license: {
//                     name: uuid(),
//                     url: uuid(),
//                 },
//             },
//             host: `${uuid()}:3000`,
//             basePath: `/${uuid()}`,
//             tags: [],
//             schemes: ['https', 'http'],
//             paths: {},
//             securityDefinitions: {},
//             definitions: {},
//             externalDocs: {
//                 description: uuid(),
//                 url: uuid(),
//             },
//         };

//         const [router, swaggerJson] = convert<{}>(obj, { swagger: expected });

//         expect(swaggerJson).to.deep.include(expected);
//     });

//     describe('Function has no args', async () => {
//         it(`POST method - should create correct path`, async () => {
//             const RESULT = { someString: 'true' };
//             const obj = {
//                 hartaFunc: () => {
//                     return RESULT;
//                 },
//             };
//             const [router] = convert<{}>(obj, { methods: { hartaFunc: 'POST' } });

//             const app = express();
//             app.use('/', router);

//             const PORT = 4000;

//             server = app.listen({ port: PORT }, async () => {
//                 const res = await chai.request(app).post(`/hartaFunc`);

//                 res.should.have.status(200);
//                 expect(res.body).to.be.deep.equal(RESULT);
//             });
//         });

//         it(`PUT method - should create correct path`, async () => {
//             const RESULT = { someString: 'true' };
//             const obj = {
//                 hartaFunc: () => {
//                     return RESULT;
//                 },
//             };
//             const [router] = convert<{}>(obj, { methods: { hartaFunc: 'PUT' } });

//             const app = express();
//             app.use('/', router);

//             const PORT = 4000;

//             server = app.listen({ port: PORT }, async () => {
//                 const res = await chai.request(app).put(`/hartaFunc`);

//                 res.should.have.status(200);
//                 expect(res.body).to.be.deep.equal(RESULT);
//             });
//         });

//         it(`GET method - should create correct path`, async () => {
//             const obj = {
//                 hartaFunc: (arg1: string, arg2: string) => {
//                     return { arg1, arg2 };
//                 },
//             };
//             const [router] = convert<{}>(obj, { methods: { hartaFunc: 'GET' } });

//             const app = express();
//             app.use('/', router);

//             const PORT = 4000;

//             const expected = { arg1: uuid(), arg2: uuid() };

//             await promisifyServer(app, PORT);

//             const getUrl = `/hartaFunc?${queryString.stringify(expected)}`;
//             const res = await chai.request(app).get(getUrl);

//             res.should.have.status(200);
//             expect(res.body).to.be.deep.equal(expected);
//         });

//         it(`DELETE method - should create correct path`, async () => {
//             const obj = {
//                 hartaFunc: (arg1: string, arg2: string) => {
//                     return { arg1, arg2 };
//                 },
//             };
//             const [router] = convert<{}>(obj, { methods: { hartaFunc: 'DELETE' } });

//             const app = express();
//             app.use('/', router);

//             const PORT = 4000;

//             const expected = { arg1: uuid(), arg2: uuid() };

//             await promisifyServer(app, PORT);

//             const getUrl = `/hartaFunc?${queryString.stringify(expected)}`;
//             const res = await chai.request(app).delete(getUrl);

//             res.should.have.status(200);
//             expect(res.body).to.be.deep.equal(expected);
//         });
//     });

//     // describe.only('Function has args', async () => {
//     //     it(`POST method - should create correct path`, async () => {
//     //         const EXPECTED = { arg1: uuid(), arg2: uuid() };
//     //         const obj = {
//     //             hartaFunc: (arg1: string, arg2: string) => {
//     //                 return { arg1, arg2 };
//     //             },
//     //         };
//     //         const [router] = convert<{}>(obj, { methods: { hartaFunc: 'POST' } });

//     //         const app = express();
//     //         app.use('/', router);

//     //         const PORT = 4000;

//     //         server = app.listen({ port: PORT }, async () => {
//     //             const res = await chai.request(app).post(`/hartaFunc`,{EXPECTED});

//     //             res.should.have.status(200);
//     //             expect(res.body).to.be.deep.equal(RESULT);
//     //         });
//     //     });

//         it(`PUT method - should create correct path`, async () => {
//             const RESULT = { someString: 'true' };
//             const obj = {
//                 hartaFunc: () => {
//                     return RESULT;
//                 },
//             };
//             const [router] = convert<{}>(obj, { methods: { hartaFunc: 'PUT' } });

//             const app = express();
//             app.use('/', router);

//             const PORT = 4000;

//             server = app.listen({ port: PORT }, async () => {
//                 const res = await chai.request(app).put(`/hartaFunc`);

//                 res.should.have.status(200);
//                 expect(res.body).to.be.deep.equal(RESULT);
//             });
//         });

//         it(`GET method - should create correct path`, async () => {
//             const obj = {
//                 hartaFunc: (arg1: string, arg2: string) => {
//                     return { arg1, arg2 };
//                 },
//             };
//             const [router] = convert<{}>(obj, { methods: { hartaFunc: 'GET' } });

//             const app = express();
//             app.use('/', router);

//             const PORT = 4000;

//             const expected = { arg1: uuid(), arg2: uuid() };

//             await promisifyServer(app, PORT);

//             const getUrl = `/hartaFunc?${queryString.stringify(expected)}`;
//             const res = await chai.request(app).get(getUrl);

//             res.should.have.status(200);
//             expect(res.body).to.be.deep.equal(expected);
//         });

//         it(`DELETE method - should create correct path`, async () => {
//             const obj = {
//                 hartaFunc: (arg1: string, arg2: string) => {
//                     return { arg1, arg2 };
//                 },
//             };
//             const [router] = convert<{}>(obj, { methods: { hartaFunc: 'DELETE' } });

//             const app = express();
//             app.use('/', router);

//             const PORT = 4000;

//             const expected = { arg1: uuid(), arg2: uuid() };

//             await promisifyServer(app, PORT);

//             const getUrl = `/hartaFunc?${queryString.stringify(expected)}`;
//             const res = await chai.request(app).delete(getUrl);

//             res.should.have.status(200);
//             expect(res.body).to.be.deep.equal(expected);
//         });
//     });

//     it(`POST method - should create correct path`, async () => {
//         const RESULT = { someString: uuid() };
//         const obj = {
//             hartaFunc: () => {
//                 return RESULT;
//             },
//         };
//         const [router] = convert<{}>(obj, { methods: { hartaFunc: 'POST' } });

//         const app = express();
//         app.use('/', router);

//         const PORT = 4000;

//         server = app.listen({ port: PORT }, async () => {
//             const res = await chai.request(app).post(`/hartaFunc`);

//             res.should.have.status(200);
//             expect(res.body).to.be.deep.equal(RESULT);
//         });
//     });

//     it(`Post method - should create correct swagger path`, async () => {});
// });
