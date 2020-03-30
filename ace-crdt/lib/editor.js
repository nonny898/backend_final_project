"use strict";

const editor = ace.edit('editor')
var socket

const serveradr = '192.168.39.37:30113/'

let rga
if (!rga) {
  editor.setWrapBehavioursEnabled(false)
  rga = new RGA.AceEditorRGA('host', editor)
}

var createSession = function() {
  if(socket != null){
    console.log("Already connected to session")
    return
  }
  var xmlHttp = new XMLHttpRequest();
  console.log("Creating request to make session")
  xmlHttp.onreadystatechange = function() {
    if(xmlHttp.readyState == 4 && xmlHttp.status == 200)
      opensocket(xmlHttp.responseText)
  }
  xmlHttp.open('GET', 'http://' + serveradr + 'create', true);
  xmlHttp.send(null);
}

function joinSession(path){
  if(socket != null){
    socket.removeAllListeners()
    socket.disconnect()
  }
  opensocket(path)
}

function opensocket(url){
  console.log("Opening socket on url " + url)
  socket = io('ws://' + serveradr ,{query: 'session=' + url})
  socket.on('init', ({ id, history }) => {
    console.log("Got id " + id)
    editor.setWrapBehavioursEnabled(false)
    rga = new RGA.AceEditorRGA(id, editor)
    rga.subscribe(op => { socket.emit('message', op) })
  
    socket.on('message', op => { 
      rga.receive(op) 
      console.log(op)
    })
  
    socket.emit('message', { type: 'historyRequest' })
    editor.focus()
  });
}
editor.focus()