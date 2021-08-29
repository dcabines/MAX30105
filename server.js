// Serve Webpage
const http = require('http');
const statik = require('node-static');
var fileServer = new statik.Server('./public');

http.createServer((request, response) => {
  request.addListener('end', () => fileServer.serve(request, response)).resume();
}).listen(8080);

// Serve Websocket
const ws = require('ws');
const connections = [];
const webSocketServer = new ws.Server({ port: 8081 });

webSocketServer.on('connection', client => {
  connections.push(client);
  console.log(`clients: ${connections.length}`);

  client.on('close', () => {
    const index = connections.indexOf(client);
    connections.splice(index, 1);
  });
});

// Read from serial port
const serialport = require('serialport');
const com5 = new serialport('COM5', 9600);
const parser = new serialport.parsers.Readline();
com5.pipe(parser);

// Send serial port data to websocket
parser.on('data', data => connections.forEach(x => x.send(data)));