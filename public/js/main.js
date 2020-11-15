const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
// const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

const { username, email, phone, message } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

const socket = io();

// join chatroom
socket.emit('joinRoom', {username, email, phone, message});

// get room and users
socket.on('roomUsers', ({users})=> {
    outputUsers(users);
})

// message from server
socket.on('message', message => {
    console.log(message);
    outputMessage(message);


    // Scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
});


// Message submit
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    //get msg text
    const msg = e.target.elements.msg.value;

    // Emit message to server
    socket.emit('chatMessage', msg);

    // clear input
    e.target.elements.msg.value = "";
    e.target.elements.msg.focus();
});

// output message to DOM
function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
        <p class="text">
            ${message.text}
        </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}


// add users to dom
function outputUsers(users) {
    userList.innerHTML = `
        ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
}
