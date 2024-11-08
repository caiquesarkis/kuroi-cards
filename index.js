import { enviroment } from "./enviroments/index.js";

// Set FavIcon dynamically
$("#favicon").attr("href", "/kuroi-cards/assets/kuroi-logo-60.png");

// DOM elements
const $canvas = $("#canvas");
const canvas = $canvas[0];
const ctx = canvas.getContext("2d");
const $uploadInput = $("#upload");
const $downloadButton = $("#download");

// Project config
const CanvasConfig = { width: 343, height: 500 };
const upperRectangleConfig = [33, 35, 275.5, 50, "#DB5C03", "orange", 2, 8];
const footerRectangleConfig = [33, 380, 275.5, 98, "#DB5C03", "orange", 2, 8];

// Draw Text function
const drawText = (text, x = 0, y = 0, fontSize = 20, color = "black") => {
  ctx.font = `${fontSize}px Arial`;
  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
};

// Draw Rectangle function
const drawRectangle = (
  configArray = [0, 0, 100, 50, "blue", "black", 2, 10]
) => {
  const [
    x,
    y,
    width,
    height,
    fillColor,
    borderColor,
    borderWidth,
    borderRadius,
  ] = configArray;

  ctx.beginPath();
  ctx.moveTo(x + borderRadius, y);
  ctx.lineTo(x + width - borderRadius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + borderRadius);
  ctx.lineTo(x + width, y + height - borderRadius);
  ctx.quadraticCurveTo(
    x + width,
    y + height,
    x + width - borderRadius,
    y + height
  );
  ctx.lineTo(x + borderRadius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - borderRadius);
  ctx.lineTo(x, y + borderRadius);
  ctx.quadraticCurveTo(x, y, x + borderRadius, y);
  ctx.closePath();

  ctx.fillStyle = fillColor;
  ctx.fill();
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = borderWidth;
  ctx.stroke();
};

// Update ATK
$("#atk").on("input", (event) => {
  const atkValue = event.target.value;
  drawText(
    `ATK: ${atkValue}`,
    canvas.width * (0.26 - 0.1),
    canvas.height * 0.94,
    14,
    "black"
  );
});

// Update DEF
$("#def").on("input", (event) => {
  const defValue = event.target.value;
  drawText(
    `DEF: ${defValue}`,
    canvas.width * (0.26 + 0.14),
    canvas.height * 0.94,
    14,
    "black"
  );
});

// Update VEL
$("#vel").on("input", (event) => {
  const velValue = event.target.value;
  drawText(
    `VEL: ${velValue}`,
    canvas.width * (0.26 + 0.38),
    canvas.height * 0.94,
    14,
    "black"
  );
});

// Update NOME
$("#nome").on("input", (event) => {
  const nomeValue = event.target.value;
  drawText(nomeValue, canvas.width * 0.3, canvas.height * 0.13, 28, "black");
});

// Handle profile card Image Upload
$uploadInput.on("change", (event) => {
  const file = event.target.files[0];

  const reader = new FileReader();
  reader.addEventListener(
    "load",
    () => {
      // convert image file to base64 string
      localStorage.setItem("canvas-image", reader.result);
      drawUI();
    },
    false
  );

  if (file) {
    reader.readAsDataURL(file);
  }

  //   if (file) {

  //     const image = new Image();
  //     image.src = URL.createObjectURL(file);
  //     // Optionally store the image URL in localStorage
  //     localStorage.setItem("canvas-image", image.src);
  //   }
});

// Handle Kuroi Card Download
$downloadButton.on("click", () => {
  const link = document.createElement("a");
  link.download = "canvas-image.png";
  link.href = canvas.toDataURL();
  link.click();
});

// Load Image Function
const loadImage = (src) => {
  const img = new Image();
  img.src = src;
  return new Promise((resolve) => {
    img.onload = () => resolve(img);
  });
};

// App Logic - Drawing UI
const drawUI = async () => {
  const kuroiCardTemplate = await loadImage(
    enviroment.basePath + "/assets/kuroi-card-template.png"
  );
  const kuroiLogo = await loadImage(
    enviroment.basePath + "/assets/kuroi-logo-60.png"
  );

  let cardPhoto = localStorage.getItem("canvas-image");
  if (localStorage.getItem("canvas-image") != null) {
    const canvasImageUrl = cardPhoto;
    cardPhoto = await loadImage(canvasImageUrl);
  }

  ctx.drawImage(kuroiCardTemplate, 0, 0, canvas.width, canvas.height);
  if (cardPhoto) ctx.drawImage(cardPhoto, 33.5, 83, 274.5, 299);

  drawRectangle(upperRectangleConfig);
  drawRectangle(footerRectangleConfig);

  ctx.drawImage(kuroiLogo, 17.5, 17.5, 80, 80);
};

// Initial UI Draw
drawUI();
