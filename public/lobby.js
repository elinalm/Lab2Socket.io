import { onMessageReceived } from "./chat.js";
import { socket } from "./logic.js";

let username;
let roomList;

// enter lobby of chat

// Display new list in room view
export function enterLobby(event) {
  event.preventDefault();

  socket.emit("joined lobby");
  socket.on("room list", handleRoomList);

  document.querySelector(".join.ui").classList.add("hidden");
  document.querySelector(".chat.ui").classList.add("hidden");
  document.querySelector(".lobby").classList.remove("hidden");
  document.querySelector(".sidebar").classList.remove("hidden");

  username = document.querySelector(".join.ui input").value;

  //Add room handler
  const userCanAddRoom = document.querySelector(".sidebar form");
  console.log(userCanAddRoom + " : htmlelement");
  userCanAddRoom.addEventListener("submit", (event) => {
    event.preventDefault();
    addRoom();
  });
}
const submitRoom = document.querySelector(".addRoom");
submitRoom.addEventListener("submit", (event) => {
  event.preventDefault();

  const roomName = document.getElementById("roomName").value;
  const password = document.getElementById("password").value;

  const roomObj = {
    name: roomName,
    password: password,
  };
  socket.emit("add room", roomObj);
});

// user can create room
function addRoom() {
  document.querySelector(".addRoom").classList.remove("hidden");
  document.querySelector(".lobby").classList.add("hidden");
}

function handleRoomList(data) {
  roomList = data;
  let sidebarList = document.querySelector(".roomlist");
  sidebarList.innerHTML = "";

  roomList.forEach((room, index) => {
    let buttonInSidebar = document.createElement("button");
    buttonInSidebar.innerText = room.name;
    console.log(index);
    buttonInSidebar.className = "listelementsInSidebar";
    sidebarList.appendChild(buttonInSidebar);
  });
  console.log(JSON.stringify(roomList) + " : roomList!");

  let buttons = document.querySelectorAll(".listelementsInSidebar");
  buttons.forEach((button, index) => {
    button.addEventListener("click", () => {
      console.log(button, index);
      selectRoom(index);
    });
  });
}

function selectRoom(roomIndex) {
  console.log(roomIndex);
  let roomName = roomList[roomIndex];
  console.log(JSON.stringify(roomName) + " : roomanme?!");
  onJoinRoom(roomName);
}

export function onJoinRoom(roomName) {
  document.querySelector(".lobby").classList.add("hidden");
  document.querySelector(".chat.ui").classList.remove("hidden");
  document.querySelector(".addRoom").classList.add("hidden");
  document.querySelector(".sidebar").classList.add("hidden");

  socket.emit("join room", { name: username, room: roomName });
  socket.on("message", onMessageReceived);

  // Leave room button
  const leaveRoom = document.querySelector(".leaveRoomButton");
  leaveRoom.addEventListener("click", () => {
    onLeaveRoom(roomName);
  });
}

// Leaving the chat room
function onLeaveRoom(roomName) {
  console.log(roomName.name, ": detta är roomname");
  socket.emit("leave room", { name: username, room: roomName.name }); // Här behlöver vi skicka med data på rummet
  console.log("nu lämnar vi");

  document.querySelector(".join.ui").classList.add("hidden");
  document.querySelector(".chat.ui").classList.add("hidden");
  document.querySelector(".lobby").classList.remove("hidden");
  document.querySelector(".sidebar").classList.remove("hidden");

  // document.querySelector(".chatMessageUl").innerHTML = "";
}
