const express = require("express");
const http = require("http");
const socketIO = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const roomList = [
  { name: "Open chat", password: "" },
  { name: "Room nomero ono", password: "" },
  { name: "Closed chat", password: "Pass" },
  { name: "Closed ", password: "ss" },
];

app.use(express.static(__dirname + "/public"));

io.on("connection", (socket) => {
  console.log("Client connected: ", socket.id);

  socket.on("joined lobby", (data) => {
    socket.emit("room list", roomList);
  });

  socket.on("add room", (data) => {
    if (roomList.find((room) => room.name === data.name)) return;
    roomList.push(data);
    io.emit("room list", roomList);
    console.log(roomList[1].name + " listan är här");
    socket.emit("add successful", data.name);
  });

  socket.on("join room", (data) => {
    // socket.removeAllListeners("message");
    socket.join(data.room, () => {
      console.log("vi kan se rummet" + JSON.stringify(data.room));
      // Respond to client that join was success
      socket.emit("join successful", "success");

      //Broadcast message to all clients in the room
      io.to(data.room).emit("message", {
        name: data.name,
        message: ` Has joined the room!`,
      });
    });

    socket.on("message", (message) => {
      console.log("servermessage");
      //Broadcast messages to all clients in the room
      io.to(data.room).emit("message", { name: data.name, message });
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
});

server.listen(3000, () => console.log("Server is running"));
