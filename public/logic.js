import { enterLobby, onJoinRoom } from "./lobby.js";
import { onMessageReceived } from "./chat.js";


// import { onLeaveRoom } from "./lobby.js";

export const socket = io();

window.addEventListener("load", () => {
  setupEventListeners();
});

function setupEventListeners() {
  //Enter lobby handler
  const joinForm = document.querySelector("form.join.ui");
  joinForm.addEventListener("submit", enterLobby);

  //socket io events
  socket.on("join successful", loadChatUi);
  // socket.on("add successful", onJoinRoom);
  socket.on("message", onMessageReceived);
}

function loadChatUi(data) {
  console.log(data);
  document.querySelector(".join.ui").classList.add("hidden");
  document.querySelector(".chat.ui").classList.remove("hidden");
  document.querySelector(".lobby").classList.add("hidden");
  document.querySelector(".enterPassword").classList.add("hidden")

  let chatName = document.querySelector(".chatName")
  const para = document.createElement("p")
  para.innerText = data
  chatName.append(para)
  // document.querySelector(".sidebar").classList.remove("hidden");
}
