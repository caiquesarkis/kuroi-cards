import { enviroment } from "./enviroments/index.js";

// Set FavIcon dynamically
$("#favicon").attr("href", "/kuroi-cards/assets/kuroi-logo-60.png");

// DOM elements
const $canvas = $("#canvas");
const canvas = $canvas[0];
const ctx = canvas.getContext("2d");
const $uploadInput = $("#upload");
const $downloadButton = $("#download");

// Draw Text function
const drawText = (text, x = 0, y = 0, fontSize = 20, color = "black") => {
  ctx.font = `${fontSize}px MedievalSharp`;
  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
};

// Draw Rectangle functio
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

// Function to initialize fields with localStorage values
function initializeFields() {
  // Retrieve values from localStorage
  const atkValue = localStorage.getItem("atkValue");
  const defValue = localStorage.getItem("defValue");
  const velValue = localStorage.getItem("velValue");
  const nomeValue = localStorage.getItem("nomeValue");
  const larpDescValue = localStorage.getItem("larpDescValue");
  const selectedDominios = JSON.parse(localStorage.getItem("selectedDominios"));

  // Set values if they exist
  if (atkValue) $("#atk").val(atkValue);
  if (defValue) $("#def").val(defValue);
  if (velValue) $("#vel").val(velValue);
  if (nomeValue) $("#nome").val(nomeValue);
  if (larpDescValue) $("#descricao").val(larpDescValue);

  // Set selected checkboxes for "dominios"
  selectedDominios.forEach((dominio) => {
    $(`#${dominio}`).prop("checked", true);
  });

  // Re-draw the UI with these initial values
  drawUI();
}

// Call the initialize function after the DOM has loaded
$(document).ready(() => {
  initializeFields();
});

// Update ATK
$("#atk").on("input", (event) => {
  const atkValue = event.target.value;
  localStorage.setItem("atkValue", atkValue);
  drawUI();
});

// Update DEF
$("#def").on("input", (event) => {
  const defValue = event.target.value;
  localStorage.setItem("defValue", defValue);
  drawUI();
});

// Update VEL
$("#vel").on("input", (event) => {
  const velValue = event.target.value;
  localStorage.setItem("velValue", velValue);
  drawUI();
});

// Update NOME
$("#nome").on("input", (event) => {
  const nomeValue = event.target.value;
  localStorage.setItem("nomeValue", nomeValue);
  drawUI();
});

// Update larp description
$("#descricao").on("input", (event) => {
  const larpDescValue = event.target.value;
  localStorage.setItem("larpDescValue", larpDescValue);
  drawUI();
});

// Update Cargo
$("#cargo-selector .dropdown-item").on("click", function (event) {
  const cargoValue = $(this).data("value");
  localStorage.setItem("cargoValue", cargoValue);
  drawUI();
});

// Initialize Casa value from localStorage
const casaValue = localStorage.getItem("houseValue") ?? "Casa";
$("#casa-button").text(casaValue);

// Casa Selection Event
$("#casa-selector .dropdown-item").on("click", function (event) {
  event.preventDefault();
  const selectedCasa = $(this).data("value");
  localStorage.setItem("houseValue", selectedCasa);
  $("#casa-button").text(selectedCasa);
  drawUI(); // Redraw the canvas with the new value
});

// Clear data from localStorage and reset the canvas
$("#clear-data").on("click", () => {
  // Clear all localStorage data
  localStorage.clear();

  // Reset input fields and uncheck all checkboxes
  $("#nome, #descricao").val("");
  $("#atk, #def, #vel").val("0");
  $(".form-check-input").prop("checked", false);

  // Re-draw the UI to reflect cleared data
  drawUI();
});

// Icons for Cargo and House
const cargoIcons = {
  "Gaijin": enviroment.basePath + "/assets/gaijin-icon.png",
  Ashigaru: enviroment.basePath + "/assets/ashigaru-icon.png",
  "Soldado Graduado": enviroment.basePath + "/assets/soldado-icon.png",
  Cadete: enviroment.basePath + "/assets/cadete-icon.png",
  Tenente: enviroment.basePath + "/assets/tenente-icon.png",
  General: enviroment.basePath + "/assets/general-icon.png",
  "Lendário":
    enviroment.basePath + "/assets/guerreiro-lendario-icon.png",
  capitao: enviroment.basePath + "/assets/capitao-icon.png",
};

// House Icons
const houseIcons = {
  Víboras: enviroment.basePath + "/assets/viboras-icon.png",
  Estranguladoras: enviroment.basePath + "/assets/estranguladoras-icon.png",
  Serpentes: enviroment.basePath + "/assets/serpentes-icon.png",
};

// Dominios Icons
const dominioIcons = {
  espada: enviroment.basePath + "/assets/espada-icon.png",
  espadaEscudo: enviroment.basePath + "/assets/espada-escudo-icon.png",
  dual: enviroment.basePath + "/assets/dual-icon.png",
  lanca: enviroment.basePath + "/assets/lanca-icon.png",
  machado: enviroment.basePath + "/assets/machado-icon.png",
  arco: enviroment.basePath + "/assets/arco-icon.png",
};

// Attach event listeners to each checkbox of dominio
$("#espada, #espadaEscudo, #dual, #lanca, #machado, #arco").on(
  "change",
  updateSelectedDominios
);

// Function to update checked values in localStorage
function updateSelectedDominios() {
  const selectedDominios = [];
  $(".form-check-input:checked").each(function () {
    selectedDominios.push($(this).attr("id"));
  });
  localStorage.setItem("selectedDominios", JSON.stringify(selectedDominios));
  drawUI();
}

