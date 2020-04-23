const socket = io();

window.addEventListener("load", () => {
  setupEventListeners();
});

function setupEventListeners() {
  //Enter lobby handler
  const joinForm = document.querySelector("form.join.ui");
  joinForm.addEventListener("submit", enterLobby);

  // Send message submit handler
  const messageForm = document.querySelector(".chat.ui form");
  messageForm.addEventListener("submit", onSendMessage);

  //socket io events
  socket.on("join successful", loadChatUi);
  socket.on("message", onMessageReceived);
}

// enter lobby of chat
function enterLobby(event) {
  event.preventDefault();

  document.querySelector(".join.ui").classList.add("hidden");
  document.querySelector(".chat.ui").classList.add("hidden");
  document.querySelector(".lobby").classList.remove("hidden");
  document.querySelector(".sidebar").classList.remove("hidden");

  const name = document.querySelector(".join.ui input").value;
  //Join Room handler
  // const joinRoom = document.querySelector(".bodyInMain ");
  // joinRoom.addEventListener("submit", (event) => {
  //   event.preventDefault();
  //   onJoinRoom(name);
  // });

  //Add room handler
  const userCanAddRoom = document.querySelector(".sidebar ");

  userCanAddRoom.addEventListener("submit", (event) => {
    event.preventDefault();
    addRoom();
  });
}

// user can add room
function addRoom() {
  document.querySelector(".addRoom").classList.remove("hidden");
  document.querySelector(".lobby").classList.add("hidden");

  const [roomName, roomPassword] = document.querySelectorAll(".addRoom input");
  const roomObj = {
    name: roomName.value,
    password: roomPassword.value,
  };

  socket.emit("add room", roomObj);
}

function onJoinRoom(user) {
  // event.preventDefault();
  console.log("är i rum");
  document.querySelector(".lobby").classList.add("hidden");

  const roomInput = document.querySelector(".join.ui input");

  const name = user;
  console.log(name);
  const room = "Chatroom!"; //roomInput.value;

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
