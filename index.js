// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static('public'));

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

io.on('connection', function(socket){
  var clientSessionInfo = {};
  clientSessionInfo.id = socket.id;
  clientSessionInfo.color = getRandomColor();
  socket.send(clientSessionInfo);

  socket.on('chat message', function(msg){
    console.log(msg);
    io.emit('chat message', msg);
  });

  socket.on('drawingCoords', function(msg){
    io.emit('updateClients', msg)
  });

  socket.on('clientConnections', function(data) {
    io.emit('clientConnections', data);
  })

  socket.on('eraseCanvas', function (client) {
    io.emit('eraseCanvas', client);
  });

  socket.on('disconnect', function(msg) {
    io.emit('disconnect', socket.id);
    // console.log('Disconnected');
    // console.log(socket.id);
  })
});
