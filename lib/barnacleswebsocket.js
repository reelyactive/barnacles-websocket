/**
 * Copyright reelyActive 2023
 * We believe in an open Internet of Things
 */


const WebSocket = require('ws');


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
    options = options || {};

    this.printErrors = options.printErrors || DEFAULT_PRINT_ERRORS;

    // Use the provided WebSocket server instance
    if(options.wss) {
      this.wss = options.wss;
    }

    // Use the provided HTTP(S) server
    else if(options.server) {
      this.wss = new WebSocket.WebSocketServer({ server: options.server });
    }

    // Have WebSocketServer create a new server on the given port
    else {
      let port = options.port || DEFAULT_PORT;
      this.wss = new WebSocket.WebSocketServer({ port: port });
    }

    this.wss.on('connection', (ws) => {
      if(self.printErrors) {
        ws.on('error', console.error);
      }
    });
  }

  /**
   * Handle an outbound event.
   * @param {String} name The event name.
   * @param {Object} data The outbound event data.
   */
  handleEvent(name, data) {
    let message = JSON.stringify({ type: name, data: data });
    this.wss.clients.forEach((client) => {
      if(client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }

}


module.exports = BarnaclesWebSocket;
