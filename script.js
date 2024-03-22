// Récupérer le canevas et le contexte 2D
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const canvasImage = document.getElementById('canvasImage');
const contextImage = canvasImage.getContext('2d')

const brushSizeSelect = document.getElementById('brushSizeSelect');
const toolSelect = document.getElementById('toolSelect');
const colorSelect = document.getElementById('colorSelect');
const clearAll = document.getElementById('clearAll');
const undoButton = document.getElementById('undoButton');

const compareImage = document.getElementById('compareImage');

//// Variables initialisation
//Pour le dessin
let isDrawing = false;
let tool = "brush"
let lineWidthSize = 10
const brushShape = 'round'

let brushColor = '#000000'
brushSizeSelect.value = "10";
toolSelect.value = "brush"
colorSelect.style.backgroundColor = '#000000'

const colors = ['#FFFFFF', ' #d1d5db', '#fca5a5', '#fdba74', '#fde047', '#86efac', '#67e8f9', '#93c5fd', '#d8b4fe', '#f9a8d4',
'#000000', '#374151', '#b91c1c', '#c2410c ', '#a16207', '#15803d',  '#0e7490',  '#1d4ed8', '#7e22ce', '#be185d'];
const colorButtons = colors.map(color => document.getElementById(`color${colors.indexOf(color)}`));

//Pour la comparasion des images
let randomImage = new Image()

let imageData1 = context.getImageData(0, 0, canvas.width, canvas.height);
let imageData2 = contextImage.getImageData(0, 0, canvasImage.width, canvasImage.height);

let pixels1 = imageData1.data;
let pixels2 = imageData2.data;

// Déclarer une liste pour stocker les actions de dessin
const actions = [];


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
        paintBucket(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop, brushColor)
    }
    else if(tool == "eraser"){
        context.lineWidth = lineWidthSize ;
        context.lineCap = brushShape;
        context.strokeStyle = '#FFFFFF';

        // Effacer avec la gomme
        context.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
        context.stroke();
        context.beginPath();
        context.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
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
    recordAction();
});

// Événement pour dessiner
canvas.addEventListener('mousemove', draw);

// Événement pour définir la taille du pinceau
brushSizeSelect.addEventListener("change", () => {
    lineWidthSize = brushSizeSelect.value
})

// Événement pour définir l'outil utilisé
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

// Fonction pour effacer le canvas
function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

// Événement pour effacer tout le canvas
clearAll.addEventListener("click", (e) => {
    clearCanvas()
})

// Fonction pour enregistrer une action de dessin
function recordAction() {
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    actions.push(imageData);
}

// Fonction pour annuler la dernière action de dessin
function undo() {
    if (actions.length > 0) {
        actions.pop(); // Supprimer la dernière action de la liste
        redrawCanvas(); // Redessiner le canvas avec les actions restantes
    }
}

// Fonction pour redessiner le canvas avec les actions restantes dans la liste
function redrawCanvas() {
    clearCanvas(); // Effacer le canvas

    // Redessiner toutes les actions restantes
    actions.forEach(imageData => {
        context.putImageData(imageData, 0, 0);
    });
}

// Événement pour annuler la dernière action de dessin (par exemple, lorsqu'un bouton "Annuler" est cliqué)
undoButton.addEventListener('click', function() {
    undo();
});

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
// fetchImage();

//Partie du code pour comparer les deux images
// Comparer les pixels des deux images
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

// Fonction pour obtenir la couleur d'un pixel aux coordonnées (x, y)
function getPixelColor(x, y) {
    const imageData = context.getImageData(x, y, 1, 1);
    const data = imageData.data;
    return [data[0], data[1], data[2], data[3]]; // Retourne un tableau [R, G, B, A]
}

function hexToRGBA(hex, alpha) {
    // Convertir la valeur hexadécimale en composantes R, G, B
    const r = parseInt(hex.substring(1, 3), 16);
    const g = parseInt(hex.substring(3, 5), 16);
    const b = parseInt(hex.substring(5, 7), 16);

    // Vérifier si une valeur alpha est fournie, sinon utiliser 1 (opacité totale)
    const a = alpha || 255;

    // Retourner la couleur au format RGBA
    return [r, g, b, a];
}

