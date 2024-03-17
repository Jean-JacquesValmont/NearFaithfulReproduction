// Récupérer le canevas et le contexte 2D
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const canvasImage = document.getElementById('canvasImage');
const contextImage = canvasImage.getContext('2d')

const brushSizeSelect = document.getElementById('brushSizeSelect');
const toolSelect = document.getElementById('toolSelect');
const colorSelect = document.getElementById('colorSelect');
const clearAll = document.getElementById('clearAll');
const compareImage = document.getElementById('compareImage');

// Variables initialisation
let isDrawing = false;
let tool = "brush"
let lineWidthSize = 10
const brushShape = 'round'

let brushColor = '#000'
brushSizeSelect.value = "10";
toolSelect.value = "brush"
colorSelect.style.backgroundColor = '#000'

let randomImage = new Image()

const colors = ['#FFFFFF', ' #d1d5db', '#fca5a5', '#fdba74', '#fde047', '#86efac', '#67e8f9', '#93c5fd', '#d8b4fe', '#f9a8d4',
 '#000', '#374151', '#b91c1c', '#c2410c ', '#a16207', '#15803d',  '#0e7490',  '#1d4ed8', '#7e22ce', '#be185d'];
const colorButtons = colors.map(color => document.getElementById(`color${colors.indexOf(color)}`));

// Fonction de dessin
function draw(e) {
    if (!isDrawing) return;

    if (tool == "brush"){
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
    else if(tool == "paintBucket"){
        context.fillStyle = brushColor;
        context.fillRect(0, 0, canvas.width, canvas.height)
    }
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

// Événement pour définir la taille du pinceau
toolSelect.addEventListener("change", () => {
    tool = toolSelect.value
})

// Événement pour la couleur du pinceau
colorButtons.forEach(button => {
    button.addEventListener("click", () => {
        for(let i = 0; i <= colors.length; i++){
            if (button.id == "color" + i){
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

// Pour récupérer une image
async function fetchImage() {
    try {
        const apiKey = '1rIW4mEHWJeRPQR1vGtU+g==a0KWLUCB8HcKGCKs';

        // Faire la requête à l'API
        const response = await fetch(`https://api.api-ninjas.com/v1/randomimage`, {
            method: 'GET',
            headers: {
                'X-Api-Key': apiKey,
                'Accept': 'image/jpg'
            }
        });

        // Vérifier si la réponse est réussie (status code 200)
        if (!response.ok) {
            throw new Error('La requête a échoué : ' + response.status);
        }

        // Convertir la réponse en blob (image)
        const imageBlob = await response.blob();

        // Création d'une URL local avec le imageBlob récupéré
        const imageUrl = URL.createObjectURL(imageBlob);

        randomImage.src = imageUrl;

        randomImage.onload = function() {
            // Cette fonction est appelée lorsque l'image a été chargée
            contextImage.drawImage(this,0,0); // this fait référence à l'objet courant (=image)
          };

    } catch (error) {
        console.error('Une erreur s\'est produite lors de la récupération de l\'image :', error);
    }
}

// Appeler la fonction pour récupérer l'image
fetchImage();

//Partie du code pour comparer les deux images
// Comparer les pixels des deux images
let imageData1 = context.getImageData(0, 0, canvas.width, canvas.height);
let imageData2 = contextImage.getImageData(0, 0, canvasImage.width, canvasImage.height);

let pixels1 = imageData1.data;
let pixels2 = imageData2.data;

compareImage.addEventListener("click", () => {
    imageData1 = context.getImageData(0, 0, canvas.width, canvas.height);
    imageData2 = contextImage.getImageData(0, 0, canvasImage.width, canvasImage.height);

    pixels1 = imageData1.data;
    pixels2 = imageData2.data;

    let samePixels = 0;

    const tolerance = 50;

    for (let i = 0; i < pixels1.length; i += 4) {
        const diffRed = Math.abs(pixels1[i] - pixels2[i]);
        const diffGreen = Math.abs(pixels1[i + 1] - pixels2[i + 1]);
        const diffBlue = Math.abs(pixels1[i + 2] - pixels2[i + 2]);
        const diffAlpha = Math.abs(pixels1[i + 3] - pixels2[i + 3]);

        if (diffRed <= tolerance &&
            diffGreen <= tolerance &&
            diffBlue <= tolerance &&
            diffAlpha <= tolerance) {
            samePixels++;
        }
    }

    // Calculer le pourcentage de pixels identiques
    const totalPixels = canvas.width * canvas.height;
    const samePercentage = (samePixels / totalPixels) * 100;

    console.log('Pourcentage de pixels identiques :', samePercentage.toFixed(2) + '%');
})
