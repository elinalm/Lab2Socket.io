const express = require("express");
const http = require("http");
const socketIO = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const port = 3000;

let roomList = [
  { name: "Open chat", password: "", hasPass: false, users: 0 },
  { name: "Closed chat", password: "Pass", hasPass: true, users: 0 },
];

function getNameAndHasPass() {
  let reducedList = roomList.map((room) => ({
    name: room.name,
    hasPass: room.hasPass,
  }));
  return reducedList;
}

function handleRoomUsers(roomName, action) {
  const theRoom = roomList.filter((room) => room.name === roomName);
  if (action === "add") {
    theRoom[0].users++;
  } else if (action === "remove") {
    theRoom[0].users--;
  }

  // Removes room from list if empty
  if (theRoom[0].users === 0) {
    roomList = roomList.filter((x) => x.name != theRoom[0].name);
  }
}

function sendListToClient(socket) {
  socket.emit("room list", getNameAndHasPass());
}

app.use(express.static(__dirname + "/public"));

io.on("connection", (socket) => {
  socket.on("joined lobby", (data) => {
    sendListToClient(socket);
  });

  socket.on("add room", (data) => {
    if (roomList.find((room) => room.name === data.name)) return;
    console.log(JSON.stringify(data));
    data.users = 0;
    if (data.password) {
      data.hasPass = true;
    } else {
      data.hasPass = false;
    }
    roomList.push(data);
    io.emit("room list", getNameAndHasPass());
    socket.emit("add successful", data.name);
  });

  socket.on("join room", (data) => {
    socket.removeAllListeners("message");

    socket.join(data.room, () => {
      // Respond to client that join was success
      socket.emit("join successful", "success");
      handleRoomUsers(data.room, "add");

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
    handleRoomUsers(data.room, "remove");
    socket.leave(data.room, () => {
      io.to(data.room).emit("message", {
        name: data.name,
        message: " has left the room!",
      });
      sendListToClient(socket);
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

server.listen(port, () => console.log("Server is running on port", port));
