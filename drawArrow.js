export default function drawArrow(base, vec, myColor) {
  if (vec.mag() < 2) return; // Ne pas dessiner si le vecteur est presque nul
  
  push();
  stroke(myColor);
  strokeWeight(2);
  fill(myColor);
  
  translate(base.x, base.y);
  line(0, 0, vec.x, vec.y); // Dessine la ligne du centre vers le vecteur
  
  rotate(vec.heading());
  let arrowSize = 7;
  translate(vec.mag(), 0); // Va au bout de la flèche
  triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
  pop();
}