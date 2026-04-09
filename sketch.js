import Bille from "./Bille.js";
import Config from "./config.js";

// On attache les fonctions à window pour p5.js
window.setup = setup;
window.draw = draw;
window.mousePressed = mousePressed;
window.mouseReleased = mouseReleased;

let explication;

function setup() {
    createCanvas(windowWidth, windowHeight);
    background(240);

    // On utilise les réglages de Config pour la génération
    let nb_bille = random(Config.settings.nbBilleMin, Config.settings.nbBilleMax);

    for (let i = 0; i < nb_bille; i++) {
        let pos = createVector(random(width), random(height));
        let size = random(Config.settings.sizeMin, Config.settings.sizeMax);
        
        // On stocke les billes directement dans le tableau du Config
        Config.billes.push(new Bille(pos, size));

    }
    explication = createP('Cliquez sur une boule, maintenez le bouton enfoncé pour la déplacer, puis relâchez');
    explication.position(windowWidth/2 - 400, windowHeight/2);
    explication.style('font-family', 'sans-serif');
    explication.style('font-size', "50px");
    explication.style('font-weight', "bold");
    explication.style('text-align', "center");
    explication.style("color", "blue");
    explication.size(800);
    explication.show()
}

function draw() {
    background(240);

    if (Config.message.explication) {
        explication.show();
    }
    else {
        explication.hide();
    }
    
    // 1. Mise à jour et dessin
    Config.billes.forEach((bille) => {
        bille.update();
        bille.draw();
    });

    // 2. Gestion des collisions
    for (let i = 0; i < Config.billes.length; i++) {
        for (let j = i + 1; j < Config.billes.length; j++) {
            let bA = Config.billes[i];
            let bB = Config.billes[j];

            let d = bA.pos.dist(bB.pos);
            
            if (d < (bA.size + bB.size) / 2) {
                let normal = p5.Vector.sub(bA.pos, bB.pos).normalize();
                let relativeVelocity = p5.Vector.sub(bA.vit, bB.vit);
                let speed = relativeVelocity.dot(normal);
                
                // IMPORTANT : continue au lieu de return pour ne pas stopper le draw
                if (speed > 0) continue; 

                let impulse = normal.mult(speed);
                bA.vit.sub(impulse);
                bB.vit.add(impulse);
            }
        }
    }
}

function mousePressed() {
    // On réinitialise la sélection avant de vérifier
    Config.user.selectedBille = null;

    for (let i = 0; i < Config.billes.length; i++) {
        let aEteClique = Config.billes[i].CheckClic();
        
        // Si on a cliqué sur une bille, on peut blanchir les autres
        if (aEteClique) {
            Config.billes.forEach(b => {
                if (b !== Config.user.selectedBille) b.color = "#fff";
            });
            break; // On a trouvé notre bille, on arrête la boucle
        }
    }
}

function mouseReleased() {
    if (Config.user.selectedBille) {
        Config.user.selectedBille.Lancer();
    }
    // On vide la sélection dans Config
    Config.user.selectedBille = null;
    Config.user.firstClickPos = null;
}