import { socket } from "./logic.js";

// Send message submit handler
const messageForm = document.querySelector(".chat.ui form");
messageForm.addEventListener("submit", onSendMessage);

export function onMessageReceived({ name, message }) {
  console.log("i messageONRecieve");
  const ul = document.querySelector(".chatMessageUl");
  const li = document.createElement("li");
  li.innerText = `${name}: ${message}`;
  ul.append(li);
  // li.innerText = "";
}

function onSendMessage(event) {
  event.preventDefault();
  const input = document.querySelector(".chat.ui form input");
  console.log("nu är vi i onsendmessage");
  socket.emit("message", input.value);
  input.value = "";
}
