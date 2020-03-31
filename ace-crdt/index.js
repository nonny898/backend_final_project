"use strict";

const express = require('express')
  , app = express()
  , server = require('http').Server(app)
  , port = Number(process.env.PORT) || 5000

app.use(express.static('lib'))
app.use(express.static('node_modules/ace-builds/src-noconflict'))

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
})

server.listen(port, function () {
  console.log('listening on *:' + port);
})
