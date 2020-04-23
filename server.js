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
            //Broadcast messages to all clients in the room
      io.to(data.room).emit('message', { name: data.name, message })
    })
  })
  
})

/*   io.on('disconnect', (socket) => {
      console.log('User disconnected');

      socket.on('leave room', (data) => {
          socket.leave(data.room, () => {
            io.to(socket.id).emit('leave successful', 'leaving')

            io.to(data.room).emit(
                'message', 
                {
                  name: data.name,
                   message: ` Has left the room!`},
                )
          })
          
      })
      
  }) */



server.listen(3000, () => console.log('Server is running'))




