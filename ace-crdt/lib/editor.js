// "use strict";

const editor = ace.edit('editor')
const curMgr = new AceCollabExt.AceMultiCursorManager(editor.getSession());

const colors = ['orange', 'green', 'blue']
editor.setTheme('ace/theme/monokai');

var session = editor.getSession()
var doc = session.getDocument();

session.setMode('ace/mode/javascript');
// session.setValue(`var you = 'are awesome'`);

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
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) opensocket(xmlHttp.responseText)

  }
  xmlHttp.open('GET', `http://${config.SESSION_ADDR}/create`, true);
  xmlHttp.send(null);
};

function joinSession(path) {
  if (socket != null) {
    socket.removeAllListeners()
    socket.disconnect()
  }
  opensocket(path, true)
}

function opensocket(url, joiner) {
  console.log("Opening socket on url " + url)
  socket = io('http://' + config.SESSION_ADDR, {
    query: 'session=' + url
  })


  
  // This process is async that's why
  socket.on('init', ({
    id,
    history
  }) => {
    console.log("Got id " + id)

    
    
      socket.emit('myId', `${id}`)
      socket.on('myId', (id) => {
        console.log('re ', id )
        curMgr.addCursor(`${id}`, `User ${id}`, colors[id%3])
      })
    

    rga = new RGA.AceEditorRGA(id, editor)

    rga.subscribe(op => {
      socket.emit('message', op)
    })

    socket.on('message', 
    op => {
      if (op.type === 'cursorRequest') makeCursorChange(op)
      else rga.receive(op)})
      
    socket.emit('message', {
        type: 'historyRequest',
        sender: id
    })

    const allTexts = doc.getAllLines().join('\n');
      session.setValue(allTexts)

    editor.focus()
  });
}

let notSet = true
function makeCursorChange(op){

  try {
  curMgr.setCursor(`${op.sender}`, op.position);
  }
  catch(err) {
    curMgr.addCursor(`${op.sender}`, `User ${op.sender}`, colors[op.sender%3])
    curMgr.setCursor(`${op.sender}`, op.position);


  }


}

editor.focus();
