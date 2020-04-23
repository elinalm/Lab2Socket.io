const socket = io();

window.addEventListener("load", () => {
  setupEventListeners();
});

function setupEventListeners() {
  //Join submit handler
  const joinForm = document.querySelector("form.join.ui");
  joinForm.addEventListener("submit", onJoinRoom);

  // Send message submit handler
  const messageForm = document.querySelector(".chat.ui form");
  messageForm.addEventListener("submit", onSendMessage);

  //socket io events
  socket.on("join successful", loadChatUi);
  socket.on("message", onMessageReceived);
}

function onJoinRoom(event) {
  event.preventDefault();
  const [nameInput, roomInput] = document.querySelectorAll(".join.ui input");

  const name = nameInput.value;
  const room = roomInput.value;

  socket.emit("join room", { name, room });
}

function onSendMessage(event) {
  event.preventDefault();
  const input = document.querySelector(".chat.ui form input");
  socket.emit("message", input.value);
  input.value = "";
}

function loadChatUi(data) {
  console.log(data);
  document.querySelector(".join.ui").classList.add("hidden");
  document.querySelector(".chat.ui").classList.remove("hidden");
  // document.querySelector(".mainSite").classList.remove("hidden");
}

function onMessageReceived({ name, message }) {
  const ul = document.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = `${name}: ${message}`;
  ul.append(li);
}
