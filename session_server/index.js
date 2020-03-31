const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');
const redis = require('redis');
const redisAdapter = require('socket.io-redis');
const config = require('./config');
// console.log("Redis host env variable: " + config.REDIS_HOST)
const client = redis.createClient({ host: config.REDIS_HOST, port: 6379 });

io.adapter(redisAdapter({ host: config.REDIS_HOST, port: 6379 }));
client.on('error', function(error) {
  console.error(error);
});

app.use(
  cors({
    origin: `http://${config.CORS_ALLOW}`, // restrict calls to those this address
    methods: 'GET', // only allow GET requests
    credentials: true,
  })
);

function statusKey(session) {
  return `${session}-active`;
}

// TODO If server goes down then session never closes as socket.io reconnects and bumps up connected
// clients number. If server goes down disconnect function is never called. Consider replacing with
// a heartbeat function to check number of connected clients

function updateRoomConnections(room) {
  if (io.sockets.adapter.rooms[room] != undefined)
    io.in(room).emit('connections', io.sockets.adapter.rooms[room].length);
}

io.on('connect', function(socket) {
  const { session } = socket.handshake.query;
  // console.log(socket.handshake.query)
  client.get(statusKey(session), function(err, value) {
    if (value !== 'true') socket.disconnect();
    else {
      socket.join(session);
      client.incr('id', function(err, nextid) {
        console.log(
          `${io.sockets.adapter.rooms[session].length} clients connected to ${session}`
        );
        socket.emit('init', { id: nextid });

        socket.on('message', op => {
          socket.broadcast.to(session).emit('message', op);
        });
        updateRoomConnections(session);
      });
      client.incr(session, function(err, connected) {
        // console.log(`${session} has ${connected} connections`);
      });
      socket.on('disconnect', function() {
        updateRoomConnections(session);
        disconnectSession(session);
      });
    }
  });
});

const createSession = function(path, callback) {
  client.set(path, 0);
  client.set(statusKey(path), 'true', callback);
};

var disconnectSession = function(path) {
  // console.log('Someone disconnected from test')
  client.decr(path, function(err, connected) {
    console.log(`${connected} clients connected to ${path}`);
    if (connected == 0) {
      deleteSession(path);
    }
  });
};

var deleteSession = function(path) {
  client.set(path, -1);
  client.set(statusKey(path), 'false');
};

app.get('/', (req, res) => {
  res.send('ok');
});

app.get('/create', (req, res) => {
  const sesName = uuidv4();
  createSession(sesName, function() {
    res.send(sesName);
  });
});

app.get('/list', (req, res) => {
  res.send(io.sockets.adapter.rooms);
});

http.listen(3000, function() {
  console.log('Listening on *:3000');
});
