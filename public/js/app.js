const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const usersList = document.getElementById("users");
const leaveRoomBtn = document.getElementById("leave-btn");

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();

// Join chatroom
socket.emit("joinRoom", { username, room });

// Get room and users
socket.on("roomUsers", ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// Message from server
socket.on("message", (message) => {
  outputMessage(message);

  // Scroll down to the latest chat message
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// submit chat messages to server
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  // Get message value
  const msg = e.target.elements.msg.value;

  // Emit message to the server
  socket.emit("chatMessage", msg);

  // clear chat input
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
        <p class="text">
        ${message.text}
        </p>
    `;
  document.querySelector(".chat-messages").appendChild(div);
}

function outputRoomName(room) {
  roomName.innerText = room;
}

function outputUsers(users) {
  usersList.innerHTML = `
        ${users.map((user) => `<li>${user.username}</li>`).join("")}
    `;
}

// Prompt the user before leave the chat room
leaveRoomBtn.addEventListener("click", function () {
  const leaveRoom = confirm("Are you sure you want to leave the chat room?");
  if (leaveRoom) window.location = "../index.html";
});
