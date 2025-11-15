const chatLog = document.getElementById("chat-log");
const inputBox = document.getElementById("user-input");
const syncGauge = document.getElementById("sync-gauge");

function appendMessage(sender, text) {
    const div = document.createElement("div");
    div.className = sender;
    div.textContent = `${sender}: ${text}`;
    chatLog.appendChild(div);
    chatLog.scrollTop = chatLog.scrollHeight;
}

async function sendMessage() {
    const message = inputBox.value.trim();
    if (!message) return;

    appendMessage("YOU", message);
    inputBox.value = "";

    const res = await fetch("http://127.0.0.1:8000/api/chat", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({message})
    });

    const data = await res.json();
    appendMessage("SAKACCHI", data.reply);

    syncGauge.style.width = data.sync_score + "%";
    syncGauge.innerText = `SYNC ${data.sync_score}%`;
}

document.getElementById("send-btn").onclick = sendMessage;
