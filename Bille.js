import drawArrow from "./drawArrow.js";
import Config from "./config.js";

export default class Bille {

    constructor(pos, size) {
        this.pos = pos;
        // On initialise à 0 pour éviter qu'elles ne bougent toutes seules au début
        this.vit = createVector(0, 0); 
        this.size = size;
        this.color = "#fff";
    }

    colliderWall() {
        // Rebond sur les bords (X) avec la marge de 20px
        if (this.pos.x < this.size / 2 + 20 || this.pos.x > width - this.size / 2 - 20) {
            this.vit.x *= -1;
        }
        // Rebond sur les bords (Y)
        if (this.pos.y < this.size / 2 + 20 || this.pos.y > height - this.size / 2 - 20) {
            this.vit.y *= -1;
        }
    }

    CheckClic() {
        let d = dist(mouseX, mouseY, this.pos.x, this.pos.y);
        
        if (d < this.size / 2) {
            this.color = color(random(255), random(255), random(255));
            console.log("Bille sélectionnée");

            // MISE À JOUR : On écrit dans l'objet Config
            Config.user.selectedBille = this;
            Config.user.firstClickPos = createVector(mouseX, mouseY);
            
            return true; // Utile pour savoir si on a touché quelque chose
        }
        return false;
    }

    Lancer() {
        // MISE À JOUR : On récupère le point de départ dans Config
        let start = Config.user.firstClickPos;
        let end = createVector(mouseX, mouseY);

        // Calcul du vecteur de lancer (Inversé pour l'effet élastique)
        let vecteurResultat = p5.Vector.sub(end, start);

        this.vit = vecteurResultat;
        this.vit.mult(-1 / 10); // Puissance du lancer
    }

    update() {
        // MISE À JOUR : Vérification de la sélection via Config
        if (Config.user.selectedBille === this) {
            let start = Config.user.firstClickPos;
            let currentMouse = createVector(mouseX, mouseY);
            
            // Vecteur de tension pour la flèche
            let tension = p5.Vector.sub(start, currentMouse);
            drawArrow(this.pos, tension, "#000");
        }

        // Physique : Arrêt ou Friction
        if (this.vit.mag() < 0.01) {
            this.vit.set(0, 0); 
        } else {
            // MISE À JOUR : Utilisation de la friction globale
            this.vit.mult(Config.physics.friction);
        }

        // Application du mouvement
        this.pos.add(this.vit);
        this.colliderWall();   
    }

    draw() {
        fill(this.color);
        circle(this.pos.x, this.pos.y, this.size);
    }
}