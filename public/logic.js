import { enterLobby } from "./lobby.js";

export const socket = io();

window.addEventListener("load", () => {
  setupEventListeners();
});

function setupEventListeners() {
  //Enter lobby handler
  const joinForm = document.querySelector("form.join.ui");
  joinForm.addEventListener("submit", enterLobby);

  // Leave room
  const leaveRoom = document.querySelector(".leaveRoomButton");
  leaveRoom.addEventListener("click", onLeaveRoom);

  //socket io events
  socket.on("join successful", loadChatUi);
  /*   socket.on("leave successful", loadStartpage);
   */
}

function onLeaveRoom(event) {
  event.preventDefault();
  socket.emit("leave room"); // Här behlöver vi skicka med data på rummet
  console.log("nu lämnar vi");
}

function loadChatUi(data) {
  console.log(data);
  document.querySelector(".join.ui").classList.add("hidden");
  document.querySelector(".chat.ui").classList.remove("hidden");
  document.querySelector(".lobby").classList.add("hidden");
  document.querySelector(".sidebar").classList.remove("hidden");
  // document.querySelector(".mainSite").classList.remove("hidden");
}

/* function loadStartpage() {
    
    location.reload()
    
} */
