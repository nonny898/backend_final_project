const app = require('express')
const http = require('http').createServer(app);
const io = require('socket.io')(http);

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

createSession('/test')

http.listen(3000,function() {
    console.log("Listening on *:3000");
})
