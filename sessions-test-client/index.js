const app = require('express')();
const http = require('http').createServer(app)
const io = require('socket.io-client')
const axios = require('axios')

const server = process.env.SOCKET_SERVER || 'localhost:3500'

console.log("Server ip set to " + server)

const connections = new Map()

app.get('/create', function(req,res){
    axios.get(`http://${server}/create`).then(response => {
        connections.set(response.data,[])
        const testSocket = io(`ws://${server}`,{query: `session=${response.data}`})
        connections.get(response.data).push(testSocket)
        testSocket.on('connections',(cns) => {console.log(`${cns} connected to ${response.data}`)})
        res.send(response.data)
    }).catch(error => {
        res.send(error)
    })
})

app.get('/checkrooms', function(req,res){
    console.log(connections.keys())
    res.send(connections.keys())
})

app.get('/connect',function(req,res){
    const room = req.query.room
    if(room == undefined){
        res.sendStatus(400)
        return
    }
    if(connections.has(room)){
        const newcon = io(`ws://${server}`,{query: `session=${room}`})
        connections.get(room).push(newcon)
        newcon.on('connections',(cns) => {console.log(`${cns} connected to ${room}`)})
        res.send('ok')
    }
    else{
        res.sendStatus(404)
    }
})

app.get('/disconnect', function(req,res){
    const room = req.query.room
    if(room == undefined){
        res.sendStatus(400)
        return
    }
    if(connections.has(room)){
        const scket = connections.get(room).pop()
        scket.disconnect()
        if(connections.get(room).length == 0){
            connections.delete(room)
            res.send("Last client disconnected from room " + room)
        }
        else{
            res.send("ok")
        }
    }
    else{
        res.sendStatus(404)
    }
})

http.listen(3456,function() {
    console.log("Listening on 3456")
})