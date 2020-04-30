const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const port = 3000;
app.use(express.static(__dirname + "/public"));

//Removes any unused data from memory
if (global.gc) {
  global.gc();
}

let roomList = [
  { name: "Open chat", password: "", hasPass: false, users: 0 },
  { name: "Closed chat", password: "Pass", hasPass: true, users: 0 },
];

// Reduced list to send to client
function getNameAndHasPass() {
  let reducedList = roomList.map((room) => ({
    name: room.name,
    hasPass: room.hasPass,
  }));
  return reducedList;
}

// Adjusts how many users in one room
function handleRoomUsers(roomName, action) {
  const theRoom = roomList.filter((room) => room.name === roomName);
  if (theRoom[0] === undefined) {
    console.log("undefind stuff");
    return;
  }
  if (action === "add") {
    theRoom[0].users++;
  } else if (action === "remove") {
    theRoom[0].users--;
  }
  removeRoom();
}

function updateClientsRoomList() {
  io.emit("room list", getNameAndHasPass());
}

// If no users in room, room is removed
function removeRoom() {
  roomList.map((room) => {
    if (room.users === 0) {
      roomList = roomList.filter((x) => x.name != room.name);
    }
  });
  updateClientsRoomList();
}

io.on("connection", (socket) => {
  socket.on("joined lobby", (data) => {
    updateClientsRoomList();
  });

  socket.on("add room", (data) => {
    if (roomList.find((room) => room.name === data.name)) return;
    data.users = 0;
    // Check if room has password
    if (data.password) {
      data.hasPass = true;
    } else {
      data.hasPass = false;
    }
    roomList.push(data);
    updateClientsRoomList();
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
      updateClientsRoomList();
    });
  });

  socket.on("disconnect", (data) => {
    socket.broadcast.emit("message", {
      name: "User",
      message: ` disconnected`,
    });
    removeRoom();
  });

  //Check if password is correct
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
