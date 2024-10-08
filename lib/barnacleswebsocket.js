/**
 * Copyright reelyActive 2023
 * We believe in an open Internet of Things
 */
const WebSocket = require('ws');
const url = require('url');
const fs = require('fs');
const http = require('http');
const https = require('https');

const DEFAULT_PORT = 3001;
const DEFAULT_PRINT_ERRORS = false;

/**
 * BarnaclesWebSocket Class
 * Detects events and sends notifications.
 */
class BarnaclesWebSocket {
  /**
   * BarnaclesWebSocket constructor
   * @param {Object} options The options as a JSON object.
   * @constructor
   */
  constructor(options) {
    let self = this;
    self.options = options || {};

    self.printErrors = options.printErrors || DEFAULT_PRINT_ERRORS;

    // Use the provided WebSocket server instance
    if (options.wss) {
      self.wss = options.wss;
    }

    // Use the provided HTTP(S) server
    else if (options.server) {
      self.wss = new WebSocket.WebSocketServer({server: options.server});
    }

    // Have WebSocketServer create a new server on the given port
    else {
      console.log('No servers provided');
      this.server = createServer(self, self.options);

      let port = options.port || DEFAULT_PORT;
      self.wss = new WebSocket.WebSocketServer({noServer: true});

      self.server.listen(port, function () {
        console.info(
          'barnacles-websocket: Server is listening on port: ',
          port
        );
      });

      self.server.on('upgrade', function (request, socket, head) {
        if (authenticate(request, self.options) === false) {
          if (self.options.printErrors) {
            console.log(
              'barnacles-websocket: Unable to authenticate. Closing connection.'
            );
          }
          socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
          socket.destroy();
          return;
        }
        self.wss.handleUpgrade(request, socket, head, connection => {});
      });
    }
  }

  /**
   * Handle an outbound event.
   * @param {String} name The event name.
   * @param {Object} data The outbound event data.
   */
  handleEvent(name, data) {
    let self = this;
    return self.handleData(self, data, self.options);
  }

  /**
   * Handle the given dynamb by relaying it.
   * @param {WebSocketServerBasic} instance //The WebSocketServerBasic instance.
   * @param {Object} dataMessage The message data.
   *
   **/
  handleData(instance, dataMessage, options) {
    let message = JSON.stringify(dataMessage);
    if (options.printErrors) {
      console.debug(
        'Attempting to send message to ',
        instance.wss.clients.size,
        ' connected client(s): ',
        message
      );
    }
    // TODO: add sequence number
    instance.wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      } else {
        console.error('barnacles-websocket: Client not ready');
      }
    });
  }
}

const authenticate = (request, options) => {
  const {token} = url.parse(request.url, true).query;

  if (options.ACCESS_TOKEN) {
    return token === options.ACCESS_TOKEN;
  } else {
    console.warn('===========================================================');
    console.warn('barnacles-websocket: WARNING                               ');
    console.warn('    ACCESS_TOKEN is not defined. Allowing all connections. ');
    console.warn('    This is not secure! Define ACCESS_TOKEN in the OPTIONS.');
    console.warn('===========================================================');
    return true;
  }
};

const createServer = (instance, options) => {
  let server;

  const CONFIG_PATH = options.PARETO_ANYWHERE_CONFIG_PATH || './config';

  try {
    let credentials = {
      cert: fs.readFileSync(path.resolve(CONFIG_PATH + '/certificate.pem')),
      key: fs.readFileSync(path.resolve(CONFIG_PATH + '/key.pem')),
    };
    server = https.createServer(credentials, instance);
  } catch (error) {
    console.info('barnacles-websocket: Websocket server is using HTTP');
    return http.createServer(instance);
  }

  console.info('barnacles-websocket: Websocket server is using HTTPS');
  return server;
};

module.exports = BarnaclesWebSocket;
