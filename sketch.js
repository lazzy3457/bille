class Bille {

    constructor (pos, size) {
        this.pos = pos;
        this.vit = createVector(1, 1);
        this.size = size;
        this.color = "#fff";
    }

    colliderWall () {
        // Rebond sur les bords (X)
        if (this.pos.x < this.size/2 + 20|| this.pos.x > width - this.size/2 - 20) {
            this.vit.x *= -1;
        }
        // Rebond sur les bords (Y)
        if (this.pos.y < this.size/2 + 20 || this.pos.y > height - this.size/2 - 20) {
            this.vit.y *= -1;
        }
    }

    CheckClic () {

        // Calcule la distance entre la souris et le centre de la bille
        let d = dist(mouseX, mouseY, this.pos.x, this.pos.y);
        
        // Si la distance est inférieure au rayon
        if (d < this.size / 2) {
            // On change la couleur !
            // Exemple : une couleur aléatoire
            this.color = color(random(255), random(255), random(255));
            console.log("je suis cliqué");
            userSellect = this;
            userFirstPositionClick = [mouseX, mouseY];
            
            // Optionnel : donner une petite impulsion au clic
            // this.vit.add(p5.Vector.random2D().mult(5));
        }
    }

    Lancer () {

        let userLastPositionCliked = [mouseX, mouseY];

        // On crée les deux points
        let pointA = createVector(userFirstPositionClick[0], userFirstPositionClick[1]);
        let pointB = createVector(userLastPositionCliked[0], userLastPositionCliked[1]);

        // Le vecteur résultant est la différence (B - A)
        let vecteurResultat = p5.Vector.sub(pointB, pointA);

        this.vit = vecteurResultat;
        this.vit.mult(-1 / 10)

    }

    update () {

        // this.vit.normalize();    

        if (this.vit.mag() === 0) {
            console.log("La bille est à l'arrêt");
        }
        else if (this.vit.mag() < 0.01) {
            this.vit.set(0, 0); // On force l'arrêt complet
        }
        else {
            this.vit.mult(friction)
        }

        // Appliquer la vitesse à la position
        this.pos.add(this.vit);

        this.colliderWall();   
    }

    draw () {
        fill(this.color)
        circle (this.pos.x, this.pos.y, this.size, this.size)
    }
}

// 
var userSellect;
var userFirstPositionClick;

//
var baseVitesse = 0.1;
var friction = 0.985;

//
var billeA;
var billeB;

// variable color


// variable max pour random
var sizeMax = 30
var nbBilleMax = 30;

// variable min pour random
var sizemin = 10
var nbBilleMin = 15

// 
var bille_list = [];
var nb_bille;

function setup() {
  // Crée une zone de dessin de 800 pixels de large par 600 pixels de haut
  createCanvas(windowWidth, windowHeight);
  
  // Applique une couleur d'arrière-plan (ex: un gris clair)
  background(240);

  nb_bille = random(nbBilleMin, nbBilleMax);

    for (let i = 0; i < nb_bille; i++) {
        let bille = new Bille (createVector(random(windowWidth), random(windowHeight)), random(sizemin, sizeMax))
        bille_list.push(bille)
        bille.draw()
        console.log("bille creer");
    }
}

function draw() {
    background(240)
    
    bille_list.forEach((bille) => {
        bille.update();
        bille.draw();
    });

    for (let i = 0; i < bille_list.length; i++) {
        for (let j = i + 1; j < bille_list.length; j++) {

            billeA = bille_list[i];
            billeB = bille_list[j]

            // Ici, on compare l'élément i avec l'élément j
            let d = billeA.pos.dist(billeB.pos);
            
            if (d < (billeA.size + billeB.size) / 2) {
                console.log("collision detecter");
                let normal = p5.Vector.sub(billeA.pos, billeB.pos); // Vecteur entre les deux centres
                normal.normalize(); // On ne garde que la direction (longueur = 1)
                let relativeVelocity = p5.Vector.sub(billeA.vit, billeB.vit);
                let speed = relativeVelocity.dot(normal);
                if (speed > 0) return; // Elles s'éloignent déjà, on sort de la fonction
                let impulse = normal.mult(speed);
                // On soustrait l'impulsion à l'une et on l'ajoute à l'autre
                billeA.vit.sub(impulse);
                billeB.vit.add(impulse);

            }
        }
    }

}

function mousePressed() {
    // On parcourt toute la liste des billes
    for (let i = 0; i < bille_list.length; i++) {
        bille_list[i].CheckClic();
        if (userSellect) {
            if (bille_list[i] != userSellect) {

                bille_list[i].color = "#fff";
            }
        }
        else {
            bille_list[i].color = "#fff";
        }

    }
}

function mouseReleased() {
    if(userSellect) {
        console.log(userSellect)
        userSellect.Lancer();
    }
    userSellect = null;
}