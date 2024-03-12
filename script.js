// Récupérer le canevas et le contexte 2D
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const increased = document.getElementById('increase');
const decreased = document.getElementById('decrease');

// Variables pour le suivi de l'état du dessin
let isDrawing = false;
let lineWidthSize = 1

// Fonction de dessin
function draw(e) {
    if (!isDrawing) return;

    // Paramètres du trait (à adapter selon les besoins)
    context.lineWidth = lineWidthSize ;
    context.lineCap = 'round';
    context.strokeStyle = '#000'; // Couleur du trait

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

// Événement pour agrandir la taille du pinceau
increased.addEventListener("click", () => {
    lineWidthSize += 2
})

// Événement pour diminuer la taille du pinceau
decreased.addEventListener("click", () => {
    lineWidthSize >= 1 ? lineWidthSize -= 2 : null
})