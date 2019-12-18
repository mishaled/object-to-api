# Object-To-API


[![npm version](http://img.shields.io/npm/v/object-to-api.svg?style=flat)](https://npmjs.org/package/@npmsoluto/package-to-rest "View this project on npm") [![Actions Status](https://github.com/mishaled/object-to-api/workflows/CI/badge.svg)](https://github.com/mishaled/object-to-api/actions)



Do you happen to have a Javascript package that you want to wrap in a REST service?
If so- this module is exactly for you!

## Installation
using npm
```bash
npm install --save object-to-api
```

using yarn
```bash
yarn add object-to-api
```
## Usage


Just 6 lines of code-

```js
import express from 'express';
import objectToApi from 'object-to-api';

const someApiObject = {
  someInternalObject: {
    someFunc: (arg1, arg2) => {}
  }
};

const app = express();

app.use('/', objectToApi(someApiObject));

app.listen({port: 3000});
```

Now you have an ExpressJS server that wraps your API.

The structure of your new API is-
(POST) http://localhost:3000/someInternalObject/someFunc
And it expects a body, which is an array of the arguments of the function.

### Swagger
You can expose your api via swagger
Swagger is peerDependency

Swagger docs on http://localhost:3000/api-docs!

```bash
npm install --save-dev swagger?
```

```js
app.use('/', objectToApi(someApiObject, {swagger: true}));
```

extend swagger

```js
app.use('/', objectToApi(someApiObject, {swagger: swaggerSettings}));
```
## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## Credits

TODO: Write credits

## License

MIT License


Enjoy!!!
