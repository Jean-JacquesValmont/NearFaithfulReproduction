// Récupérer le canevas et le contexte 2D
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

const brushSizeSelect = document.getElementById('brushSizeSelect');

const color1 = document.getElementById('color1');
const color2 = document.getElementById('color2');
const color3 = document.getElementById('color3');
const color4 = document.getElementById('color4');
const color5 = document.getElementById('color5');
const color6 = document.getElementById('color6');

const clearAll = document.getElementById('clearAll');

// Variables pour le suivi de l'état du dessin
let isDrawing = false;
let lineWidthSize = 10
const brushShape = 'round'
let brushColor = '#000'
brushSizeSelect.value = "10";

// Fonction de dessin
function draw(e) {
    if (!isDrawing) return;

    // Paramètres du trait
    context.lineWidth = lineWidthSize ;
    context.lineCap = brushShape;
    context.strokeStyle = brushColor; // Couleur du trait

    // Dessiner
    context.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
    context.stroke();
    context.beginPath();
    context.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
}

// Événement pour commencer le dessin
canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    draw(e);
});

// Événement pour arrêter le dessin
canvas.addEventListener('mouseup', () => {
    isDrawing = false;
    context.beginPath(); // Commencer un nouveau chemin après avoir relâché le bouton de la souris
});

// Événement pour dessiner
canvas.addEventListener('mousemove', draw);

// Événements pour définir la taille du pinceau
brushSizeSelect.addEventListener("change", () => {
    lineWidthSize = brushSizeSelect.value
})

// Événements pour définir la couleur du pinceau
color1.addEventListener("click", () => {
    brushColor = '#000'
})

color2.addEventListener("click", () => {
    brushColor = "#FFFFFF"
})

color3.addEventListener("click", () => {
    brushColor = '#697280'
})

color4.addEventListener("click", () => {
    brushColor = '#EE4343'
})

color5.addEventListener("click", () => {
    brushColor = '#3A82F5'
})

color6.addEventListener("click", () => {
    brushColor = '#21C35E'
})

// Événements pour définir différentes actions
clearAll.addEventListener("click", (e) => {
    context.clearRect(0, 0, canvas.width, canvas.height)
})