// Fonction pour définir la couleur d'un pixel aux coordonnées (x, y)
function setPixelColor(x, y, color) {
    const imageData = context.createImageData(1, 1);
    const data = imageData.data;
    data[0] = color[0]; // R
    data[1] = color[1]; // G
    data[2] = color[2]; // B
    data[3] = color[3]; // A
    context.putImageData(imageData, x, y);
}

// Fonction de pot de peinture (remplissage par diffusion)
function paintBucket(x, y, newColor) {
    
    // Récupérer la couleur du pixel de départ
    const startColor = getPixelColor(x, y);
    const newColorRGBA = hexToRGBA(newColor)

    // Vérifier si la nouvelle couleur est différente de la couleur de départ
    if (startColor[0] === newColorRGBA[0] && startColor[1] === newColorRGBA[1]
        && startColor[2] === newColorRGBA[2] && startColor[3] === newColorRGBA[3]) {
        console.log("Même couleur de pixel que le pot de peinture")
        return; // Arrêter si la nouvelle couleur est identique à la couleur de départ
    }

    setPixelColor(x, y, newColorRGBA)

    //D'abord les diagonals
    for(let i = 1; i < canvas.width; i++){
        let pixelColor = getPixelColor(x + i, y + i)

        if (pixelColor[0] === newColorRGBA[0] && pixelColor[1] === newColorRGBA[1]
            && pixelColor[2] === newColorRGBA[2] && pixelColor[3] === newColorRGBA[3]) {
            break;
        }
        setPixelColor(x + i, y + i, newColorRGBA)
    }

    for(let i = 1; i < canvas.width; i++){
        let pixelColor = getPixelColor(x - i, y + i)

        if (pixelColor[0] === newColorRGBA[0] && pixelColor[1] === newColorRGBA[1]
            && pixelColor[2] === newColorRGBA[2] && pixelColor[3] === newColorRGBA[3]) {
            break;
        }
        setPixelColor(x - i, y + i, newColorRGBA)
    }

    for(let i = 1; i < canvas.width; i++){
        let pixelColor = getPixelColor(x + i, y - i)

        if (pixelColor[0] === newColorRGBA[0] && pixelColor[1] === newColorRGBA[1]
            && pixelColor[2] === newColorRGBA[2] && pixelColor[3] === newColorRGBA[3]) {
            break;
        }
        setPixelColor(x + i, y - i, newColorRGBA)
    }

    for(let i = 1; i < canvas.width; i++){
        let pixelColor = getPixelColor(x - i, y - i)

        if (pixelColor[0] === newColorRGBA[0] && pixelColor[1] === newColorRGBA[1]
            && pixelColor[2] === newColorRGBA[2] && pixelColor[3] === newColorRGBA[3]) {
            break;
        }
        setPixelColor(x - i, y - i, newColorRGBA)
    }

    //Ensuite, les lignes
    for(let i = 1; i < canvas.width; i++){
        let pixelColor = getPixelColor(x + i, y)

        if (pixelColor[0] === newColorRGBA[0] && pixelColor[1] === newColorRGBA[1]
            && pixelColor[2] === newColorRGBA[2] && pixelColor[3] === newColorRGBA[3]) {
            break;
        }
        setPixelColor(x + i, y, newColorRGBA)

        for(let j = 1; j < canvas.height; j++){
            pixelColor = getPixelColor(x + i, y + j)
    
            if (pixelColor[0] === newColorRGBA[0] && pixelColor[1] === newColorRGBA[1]
                && pixelColor[2] === newColorRGBA[2] && pixelColor[3] === newColorRGBA[3]) {
                break;
            }
            setPixelColor(x + i, y + j, newColorRGBA)
        }

        for(let j = 1; j < canvas.height; j++){
            pixelColor = getPixelColor(x + i, y - j)
    
            if (pixelColor[0] === newColorRGBA[0] && pixelColor[1] === newColorRGBA[1]
                && pixelColor[2] === newColorRGBA[2] && pixelColor[3] === newColorRGBA[3]) {
                break;
            }
            setPixelColor(x + i, y - j, newColorRGBA)
        }
    }

    for(let i = 1; i < canvas.width; i++){
        let pixelColor = getPixelColor(x - i, y)

        if (pixelColor[0] === newColorRGBA[0] && pixelColor[1] === newColorRGBA[1]
            && pixelColor[2] === newColorRGBA[2] && pixelColor[3] === newColorRGBA[3]) {
            break;
        }
        setPixelColor(x - i, y, newColorRGBA)

        for(let j = 1; j < canvas.height; j++){
            pixelColor = getPixelColor(x - i, y + j)
    
            if (pixelColor[0] === newColorRGBA[0] && pixelColor[1] === newColorRGBA[1]
                && pixelColor[2] === newColorRGBA[2] && pixelColor[3] === newColorRGBA[3]) {
                break;
            }
            setPixelColor(x - i, y + j, newColorRGBA)
        }

        for(let j = 1; j < canvas.height; j++){
            pixelColor = getPixelColor(x - i, y - j)
    
            if (pixelColor[0] === newColorRGBA[0] && pixelColor[1] === newColorRGBA[1]
                && pixelColor[2] === newColorRGBA[2] && pixelColor[3] === newColorRGBA[3]) {
                break;
            }
            setPixelColor(x - i, y - j, newColorRGBA)
        }
    }

    for(let i = 1; i < canvas.height; i++){
        let pixelColor = getPixelColor(x, y + i)

        if (pixelColor[0] === newColorRGBA[0] && pixelColor[1] === newColorRGBA[1]
            && pixelColor[2] === newColorRGBA[2] && pixelColor[3] === newColorRGBA[3]) {
            break;
        }
        setPixelColor(x, y + i, newColorRGBA)

        for(let j = 1; j < canvas.width; j++){
            let pixelColor = getPixelColor(x + j, y + i)
    
            if (pixelColor[0] === newColorRGBA[0] && pixelColor[1] === newColorRGBA[1]
                && pixelColor[2] === newColorRGBA[2] && pixelColor[3] === newColorRGBA[3]) {
                break;
            }
            setPixelColor(x + j, y + i, newColorRGBA)
        }

        for(let j = 1; j < canvas.width; j++){
            let pixelColor = getPixelColor(x - j, y + i)
    
            if (pixelColor[0] === newColorRGBA[0] && pixelColor[1] === newColorRGBA[1]
                && pixelColor[2] === newColorRGBA[2] && pixelColor[3] === newColorRGBA[3]) {
                break;
            }
            setPixelColor(x - j, y + i, newColorRGBA)
        }
    }

    for(let i = 1; i < canvas.height; i++){
        let pixelColor = getPixelColor(x, y - i)

        if (pixelColor[0] === newColorRGBA[0] && pixelColor[1] === newColorRGBA[1]
            && pixelColor[2] === newColorRGBA[2] && pixelColor[3] === newColorRGBA[3]) {
            break;
        }
        setPixelColor(x, y - i, newColorRGBA)

        for(let j = 1; j < canvas.width; j++){
            let pixelColor = getPixelColor(x + j, y - i)
    
            if (pixelColor[0] === newColorRGBA[0] && pixelColor[1] === newColorRGBA[1]
                && pixelColor[2] === newColorRGBA[2] && pixelColor[3] === newColorRGBA[3]) {
                break;
            }
            setPixelColor(x + j, y - i, newColorRGBA)
        }

        for(let j = 1; j < canvas.width; j++){
            let pixelColor = getPixelColor(x - j, y - i)
    
            if (pixelColor[0] === newColorRGBA[0] && pixelColor[1] === newColorRGBA[1]
                && pixelColor[2] === newColorRGBA[2] && pixelColor[3] === newColorRGBA[3]) {
                break;
            }
            setPixelColor(x - j, y - i, newColorRGBA)
        }
    }

   
    // for(let i = 1; i < canvas.width; i++){
    //     for(let j = 1; j < canvas.height; j++){

    //     let pixelColor = getPixelColor(x + i, y + j)

    //     if (pixelColor[0] === newColorRGBA[0] && pixelColor[1] === newColorRGBA[1]
    //         && pixelColor[2] === newColorRGBA[2] && pixelColor[3] === newColorRGBA[3]) {
    //         break;
    //     }
    //     setPixelColor(x + i, y + j, newColorRGBA)
    //     }
    // }

    
}