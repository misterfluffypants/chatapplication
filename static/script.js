let socket;
let username = "";

document.getElementById("nameForm").addEventListener("submit", function (e) {
    e.preventDefault();
    username = document.getElementById("nameInput").value.trim();
    if (!username) return;

    document.getElementById("login").style.display = "none";
    document.getElementById("chat").style.display = "block";

    socket = new WebSocket(`wss://${window.location.host}/ws`);

    socket.onmessage = function (event) {
        const messages = document.getElementById("messages");
        const message = document.createElement("div");
        message.classList.add("message");
        message.textContent = event.data;
        messages.appendChild(message);
        messages.scrollTop = messages.scrollHeight;
    };
});

document.getElementById("chatForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const input = document.getElementById("messageInput");
    const message = input.value.trim();
    if (!message) return;
    socket.send(`${username}: ${message}`);
    input.value = "";
});
