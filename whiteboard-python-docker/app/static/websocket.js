const statusDiv = document.getElementById("status");
const logDiv = document.getElementById("log");

const wsProtocol = window.location.protocol === "https:" ? "wss://" : "ws://";
const wsUri = wsProtocol + window.location.host + "/whiteboardendpoint";

const websocket = new WebSocket(wsUri);

function writeLog(message) {
    const timestamp = new Date().toLocaleTimeString();
    logDiv.innerHTML += `[${timestamp}] ${message}<br>`;
    logDiv.scrollTop = logDiv.scrollHeight;
}

websocket.onopen = function () {
    statusDiv.textContent = "Connected";
    statusDiv.style.color = "green";
    writeLog("Connected to " + wsUri);
};

websocket.onerror = function () {
    statusDiv.textContent = "Connection error";
    statusDiv.style.color = "red";
    writeLog("WebSocket error occurred.");
};

websocket.onclose = function () {
    statusDiv.textContent = "Disconnected";
    statusDiv.style.color = "gray";
    writeLog("WebSocket connection closed.");
};

websocket.onmessage = function (event) {
    writeLog("Received: " + event.data);

    const data = JSON.parse(event.data);

    if (data.type === "error") {
        writeLog("Server error: " + data.message);
        return;
    }

    drawImageText(event.data);
};

function sendText(json) {
    if (websocket.readyState === WebSocket.OPEN) {
        websocket.send(json);
        writeLog("Sent: " + json);
    } else {
        writeLog("Cannot send. WebSocket is not open.");
    }
}