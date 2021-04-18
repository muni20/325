const express = require('express')
const path = require('path')
const http = require('http')
const PORT = process.env.PORT || 3000
const socketio = require('socket.io')
const app = express()
const server = http.createServer(app)
const io = socketio(server)

// Set static folder
app.use(express.static(path.join(__dirname,"public")))

// Start server
server.listen(PORT,()=>console.log(`Server running on port ${PORT}`))

// Handle a socket connection request from web client
const connections=[null,null,null]
io.on('connection',socket=>{
    // console.log('new WS Conection')

    // Find an available player number
    let playerIndex = -1;
    for(const i in connections){
        if(connections[i]=== null){
            playerIndex = i
            break
        }
    }

    //Tell the connecting client what player number they are
    socket.emit('player-number ', playerIndex)
    console.log(`Player ${playerIndex} has connected`)

     //ignore player 4
     if(playerIndex ===-1) return

     connections[playerIndex] = false

     //Tell everyone what player number just connected
     socket.broadcast.emit('player-connection', playerIndex)

     // Handle Disconnect
     socket.on('disconnect',()=>{
         console.log(`Player ${playerIndex} disconnected`)
         connections[playerIndex] = null
         //Tell everyone what player number just disconneced 
         socket.broadcast.emit('player-connection', playerIndex)
     })
})