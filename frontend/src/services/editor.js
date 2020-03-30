import config from '../services/app.config'
"use strict";

const editor = ace.edit('editor')
var socket

let rga
if (!rga) {
  editor.setWrapBehavioursEnabled(false)
  rga = new RGA.AceEditorRGA('testuser', editor)
}


var createSession = function () {
  if (socket != null) {
    console.log("Already connected to session")
    return
  }
  var xmlHttp = new XMLHttpRequest();
  console.log("Creating request to make session")
  xmlHttp.onreadystatechange = function () {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
      opensocket(xmlHttp.responseText)
  }
  xmlHttp.open('GET', `http://${config.SESSION_ADDR}/create`, true);
  xmlHttp.send(null);
}

function joinSession(path) {
  if (socket != null) {
    socket.removeAllListeners()
    socket.disconnect()
  }
  socket = io(`ws://${config.SESSION_ADDR}/` + path)
  console.log("Connecting to session " + path)
  socket.on('init', ({
    id,
    history
  }) => {
    editor.setWrapBehavioursEnabled(false)
    rga = new RGA.AceEditorRGA(id, editor)
    rga.subscribe(op => {
      socket.emit('message', op)
    })

    socket.on('message', op => {
      rga.receive(op)
      console.log("Got message")
    })

    socket.emit('message', {
      type: 'historyRequest'
    })
    editor.focus()
  });
}

function opensocket(url) {
  console.log("Got reply for socket session " + url)
  socket = io(`ws://${config.SESSION_ADDR}/` + url)
  socket.on('init', ({
    id,
    history
  }) => {
    if (!rga) {
      editor.setWrapBehavioursEnabled(false)
      rga = new RGA.AceEditorRGA('host', editor)
    }
    rga.subscribe(op => {
      socket.emit('message', op)
    })

    socket.on('message', op => {
      rga.receive(op)
    })

    socket.emit('message', {
      type: 'historyRequest'
    })
    editor.focus()
  });
}
editor.focus()