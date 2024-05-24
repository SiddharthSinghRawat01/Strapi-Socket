// Connect to Socket.io server
const socket = io('http://localhost:1337');

// DOM elements
const chat = document.getElementById('chat');
const messageInput = document.getElementById('message');
const sendBtn = document.getElementById('sendBtn');

// Helper function to append message to chat
function appendMessage(message) {
  const messageElement = document.createElement('div');
  messageElement.textContent = message;
  chat.appendChild(messageElement);
}

// Handle connection
socket.on('connect', () => {
  console.log('Connected to WebSocket server with ID:', socket.id);

  // Join the group chat with a username
  const username = prompt('Enter your username:');
  socket.emit('join', { username });

  socket.on('welcome', (data) => {
    appendMessage(data.text);
  });

  socket.on('message', (data) => {
    appendMessage(`${data.user}: ${data.text}`);
  });
});

// Handle send button click
sendBtn.addEventListener('click', () => {
  const message = messageInput.value;
  if (message.trim()) {
    socket.emit('sendMessage', { user: socket.id, message });
    messageInput.value = '';
  }
});

// Handle disconnection
socket.on('disconnect', () => {
  console.log('Disconnected from WebSocket server');
});
