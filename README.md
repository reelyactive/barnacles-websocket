# barnacles-websocket

**barnacles-websocket** Emits IoT data to connected websocket clients.

**barnacles-websocket** ingests a real-time stream of _raddec_ and _dynamb_ objects from [barnacles](https://github.com/reelyactive/barnacles/) which it emits as messages to connected websocket clients. It couples seamlessly with reelyActive's [Pareto Anywhere](https://www.reelyactive.com/pareto/anywhere/) open source IoT middleware.

**barnacles-websocket** is a lightweight [Node.js package](https://www.npmjs.com/package/barnacles-websocket) that can run on resource-constrained edge devices as well as on powerful cloud servers and anything in between.

## Pareto Anywhere integration

A common application of **barnacles-websocket** is to write IoT data from [pareto-anywhere](https://github.com/reelyactive/pareto-anywhere) to a SQL Server database. Simply follow our [Create a Pareto Anywhere startup script](https://reelyactive.github.io/diy/pareto-anywhere-startup-script/) tutorial using the script below:

```javascript
#!/usr/bin/env node

const ParetoAnywhere = require("../lib/paretoanywhere.js");

// Edit the options to match your SQL Server configuration
const BARNACLES_WEBSOCKET_OPTIONS = {
  printErrors: true,
};

// ----- Exit gracefully if the optional dependency is not found -----
let BarnaclesWebsocket;
try {
  BarnaclesWebsocket = require("barnacles-websocket");
} catch (err) {
  console.log("This script requires barnacles-websocket.  Install with:");
  console.log('\r\n    "npm install barnacles-websocket"\r\n');
  return console.log("and then run this script again.");
}
// -------------------------------------------------------------------

let pa = new ParetoAnywhere();
pa.barnacles.addInterface(BarnaclesWebsocket, BARNACLES_WEBSOCKET_OPTIONS);
```

## Connecting a websocket client

## Options

**barnacles-websocket** supports the following options:

| Property     | Default | Description                                   |
| :----------- | :------ | :-------------------------------------------- |
| printErrors  | FALSE   |                                               |
| ACCESS_TOKEN | null    | A JSON Web Token. Optionally signed.          |
| port         | null    | The port on which to run the websocket server |

## Contributing

Discover [how to contribute](CONTRIBUTING.md) to this open source project which upholds a standard [code of conduct](CODE_OF_CONDUCT.md).

## Security

Consult our [security policy](SECURITY.md) for best practices using this open source software and to report vulnerabilities.

## License

MIT License

Copyright (c) 2024 [reelyActive](https://www.reelyactive.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
