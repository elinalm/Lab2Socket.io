import { socket } from "./logic.js";

let username;
let roomList;

// Enter lobby
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

//Add room
const submitRoom = document.querySelector(".addRoom");
submitRoom.addEventListener("submit", (event) => {
  event.preventDefault();

  const roomName = document.querySelector(".roomName").value;
  const password = document.querySelector(".password").value;
  document.querySelector(".roomName").value = "";
  document.querySelector(".password").value = "";

  const roomObj = {
    name: roomName,
    password: password,
  };

  socket.emit("add room", roomObj);
});

// UI for add room
function addRoom() {
  document.querySelector(".addRoom").classList.remove("hidden");
  document.querySelector(".lobby").classList.add("hidden");
}

// Room list handler
function handleRoomList(data) {
  roomList = data;
  let sidebarList = document.querySelector(".roomlist");
  let sidebarList2 = document.querySelector(".closedRoomlist");
  sidebarList.innerHTML = "";
  sidebarList2.innerHTML = "";

  roomList.forEach((room, index) => {
    if (!room.hasPass) {
      let buttonInSidebar = getChatroomWithoutPassword(room, index);
      sidebarList.appendChild(buttonInSidebar);
    } else {
      let buttonInSidebar2 = getChatroomWithPassword(room, index);
      socket.on("did pass", (data) => {
        if (data) {
          selectRoom(index);
        } else {
          let password = document.querySelector(".enterPassword");
          let wrongPassword = document.querySelector(".enterPassword p");
          wrongPassword.innerText = "Wrong Password, try again!";
          password.append(wrongPassword);
        }
      });
      sidebarList2.appendChild(buttonInSidebar2);
    }
  });
}

//Finding the choosen room
function selectRoom(roomIndex) {
  let roomName = roomList[roomIndex];
  onJoinRoom(roomName);
}

export function onJoinRoom(roomName) {
  document.querySelector(".lobby").classList.add("hidden");
  document.querySelector(".chat.ui").classList.remove("hidden");
  document.querySelector(".addRoom").classList.add("hidden");
  document.querySelector(".sidebar").classList.add("hidden");

  socket.emit("join room", { name: username, room: roomName.name });

  // Leave room button
  const leaveRoom = document.querySelector(".leaveRoomButton");
  leaveRoom.addEventListener("click", () => {
    onLeaveRoom(roomName);
  });
}

// Leaving the chat room
function onLeaveRoom(roomName) {
  socket.emit("leave room", { name: username, room: roomName.name }); // Här behlöver vi skicka med data på rummet

  document.querySelector(".join.ui").classList.add("hidden");
  document.querySelector(".chat.ui").classList.add("hidden");
  document.querySelector(".lobby").classList.remove("hidden");
  document.querySelector(".sidebar").classList.remove("hidden");

  document.querySelector(".chatMessageUl").innerHTML = "";
}

// Extracted functionality for adding a chatroom without a password.
function getChatroomWithoutPassword(room, index) {
  let buttonInSidebar = document.createElement("button");
  buttonInSidebar.innerText = room.name;
  buttonInSidebar.className = "listelementsInSidebar";
  buttonInSidebar.addEventListener("click", () => {
    selectRoom(index);
  });
  return buttonInSidebar;
}

// Extracted functionality for adding a chatroom with a password.
function getChatroomWithPassword(room, index) {
  let buttonInSidebar2 = document.createElement("button");
  buttonInSidebar2.innerText = room.name;
  buttonInSidebar2.className = "listelementsInSidebar";
  buttonInSidebar2.addEventListener("click", () => {
    document.querySelector(".lobby").classList.add("hidden");
    document.querySelector(".addRoom").classList.add("hidden");
    document.querySelector(".enterPassword").classList.remove("hidden");
    let passwordButton = document.querySelector(".enterPassword button");
    passwordButton.addEventListener("click", () => {
      event.preventDefault();
      let passwordEntered = document.querySelector(".enterPassword input")
        .value;
      document.querySelector(".enterPassword input").value = "";
      let roomName = roomList[index].name;
      socket.emit("password check", {
        name: roomName,
        password: passwordEntered,
      });
    });
  });
  return buttonInSidebar2;
}
