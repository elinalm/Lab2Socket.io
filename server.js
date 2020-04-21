const express = require('express')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)

const port = 3000 

app.use(express.static('public'))

io.on('connection', (socket) => {
   
    io.on ('join room', (data) => {
        socket.join(1)
    })

    console.log('A new connection');
    
    socket.on('message', (incoming) => {
        io.emit('message', incoming)
    })

    socket.on('disconnent', () => {
        console.log('user disconnected');
        
    })
})


http.listen(port, () => {
    console.log('listening on port' + port);
    
})




