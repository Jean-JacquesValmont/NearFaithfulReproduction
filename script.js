// Récupérer le canevas et le contexte 2D
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

const brushSizeSelect = document.getElementById('brushSizeSelect');
const colorSelect = document.getElementById('colorSelect');

const clearAll = document.getElementById('clearAll');

// Variables initialisation
let isDrawing = false;
let lineWidthSize = 10
const brushShape = 'round'

let brushColor = '#000'
brushSizeSelect.value = "10";
colorSelect.style.backgroundColor = '#000'


const colors = ['#FFFFFF', ' #d1d5db', '#fca5a5', '#fdba74', '#fde047', '#86efac', '#67e8f9', '#93c5fd', '#d8b4fe', '#f9a8d4',
 '#000', '#374151', '#b91c1c', '#c2410c ', '#a16207', '#15803d',  '#0e7490',  '#1d4ed8', '#7e22ce', '#be185d'];
const colorButtons = colors.map(color => document.getElementById(`color${colors.indexOf(color)}`));

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

// Événement pour définir la taille du pinceau
brushSizeSelect.addEventListener("change", () => {
    lineWidthSize = brushSizeSelect.value
})

// Événement pour la couleur du pinceau
colorButtons.forEach(button => {
    button.addEventListener("click", () => {
        for(let i = 0; i <= colors.length; i++){
            console.log(i)
            if (button.id == "color" + i){
                console.log("Color change")
                brushColor = colors[i];
                colorSelect.style.backgroundColor = colors[i]
                break
            }
        }
    });
});

// Événement pour définir différentes actions
clearAll.addEventListener("click", (e) => {
    context.clearRect(0, 0, canvas.width, canvas.height)
})