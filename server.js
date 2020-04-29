const express = require("express");
const http = require("http");
const socketIO = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const roomList = [
  { name: "Open chat", password: "", hasPass: false },
  { name: "Room nomero ono", password: "", hasPass: false },
  { name: "Closed chat", password: "Pass", hasPass: true },
  { name: "Closed ", password: "ss", hasPass: true },
];

function getNameAndHasPass() {
  let reducedList = roomList.map((room) => ({
    name: room.name, 
    hasPass: room.hasPass
  }))
  return reducedList
}

app.use(express.static(__dirname + "/public"));

io.on("connection", (socket) => {
  console.log("Client connected: ", socket.id);

  socket.on("joined lobby", (data) => {
    socket.emit("room list", getNameAndHasPass());
  });

  socket.on("add room", (data) => {
    if (roomList.find((room) => room.name === data.name)) return;

    if(data.password) {
      data.hasPass = true
    } else {
      data.hasPass = false
    }
    roomList.push(data);
    io.emit("room list", getNameAndHasPass());
    socket.emit("add successful", data.name);
  });

  socket.on("join room", (data) => {
    socket.removeAllListeners("message")

    socket.join(data.room, () => {
     
      // Respond to client that join was success
      socket.emit("join successful", "success");

      //Broadcast message to all clients in the room
      io.to(data.room).emit("message", {
        name: data.name,
        message: ` Has joined the room!`,
      });

      socket.on("message", (message) => {
        //Broadcast messages to all clients in the room
        io.to(data.room).emit("message", { name: data.name, message });
      });
    });
  });

  
  socket.on("leave room", (data) => {
    socket.leave(data.room, () => {
      io.to(data.room).emit("message", {
        name: data.name,
        message: " has left the room!",
      });
    });
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("message", {
      name: "User",
      message: ` disconnected`,
    });
  });

  socket.on("password check", (data) => {
    const roomToCheck = roomList.filter((room) => room.name === data.name);
    if (roomToCheck[0].password === data.password) {
      socket.emit("did pass", true);
    } else {
      socket.emit("did pass", false);
    }
  });

});

server.listen(3000, () => console.log("Server is running"));
