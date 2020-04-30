import { enterLobby } from "./lobby.js";
import { onMessageReceived, loadChatUi } from "./chat.js";

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
  socket.on("message", onMessageReceived);
}
