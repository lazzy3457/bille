class Bille {

    constructor (pos, size) {
        this.pos = pos;
        this.vit = createVector(1, 1);
        this.size = size;
    }

    // colliderManager () {
    //     if ()
    // }

    update () {
        // Appliquer la vitesse à la position
        this.pos.add(this.vit);

        // Rebond sur les bords (X)
        if (this.pos.x < this.size/2 || this.pos.x > width - this.size/2) {
            this.vit.x *= -1;
        }
        // Rebond sur les bords (Y)
        if (this.pos.y < this.size/2 || this.pos.y > height - this.size/2) {
            this.vit.y *= -1;
        }
    }

    draw () {
        circle (this.pos.x, this.pos.y, this.size, this.size)
    }
}


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
            
            if (d < billeA.size + billeB.size) {
                console.log("collision detecter");
                let normal = p5.Vector.sub(billeA.pos, billeB.pos); // Vecteur entre les deux centres
                normal.normalize(); // On ne garde que la direction (longueur = 1)
                let relativeVelocity = p5.Vector.sub(billeA.vit, billeB.vit);
                let speed = relativeVelocity.dot(normal);
                if (speed > 0) break; // Elles s'éloignent déjà, on sort de la fonction
                let impulse = normal.mult(speed);
                // On soustrait l'impulsion à l'une et on l'ajoute à l'autre
                billeA.vit.sub(impulse);
                billeB.vit.add(impulse);

            }
        }
    }

}