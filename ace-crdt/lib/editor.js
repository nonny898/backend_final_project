"use strict";

const editor = ace.edit('editor')
editor.setTheme('ace/theme/monokai');

const serveradr = '192.168.39.37:30113/'
var session = editor.getSession()
var doc = session.getDocument();

session.setMode('ace/mode/javascript');
session.setValue(`var you = 'are awesome;'`);

var socket = null;
var joined = null;

editor.setWrapBehavioursEnabled(false)
let rga

var createSession = function() {
  // save the whole text and paste fast
  if (socket != null) {
    console.log("Already connected to session")
    return
  }

  var xmlHttp = new XMLHttpRequest();
  console.log("Creating request to make session")
  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) opensocket(xmlHttp.responseText, true)

  }
  xmlHttp.open('GET', 'http://' + serveradr + 'create', true);
  xmlHttp.send(null);
};

function joinSession(path) {
  if (socket != null) {
    socket.removeAllListeners()
    socket.disconnect()
  }
  opensocket(path, false)
}

function opensocket(url, isCreator) {
  console.log("Opening socket on url " + url)
  socket = io('ws://' + serveradr, {
    query: 'session=' + url
  })
  // This process is async that's why
  socket.on('init', ({
    id,
    history
  }) => {
    console.log("Got id " + id)
    rga = new RGA.AceEditorRGA(id, editor)

    rga.subscribe(op => {
      socket.emit('message', op)
    })

    socket.on('message', op => rga.receive(op))

    // Only ask for the history when you joined the session
    if (!isCreator) socket.emit('message', {
      type: 'historyRequest'
    })
    // you are the creator save all text and commit the change to the history
    else {
      const allTexts = doc.getAllLines().join('\n');
      session.setValue(allTexts)
    }
    editor.focus()
  });
}
editor.focus();
