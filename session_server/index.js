const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');
const redis = require('redis');
const redisAdapter = require('socket.io-redis');
const config = require('./config');
const client = redis.createClient({ host: config.REDIS_HOST, port: 6379 });

io.adapter(redisAdapter({ host: config.REDIS_HOST, port: 6379 }));
client.on('error', function(error) {
  console.error(error);
});

console.log(io.nsps)

app.use(
  cors({
    origin: `http://${config.CORS_ALLOW}`, // restrict calls to those this address
    methods: 'GET', // only allow GET requests
    credentials: true,
  })
);

// TODO Assign host to session and ability to completely close room

function getRedisChannel(room){
  return `socket.io-request#/#`
}

function updateRoomConnections(room) {
  io.sockets.adapter.clients([room],function(err,result){
    io.in(room).emit('connections', result.length);
    console.log(room + ' has ' + result.length + ' connections')
  })
}

io.on('connect', function(socket) {
  const { session } = socket.handshake.query;
  if(session == undefined){
    socket.emit('fail','No session specified')
    socket.disconnect()
    return
  }
  socket.join(session);
  client.incr('id', function(err, nextid) {
    socket.emit('init', { id: nextid });

    socket.on('message', op => {
      socket.broadcast.to(session).emit('message', op);
    });
    updateRoomConnections(session);
        socket.on('myId', id => {
          socket.broadcast.to(session).emit('myId', id);
        })
  });
  socket.on('disconnect', function() {
    updateRoomConnections(session);
  });
});

app.get('/', (req, res) => {
  res.send('ok');
});

app.get('/create', (req, res) => {
  const id = req.get('userId')
  if(id == undefined){
    res.sendStatus(401)
  }
  else{
    const sesName = uuidv4();
    res.send(sesName);
  }
});

app.get('/list', (req, res) => {
  res.send(io.sockets.adapter.rooms);
});

http.listen(3000, function() {
  console.log('Listening on *:3000');
});
