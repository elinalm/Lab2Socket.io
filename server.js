const express = require('express')
const http = require('http')
const socketIO = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketIO(server)


app.use(express.static(__dirname + '/public'))

io.on('connection', (socket) => {
  console.log('Client connected: ', socket.id);

  socket.on('join room', (data) => {
    socket.join(data.room, () => {
      // Respond to client that join was success
      //Samma som socket.emit nedan
      io.to(socket.id).emit('join successful', 'success')

      //Broadcast message to all clients in the room
      io.to(data.room).emit(
        'message', 
        {
          name: data.name,
           message: ` Has joined the room!`},
        )
    })

    socket.on('message', (message) => {
            //Broadcast message to all clients in the room
      io.to(data.room).emit('message', { name: data.name, message })
    })
  })
  
})


server.listen(3000, () => console.log('Server is running'))




