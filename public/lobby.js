import { socket } from "./logic.js";

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
 
  const roomName = document.querySelector(".roomName").value;
  const password = document.querySelector(".password").value;

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
  let sidebarList2 = document.querySelector(".closedRoomlist");
  sidebarList.innerHTML = "";
  sidebarList2.innerHTML = "";

  roomList.forEach((room, index) => {
    if (!room.hasPass) {
      let buttonInSidebar = document.createElement("button");
      buttonInSidebar.innerText = room.name;
      buttonInSidebar.className = "listelementsInSidebar";
      buttonInSidebar.addEventListener("click", () => {
        selectRoom(index);
      });
      sidebarList.appendChild(buttonInSidebar);
    } else {
      let buttonInSidebar2 = document.createElement("button");
      buttonInSidebar2.innerText = room.name;
      buttonInSidebar2.className = "listelementsInSidebar";
      buttonInSidebar2.addEventListener("click", () => {

        document.querySelector(".lobby").classList.add("hidden");
        document.querySelector(".addRoom").classList.add("hidden");
        document.querySelector(".enterPassword").classList.remove("hidden");
        let passwordButton = document.querySelector(".enterPassword button")
        passwordButton.addEventListener("click", () => {

          event.preventDefault()
          let passwordEntered = document.querySelector(".enterPassword input").value
          console.log(passwordEntered + "detta är password");

          // const passwordEntered = prompt("lösen");
          let roomName = roomList[index].name;
          socket.emit("password check", {
            name: roomName,
            password: passwordEntered,
          });
        })
        socket.on("did pass", (data) => {
          if (data) {
            selectRoom(index);
          } else {
            let password = document.querySelector(".enterPassword")
            let wrongPassword = document.querySelector(".enterPassword p")
            wrongPassword.innerText = "Wrong Password, try again!"
            password.append(wrongPassword)
          }
        });
       
      });
      sidebarList2.appendChild(buttonInSidebar2);
    }
  });
}

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
