import { socket } from "./logic.js";

// UI for chatwindow
export function loadChatUi(data) {
  console.log(data);
  document.querySelector(".join.ui").classList.add("hidden");
  document.querySelector(".chat.ui").classList.remove("hidden");
  document.querySelector(".lobby").classList.add("hidden");
  document.querySelector(".enterPassword").classList.add("hidden");
}

// Send message submit handler
const messageForm = document.querySelector(".chat.ui form");
messageForm.addEventListener("submit", onSendMessage);

export function onMessageReceived({ name, message }) {
  console.log("i messageONRecieve");
  const ul = document.querySelector(".chatMessageUl");
  const li = document.createElement("li");
  li.innerText = `${name}: ${message}`;
  ul.append(li);
}

function onSendMessage(event) {
  event.preventDefault();
  const input = document.querySelector(".chat.ui form input");
  console.log("nu är vi i onsendmessage");
  socket.emit("message", input.value);
  input.value = "";
}
