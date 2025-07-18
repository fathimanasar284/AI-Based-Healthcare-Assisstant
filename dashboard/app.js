const socket = io();
const login = document.getElementById('login');
const chat = document.getElementById('chat');
const joinRoomButton = document.getElementById('joinRoom');
const leaveRoomButton = document.getElementById('leaveRoom');
const messageForm = document.getElementById('messageForm');
const messageInput = document.getElementById('messageInput');
const messages = document.getElementById('messages');
const roomName = document.getElementById('roomName');

let username;
let room;

joinRoomButton.addEventListener('click', () => {
    username = document.getElementById('username').value;
    room = document.getElementById('room').value;

    if (username && room) {
        socket.emit('joinRoom', { username, room });
        login.classList.add('hidden');
        chat.classList.remove('hidden');
        roomName.textContent = room;
    }
});

leaveRoomButton.addEventListener('click', () => {
    socket.emit('leaveRoom');
    login.classList.remove('hidden');
    chat.classList.add('hidden');
});

messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    if (message) {
        socket.emit('chatMessage', message);
        messageInput.value = '';
    }
});

socket.on('message', (message) => {
    const div = document.createElement('div');
    div.classList.add('message');
    if (message.username === username) {
        div.classList.add('self');
    }
    div.innerHTML = `<span class="name">${message.username}</span><span class="text">${message.text}</span>`;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
});

socket.on('userJoined', (user) => {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<span class="text">${user} joined the chat</span>`;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
});

socket.on('userLeft', (user) => {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<span class="text">${user} left the chat</span>`;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
});
