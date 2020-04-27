const express = require("express");
const http = require("http");
const socketIO = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const roomList = [{ name: "Open chat", password: "" }];
//Closed roomlist
const closedRoomList = [{name: "Closed chat", password: ""}]

app.use(express.static(__dirname + "/public"));

io.on("connection", (socket) => {
  console.log("Client connected: ", socket.id);

  socket.on("joined lobby", (data) => {
    socket.emit("room list", roomList, closedRoomList);
  });

  socket.on("add room", (data) => {
    roomList.push(data);
    io.emit("room list", roomList, closedRoomList);
    console.log(roomList[1].name + " listan är här");
  });


  socket.on("join room", (data) => {
    socket.join(data.room, () => {
      // Respond to client that join was success
      //Samma som socket.emit nedan
      socket.emit("join successful", "success");
      console.log("vi kan se rummen", socket.rooms);
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

    socket.on("leave room", () => {
      console.log("User disconnected");
      socket.leaveAll();
      console.log("VI lämnar", socket.rooms);
      io.to(room).emit("message", {
        //lägga till rummet som vi är i
        name: data.name,
        message: "Has left the room",
      });
    });
  });

  socket.on("disconnect", (data) => {
    console.log("User disconnected");

    io.to(data.room).emit("message", {
      name: data.name,
      message: ` Has left the room!`,
    });
  });
});

server.listen(3000, () => console.log("Server is running"));
