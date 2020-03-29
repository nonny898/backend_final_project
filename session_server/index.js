const express = require('express')
const app = express()
const http = require('http').createServer(app);

const io = require('socket.io')(http);
app.use(express.static('lib'))
app.use(express.static('node_modules/ace-builds/src-noconflict'))
const { v4: uuidv4 } = require('uuid');


const connectedClients = new Map;

let nextUserId = 1

var createSession = function(path){
    let ses = io.of(path)
    connectedClients.set(path,0)
    ses.on('connection',function(socket){
        // console.log("Someone connected to test");
        connectedClients.set(path,connectedClients.get(path) + 1);
        console.log(connectedClients.get(path) + " connected to test");
        socket.on('disconnect',function(){
            disconnectSession(path,ses)
        })
        var userId = nextUserId++;

        console.log('connection - assigning id ' + userId);

        socket.emit('init', { id: userId })

        socket.on('message', op => { socket.broadcast.emit('message', op) })
    })
}

var disconnectSession = function(path, namespace){
    // console.log('Someone disconnected from test')
    connectedClients.set(path,connectedClients.get(path)-1)
    console.log(connectedClients.get(path) + ' clients connected to test')
    if(connectedClients.get(path) == 0){
        deleteSession(path,namespace)
    }
}

var deleteSession = function(path,session){
    console.log("Deleting namespace " + path)
    session.removeAllListeners();
    delete io.nsps[path]
}

// random session id when visiting / start from
app.get('/', (req, res) => {
    res.redirect('/'+ uuidv4())
})

app.get('/nps', (req,res) => {
    // Debugging purpose
    // getAllnamespace now 
    res.json({namespaces: Object.keys(io.nsps)})
})
app.get("/:namespace", (req,res) => {
    // Basically if you type :3000/anythinghere
    // anythinghere will be the new namespace
    createSession('/'+req.params.namespace)
    console.log('new namespace created')
    res.sendFile(__dirname + '/index.html');
})


http.listen(3000,function() {
    console.log("Listening on *:3000");
})
