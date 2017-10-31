//const commands = require('./commands');
const net = require('net');
const events = require('events');

//params is an object
//might need to make this a promise
module.exports = class Pad extends events.EventEmitter {
  constructor() {
    super();

    this.socket = null;
  }


  connect(params) {
    const host = (typeof params.host !== 'undefined' ? params.host : '127.0.0.1');
    const port = (typeof params.port !== 'undefined' ? params.port : '5741');
    console.log('connect called');

    this.socket = net.createConnection({port, host}, () => {
        this.emit('connect');
    });

    //want data sent to UI
    this.socket.on('data', (data) => {
      //send the data to UI
      console.log(data.toString('utf-8'));
      return this.emit('data', data);
    });

    //error
    this.socket.on('error', error => {
      this.emit('error', error);
    });

    //socket closed
    this.socket.on('close', () => {
      console.log('connection closed');
      this.emit('close');
    });
  }

  //send command
  sendCommand(command) {
    pCom = commands[command];

    pCom += "\n";

    //'rng vals 1 1 0'
    this.socket.write(pCom);
  }

  getSocket() {
    return this.socket;
  }
}
