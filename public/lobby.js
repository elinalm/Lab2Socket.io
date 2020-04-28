import {
  onMessageReceived
} from "./chat.js";
import {
  socket
} from "./logic.js";

let username;
let roomList;

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
  let sidebarList2 = document.querySelector(".closedRoomlist")
  sidebarList.innerHTML = "";
  sidebarList2.innerHTML = "";
  

    roomList.forEach((room) => {
      console.log(room + "detta är rum");
      
      if (!room.password) {

      let buttonInSidebar = document.createElement("button");
      buttonInSidebar.innerText = room.name;
      buttonInSidebar.className = "listelementsInSidebar";
      sidebarList.appendChild(buttonInSidebar);
    } else {
      let buttonInSidebar2 = document.createElement("button");
      buttonInSidebar2.innerText = room.name;
      buttonInSidebar2.className = "listelementsInSidebar2";
      sidebarList2.appendChild(buttonInSidebar2);
  }})


  console.log(JSON.stringify(roomList) + " : roomList!");

  let buttonsOpen = document.querySelectorAll(".listelementsInSidebar");
  buttonsOpen.forEach((button, index) => {
    button.addEventListener("click", () => {
      selectRoom(index)
    });
  });

  let buttonsClosed = document.querySelectorAll(".listelementsInSidebar2");
  buttonsClosed.forEach((button, index) => {
    button.addEventListener("click", () => {
      prompt("Fyll i rätt lösenord")
    });
  });
}



function selectRoom(roomIndex) {
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
  console.log(roomName, ": detta är roomname");
  socket.emit("leave room", { name: username, room: roomName }); // Här behlöver vi skicka med data på rummet
  console.log("nu lämnar vi");

  document.querySelector(".join.ui").classList.add("hidden");
  document.querySelector(".chat.ui").classList.add("hidden");
  document.querySelector(".lobby").classList.remove("hidden");
  document.querySelector(".sidebar").classList.remove("hidden");

  document.querySelector(".chatMessageUl").innerHTML = "";

}

