import { onMessageReceived } from "./chat.js";
import { socket } from "./logic.js";

// enter lobby of chat

function handleRoomList(data) {
  console.log(JSON.stringify(data) + " : roomList?");

  const list = data.map(function (item) {
    let sidebarList = document.querySelector(".roomlist");
    let listInSidebar = document.createElement("button");
    listInSidebar.innerText = item.name;
    listInSidebar.className = "listelementsInSidebar";
    // const listName = document.createElement()
    sidebarList.append(listInSidebar);
  });
}

// Display new list in room view
export function enterLobby(event) {
  event.preventDefault();

  socket.emit("joined lobby");
  socket.on("room list", handleRoomList);

  document.querySelector(".join.ui").classList.add("hidden");
  document.querySelector(".chat.ui").classList.add("hidden");
  document.querySelector(".lobby").classList.remove("hidden");
  document.querySelector(".sidebar").classList.remove("hidden");

  const name = document.querySelector(".join.ui input").value;

  //Join Room handler
  const joinRoom = document.querySelector(".bodyInMain ");
  joinRoom.addEventListener("submit", (event) => {
    event.preventDefault();
    onJoinRoom(name);
  });

  //Add room handler
  const userCanAddRoom = document.querySelector(".sidebar form");
  console.log(userCanAddRoom + " : htmlelement");
  userCanAddRoom.addEventListener("submit", (event) => {
    event.preventDefault();
    addRoom();
  });
}

// user can create room
function addRoom() {
  document.querySelector(".addRoom").classList.remove("hidden");
  document.querySelector(".lobby").classList.add("hidden");

  const submitRoom = document.querySelector(".addRoom");
  submitRoom.addEventListener("submit", (event) => {
    event.preventDefault();

    const roomName = document.getElementById("roomName").value;
    const password = document.getElementById("password").value;

    const roomObj = {
      name: roomName,
      password: password,
    };

    console.log(roomName + "här är namnet");

    socket.emit("add room", roomObj);
  });
}

function onJoinRoom(data) {
  // event.preventDefault();
  console.log("är i rum");
  document.querySelector(".lobby").classList.add("hidden");
  document.querySelector(".chat.ui").classList.remove("hidden");

  //   const roomInput = document.querySelector(".join.ui input");

  const name = data;
  console.log(name);
  const room = "Chatroom!"; //roomInput.value;

  socket.emit("join room", { name, room });
  socket.on("message", onMessageReceived);
}
