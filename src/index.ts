import express from 'express';
import convert from './convert';
import swaggerUi from 'swagger-ui-express';
import Options from './Options';

export default <T extends object>(obj: T, options?: Options): express.Express => {
    const [router, swaggerJson] = convert<T>(obj, options);

    const app = express();
    app.use('/', router);
    if (options && options.swagger) {
        app.use(`/api-docs`, swaggerUi.serve, swaggerUi.setup(swaggerJson));
    }

    return app;
};
