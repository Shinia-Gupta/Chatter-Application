const socket = io.connect("http://localhost:3000");

const leftChatterDiv = document.querySelector(".left-chatter");
const rightNotifDiv = document.querySelector(".right-notif");
const mainPart = document.querySelector("main");
const chatInputBox = document.querySelector("#chatText");
const sendChatBtn = document.querySelector("#sendChat");
const countUserSpan = document.querySelector("#countOfUsers");
const welcometext = document.querySelector("#welcome-text");
const typingText = document.querySelector("#typing-text");
const connUserListDiv = document.querySelector('.users-list-container');
const username = window.prompt("Please enter your name to join the chat ");
const profileImg=['images/dog.jpg','images/giraffe.jpg','images/koala.png','images/lion.jpg','images/ninja.jpg','images/tiger.jpg'];
let userProfImg;
if (!username) {
  window.alert("Username cannot be empty");
} else {
  let connUsers = 0;

  welcometext.innerHTML = `Welcome <strong>${username}</strong>`;

  const randomImgIndex = Math.floor(Math.random() *5);
      let imageUrl=profileImg[randomImgIndex];
  // Emit new user connected event
  socket.emit('new-user-connected', { username,imageUrl });

  // Event listeners for typing
  chatInputBox.addEventListener('keyup', () => {
    if (chatInputBox.value.trim() === '') {
      socket.emit('user-stopped-typing-io',username);
    } else {
      socket.emit('user-is-typing-io',username);
    }
  });

  // Send chat message
  sendChatBtn.addEventListener('click', (event) => {
    event.preventDefault();
    const usermsg = chatInputBox.value;
    if (usermsg.trim() !== '') {
      socket.emit('new-message', { username, usermsg });
    }
  });

  // Event listeners for typing status
  socket.on('user-stopped-typing', () => setHeader(''));
  socket.on('user-is-typing', (username) => setHeader(username));


  socket.on('prev-msg',(userChatData)=>{
userChatData.forEach(chat=>{
  const chatBubble = document.createElement('div');
  chatBubble.classList.add('d-flex', 'justify-content-start', 'align-items-center', 'rounded');
  chatBubble.innerHTML = `<div class='profilepic bg-transparent'><img src='${userProfImg}' height='50' width='50'></div>
  <strong>${chat.username}:</strong> ${chat.message}`;
  mainPart.appendChild(chatBubble);
})
})

  // Display new message
  socket.on('new-msg-recieved', generateNewMsg);

  // Handle user disconnect
  socket.on('user-disconnected', (users) => {
    userDisconnected(users.socketid);
  });

  // Load profile image URL
  socket.on('profile-image', (imageUrl) => {
    userProfImg = imageUrl;
  });

  // Display connected users
  socket.on('show-connected-users', (users) => {
    newConnections(users.users, users.socketid);
  });

  // Load previous messages
  socket.emit('load-messages');
}

function newConnections(users, socketId) {
  connUsers = users.length;
  let userList = document.createElement('div');
  userList.classList.add('user-list');
  users.forEach(u => {
    let newUserDiv = document.createElement('div');
    newUserDiv.classList.add('d-flex', 'justify-content-start', 'align-items-center', 'alert', 'alert-success', 'flex-wrap');
    newUserDiv.setAttribute('id', socketId);
    newUserDiv.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="green" class="bi bi-circle-fill" viewBox="0 0 16 16">
      <circle cx="10" cy="6" r="4"/>
    </svg> ${u.username}`;  //create a new div for the newly connected user
    userList.appendChild(newUserDiv);
  });
  connUserListDiv.innerHTML = userList.innerHTML;
  countUserSpan.innerText = connUsers;
}

function userDisconnected( socketid) {
  const disconnectedUserDiv = document.getElementById(socketid);
  if (disconnectedUserDiv) {
    disconnectedUserDiv.remove();
  }
  connUsers--;
  countUserSpan.innerText = connUsers;
}

function generateNewMsg(userData) {
  const chatBubble = document.createElement('div');
  chatBubble.classList.add('d-flex', 'justify-content-start', 'align-items-center', 'rounded');
  chatBubble.innerHTML = `<div class='profilepic bg-transparent'><img src='${userProfImg}' height='50' width='50'></div>
    <strong>${userData.username}:</strong> ${userData.message}`;
  mainPart.appendChild(chatBubble);
  chatInputBox.value = '';
}

function setHeader(uname) {
  typingText.innerText = uname ? `${uname} is typing...` : '';
}
