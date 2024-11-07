import { enviroment } from './enviroments/index.js';

// Use jQuery to select elements
const $canvas = $('#canvas');
const canvas = $canvas[0];
const ctx = canvas.getContext('2d');
const $uploadInput = $('#upload');
const $downloadButton = $('#download');
const $atkLabel = $('#atk');
const $defLabel = $('#def');
const $velLabel = $('#vel');



// Project config

const CanvasConfig = {
    width: 343,//272,
    height: 500
}

// DrawImage function
const drawImage = (image, x = 0, y = 0, width = canvas.width, height = canvas.height) => {
    if (typeof image === "string") {
        // If `image` is a URL, create an Image object and load it
        const img = new Image();
        img.src = image;
        img.onload = () => {
            ctx.drawImage(img, x, y, width, height);
        };
    } else if (image instanceof HTMLImageElement) {
        // If `image` is an Image object, draw it directly
        image.onload = () => {
            ctx.clearRect(0, 0, width, height); // Optional: Clear canvas before drawing
            ctx.drawImage(image, x, y, width, height);
        };
        // Ensure the image is loaded before drawing
        if (image.complete) {
            ctx.drawImage(image, x, y, width, height);
        }
    }
};

// DrawText function
const drawText = (text, x = 0, y = 0, fontSize = 20, color = 'black') => {
    // Set font and color for the text
    ctx.font = `${fontSize}px Arial`;
    ctx.fillStyle = color;

    // Draw the text on the canvas at specified coordinates
    ctx.fillText(text, x, y);
};

// Draw initial template images
drawImage(enviroment.basePath + '/assets/kuroi-card-template.png');
drawImage(enviroment.basePath + '/assets/kuroi-logo-60.png', 17.5, 17.5, 80, 80); // Draw logo

// Handle Image Upload
$uploadInput.on('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const image = new Image();
        image.src = URL.createObjectURL(file);
        image.onload = () => {
            const offset = 278
        drawImage(image, (canvas.width - offset)/2, (canvas.height- offset)/2 - 35, offset, offset + 35); // Draw at top-left corner

        drawImage(enviroment.basePath + '/assets/kuroi-logo-60.png', 17.5, 17.5, 80, 80); // Draw logo
        };
    }
});

// Handle Canvas Download
$downloadButton.on('click', () => {
    const link = document.createElement('a');
    link.download = 'canvas-image.png';
    link.href = canvas.toDataURL();
    link.click();
});

$('#atk').on('input', (event) => {
    const atkValue = event.target.value;
    
    drawText(`ATK: ${atkValue}`, canvas.width*0.26 - 45, canvas.height* 0.94, 14, 'black');
});

$('#def').on('input', (event) => {
    const atkValue = event.target.value;
    
    drawText(`DEF: ${atkValue}`, canvas.width*0.26 + 45, canvas.height* 0.94, 14, 'black');
});

$('#vel').on('input', (event) => {
    const atkValue = event.target.value;
    
    drawText(`VEL: ${atkValue}`, canvas.width*0.26 + 135, canvas.height* 0.94, 14, 'black');
});

$('#nome').on('input', (event) => {
    const nomeValue = event.target.value;
    
    drawText(`${nomeValue.slice(0,16)}`, canvas.width*0.3, canvas.height* 0.13, 28, 'black');
});



