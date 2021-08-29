const ws = require('ws');
const wss = new ws.Server({ port: 8081 });
const connections = [];

const serialport = require('serialport');
const port = new serialport('COM5', 9600);
const parser = new serialport.parsers.Readline();

wss.on('connection', (client) => {
  console.log("New Connection");
  connections.push(client);

  client.on('close', () => {
    console.log("connection closed");
    const position = connections.indexOf(client);
    connections.splice(position, 1);
  });
});

port.pipe(parser);
// parser.on('close', () => writeStream.end());

parser.on('data', data => {
  for (const connection of connections) {
    connection.send(data);
  }
});