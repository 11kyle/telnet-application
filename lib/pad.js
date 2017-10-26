const commands = require('commands');
const net = require('net');
var socket = null;

//params is an object
function connect(params) {
  const host = (typeof params.host !== 'undefined' ? params.host : '127.0.0.1');
  const port = (typeof params.port !== 'undefined' ? params.port : '5741');

  socket = net.createConnection({port, host}, () => {
    console.log('connected');
  });
}

//send command
function sendCommand(command) {
  pCom = commands[command];

  pCom += "\n";

  //'rng vals 1 1 0'
  socket.write(pCom);
}

//want data sent to UI
socket.on('data', (data) => {
  //send the data to UI
  console.log(data.toString('utf-8'));
});

//socket closed
socket.on('close', () => {
  console.log('connection closed');
});
