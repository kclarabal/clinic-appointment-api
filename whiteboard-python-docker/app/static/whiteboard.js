const canvas = document.getElementById("myCanvas");
const context = canvas.getContext("2d");

canvas.addEventListener("click", defineImage, false);

function getCurrentPos(event) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    };
}

function getSelectedRadioValue(name) {
    const options = document.getElementsByName(name);
    for (let i = 0; i < options.length; i++) {
        if (options[i].checked) {
            return options[i].value;
        }
    }
    return null;
}

function defineImage(event) {
    const currentPos = getCurrentPos(event);
    const color = getSelectedRadioValue("color");
    const shape = getSelectedRadioValue("shape");

    const imageData = {
        shape: shape,
        color: color,
        coords: {
            x: currentPos.x,
            y: currentPos.y
        }
    };

    const json = JSON.stringify(imageData);

    drawImageText(json);

    const online = document.getElementById("online").checked;
    if (online) {
        sendText(json);
    }
}

function drawImageText(image) {
    const json = JSON.parse(image);

    context.fillStyle = json.color;

    switch (json.shape) {
        case "circle":
            context.beginPath();
            context.arc(json.coords.x, json.coords.y, 8, 0, 2 * Math.PI, false);
            context.fill();
            break;

        case "square":
        default:
            context.fillRect(json.coords.x, json.coords.y, 16, 16);
            break;

        case "triangle":
            context.beginPath();
            context.moveTo(json.coords.x, json.coords.y - 10);
            context.lineTo(json.coords.x - 10, json.coords.y + 10);
            context.lineTo(json.coords.x + 10, json.coords.y + 10);
            context.closePath();
            context.fill();
            break;
    }
}

function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}