// Função para redimensionar a imagem se necessário
function resizeImage(imageBase64, maxWidth, maxHeight, callback) {
  const img = new Image();

  img.onload = () => {
    // Verifica se a imagem precisa ser redimensionada
    if (img.width > maxWidth || img.height > maxHeight) {
      // Cria um canvas invisível
      const canvas = document.createElement("canvas");
      canvas.id = "image-resizer-canvas";
      canvas.style.display = "none";
      document.body.appendChild(canvas);

      canvas.width = maxWidth;
      canvas.height = maxHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, maxWidth, maxHeight);

      // Converte a imagem redimensionada para base64 e chama o callback
      const resizedImage = canvas.toDataURL("image/jpeg", 0.8); // Ajuste a qualidade se necessário
      callback(resizedImage);

      // Remove o canvas após o redimensionamento
      document.body.removeChild(canvas);
    } else {
      // Se não for necessário redimensionar, retorna a imagem original
      callback(imageBase64);
    }
  };

  img.src = imageBase64;
}

// Handle profile card Image Upload
$uploadInput.on("change", (event) => {
  const file = event.target.files[0];

  if (file) {
    const reader = new FileReader();

    reader.addEventListener(
      "load",
      () => {
        const imageBase64 = reader.result;

        // Define as dimensões máximas
        const maxWidth = 343 * 5;
        const maxHeight = 500 * 5;

        // Redimensiona a imagem se necessário e armazena no localStorage
        resizeImage(imageBase64, maxWidth, maxHeight, (finalImage) => {
          localStorage.setItem("canvas-image", finalImage);
          drawUI();
        });
      },
      false
    );

    reader.readAsDataURL(file);
  }
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
  // Load Images
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

  // Kuroi Card Template
  ctx.drawImage(kuroiCardTemplate, 0, 0, canvas.width, canvas.height);

  // Render character image
  if (cardPhoto) ctx.drawImage(cardPhoto, 33.5, 80, 274.5, 305);

  // Upper and lower UI rectangles
  const upperRectangleConfig = [34, 30, 275.5, 50, "#DB5C03", "orange", 2, 8];
  const footerRectangleConfig = [33, 380, 275.5, 98, "#DB5C03", "orange", 2, 8];
  drawRectangle(upperRectangleConfig);
  drawRectangle(footerRectangleConfig);

  // Draw Kuroi Logo
  ctx.drawImage(kuroiLogo, 20, 17, 80, 80);

  // Draw Stats
  drawText(
    `ATK: ${localStorage.getItem("atkValue")}`,
    canvas.width * 0.16,
    canvas.height * 0.94,
    14,
    "black"
  );
  drawText(
    `DEF: ${localStorage.getItem("defValue")}`,
    canvas.width * 0.4,
    canvas.height * 0.94,
    14,
    "black"
  );
  drawText(
    `VEL: ${localStorage.getItem("velValue")}`,
    canvas.width * 0.64,
    canvas.height * 0.94,
    14,
    "black"
  );
  drawText(
    `${localStorage.getItem("nomeValue") ?? ""}`,
    canvas.width * 0.29,
    canvas.height * 0.13,
    28,
    "black"
  );

  const cargoText = localStorage.getItem("cargoValue") ?? "";
  const cargoTextWidth = ctx.measureText(cargoText).width;

  const cargoTextCenterWidth = (canvas.width - cargoTextWidth + 15) / 2 // Center the text horizontally
  drawText(
    cargoText,
    cargoTextCenterWidth,
    canvas.height * 0.82,
    24,
    "black"
  );

  // Centered larp description
  const larpDesc = localStorage.getItem("larpDescValue") ?? "";
  ctx.font = "18px Arial";
  const textWidth = ctx.measureText(larpDesc).width;
  const xPos = (canvas.width - textWidth) / 2; // Center x-position
  drawText(larpDesc, xPos, canvas.height * 0.88, 18, "black");

  // Render Cargo text with icon
  const cargoValue = localStorage.getItem("cargoValue") ?? "Cargo";
  const cargoIconPath = cargoIcons[cargoValue] || null;

  if (cargoIconPath) {
    const cargoIcon = await loadImage(cargoIconPath);
    ctx.drawImage(
      cargoIcon,
      cargoTextCenterWidth * 0.7,
      canvas.height * 0.775,
      25,
      25
    ); // Draw icon before the text
  }

  // Render House text with icon
  const houseValue = localStorage.getItem("houseValue") ?? "viboras";
  const houseIconPath = houseIcons[houseValue] || null;

  if (houseIconPath) {
    const houseIcon = await loadImage(houseIconPath);
    ctx.drawImage(
      houseIcon,
      canvas.width * 0.67,
      canvas.height * 0.768,
      35,
      35
    ); // Draw House icon before the text
  }

  // Draw selected "dominio" icons
  const selectedDominios = JSON.parse(
    localStorage.getItem("selectedDominios") || "[]"
  );
  let iconY = 100; // Starting y-position for icons

  for (const dominio of selectedDominios) {
    const iconPath = dominioIcons[dominio];
    if (iconPath) {
      const iconImage = await loadImage(iconPath);
      ctx.drawImage(iconImage, 250, iconY, 50, 50); // Adjust icon size and position
      iconY += 60; // Increment y-position for the next icon
    }
  }
};

// Initial UI Draw
drawUI();
