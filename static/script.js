let username = "";
let ws = null;

document.getElementById("nameForm").addEventListener("submit", function (e) {
    e.preventDefault();
    username = document.getElementById("nameInput").value.trim();
    if (!username) return;

    document.getElementById("login").style.display = "none";
    document.getElementById("chat").style.display = "flex";

    ws = new WebSocket(`wss://${window.location.host}/ws`);

    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        const msg = document.createElement("div");
        msg.innerHTML = `<strong>${data.name}:</strong> ${data.message}`;
        document.getElementById("messages").appendChild(msg);
        document.getElementById("messages").scrollTop = document.getElementById("messages").scrollHeight;
    };
});

document.getElementById("chatForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const input = document.getElementById("messageInput");
    const message = input.value.trim();
    if (!message || !ws) return;

    ws.send(JSON.stringify({ name: username, message: message }));
    input.value = "";
});
