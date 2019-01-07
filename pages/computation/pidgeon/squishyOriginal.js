var myParticles = [];
var mySprings = [];
var ledgeActivated = true;
var ledgeHeight;
// The index in the particle array, of the one the user has clicked.
var whichParticleIsGrabbed = -1;

var windowBG;
var ledgeFG;

var wingR;
var wingL;
//-------------------------
function setup() {
  angleMode(DEGREES);
  createCanvas(windowWidth*0.99,windowHeight*0.86);
  createParticles(); 
  createSpringMeshConnectingParticles(); 
  windowBG = loadImage("pidgeonWindow.svg"); 
  ledgeFG = loadImage("ledge.svg");

  wingR = loadImage("wingR.svg"); 
  wingL = loadImage("wingL.svg"); 
  ledgeHeight = height/2.2+203;
}

//-------------------------
function createParticles(){
  var particle0 = new Particle(); 
  var particle1 = new Particle(); 
  var particle2 = new Particle(); 

  particle0.set(width*0.45-50,130);
  particle1.set(width*0.45+50,130);
  particle2.set(width*0.45,50);
  
  particle0.bHardBoundaries = true; 
  particle1.bHardBoundaries = true; 
  particle2.bHardBoundaries = true; 
  
  myParticles.push(particle0);
  myParticles.push(particle1);
  myParticles.push(particle2);
}
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
//-------------------------
function createSpringMeshConnectingParticles(){
  // The spring constant. 
  var K = 0.1; 
  
  // Stitch the particles together by springs.
  var p0 = myParticles[0];
  var p1 = myParticles[1];
  var p2 = myParticles[2];
  
  var aSpring0 = new Spring(); 
  aSpring0.set (p0, p1, K);
  mySprings.push(aSpring0);
  
  var aSpring1 = new Spring(); 
  aSpring1.set (p1, p2, K);
  mySprings.push(aSpring1);
  
  var aSpring2 = new Spring(); 
  aSpring2.set (p0, p2, K);
  mySprings.push(aSpring2);
}


function mousePressed() {
  // If the mouse is pressed, 
  // find the closest particle, and store its index.
  whichParticleIsGrabbed = -1;
  var maxDist = 9999;
  for (var i=0; i<myParticles.length; i++) {
    var dx = mouseX - myParticles[i].px;
    var dy = mouseY - myParticles[i].py;
    var dh = sqrt(dx*dx + dy*dy);
    if (dh < maxDist) {
      maxDist = dh;
      whichParticleIsGrabbed = i;
    }
  }
  if(mouseY<ledgeHeight && mouseX<width/2+41 && mouseX>width/2-260){
    ledgeActivated = true;
  }else{
    ledgeActivated = false;
  }
}
 
 
function draw() {
  background (217,116,77);
  imageMode(CENTER);
  image(windowBG,width/2,height/2.2,785,555);
  var mouthx;
  var mouthy;
  
  
  for (var i=0; i<myParticles.length; i++) {
    myParticles[i].addForce(0, 0.1); // gravity!
    myParticles[i].update(); // update all locations
  }
  if (mouseIsPressed && (whichParticleIsGrabbed > -1)) {
    // If the user is grabbing a particle, peg it to the mouse.
    myParticles[whichParticleIsGrabbed].px = mouseX;
    myParticles[whichParticleIsGrabbed].py = mouseY;
  }
  for (var i=0; i<mySprings.length; i++) {
    mySprings[i].update(); // update all springs
  }
  for (var i=0; i<mySprings.length; i++) {
    mySprings[i].render(); // render all springs
  }

  var distOfBody = int(sqrt(sq(myParticles[1].px-myParticles[0].px)+sq(myParticles[1].py-myParticles[0].py)));
  for(var i=0; i<30; i++){

    var radiusOfCircle = map(i,0,29,30,0.8*distOfBody);
    var xValue= map(i,0,29,myParticles[2].px,(myParticles[1].px+myParticles[0].px)/2);
    var yValue = map(i,0,29,myParticles[2].py,(myParticles[1].py+myParticles[0].py)/2);
    

    push();//create pidgeon shadow
    blendMode(OVERLAY);
    // fill(194,84,43);
    fill(80,39,0,10);
    noStroke();
    ellipse(xValue-40,yValue+30,radiusOfCircle);
    pop();

    from = color(30,70,60);
    to = color(210,220,223);
    push();
    fill(lerpColor(from, to,i/29),30);
    stroke(98,202,179,20);
    ellipse(xValue,yValue,radiusOfCircle);
    pop();
    if(i==0){
      mouthx = xValue;
      mouthy = yValue+2;
    }else if(i==14){//draw wings

      //face is drawn:
      fill(255,180,150);
      ellipse(mouthx, mouthy, 4,5);
      fill(0);
      ellipse(mouthx-9,mouthy-5,5,4);
      ellipse(mouthx+9,mouthy-5,5,4);

      //dist of body changes the local angle of the wing flap
      var localWingFlap = map(distOfBody,80,110,30,-40);
      push();
      translate(xValue,yValue);
      //general angle determines base angle starting point for wings
      var angleL=atan((myParticles[2].py-myParticles[0].py)/(myParticles[2].px-myParticles[0].px));
      rotate(angleL+(37-localWingFlap));
      image(wingL,-50,20,61,27);
      pop();
      push();
      translate(xValue, yValue);
      var angleR=atan((myParticles[1].py-myParticles[2].py)/(myParticles[1].px-myParticles[2].px));
      rotate(angleR-(37-localWingFlap));
      image(wingR,50,20,61,27);
      pop();
    }
    else if(i==29){
      fill(210,98,53,90);
      var feetx =(xValue+myParticles[1].px)/2;
      var feety =(yValue+myParticles[1].py)/2;
      ellipse(feetx, feety,7,20);
      ellipse(feetx-5,feety,6,18);
      ellipse(feetx+5,feety,6,18);
      
      ellipse((xValue+myParticles[0].px)/2, (yValue+myParticles[1].py)/2,7,20);
      ellipse((xValue+myParticles[0].px)/2-5, (yValue+myParticles[1].py)/2,6,18);
      ellipse((xValue+myParticles[0].px)/2+5, (yValue+myParticles[1].py)/2,6,18);
    }
  }

  if(ledgeActivated && myParticles[0].py-10<ledgeHeight 
    && myParticles[1].py-10<ledgeHeight 
    && myParticles[2].py-10<ledgeHeight){
    image(ledgeFG,width/2,height/2.2,525,555);
  }

  
}


//==========================================================
var Particle = function Particle() {
  this.px = 0;
  this.py = 0;
  this.vx = 0;
  this.vy = 0;
  this.mass = 1.0;
  this.damping = 0.96;
  
  this.bFixed = false;
  this.bLimitVelocities = true;
  this.bPeriodicBoundaries = false;
  this.bHardBoundaries = false;
  
  
  // Initializer for the Particle
  this.set = function(x, y) {
    this.px = x;
    this.py = y;
    this.vx = 0;
    this.vy = 0;
    this.damping = 0.96;
    this.mass = 1.0;
  };

  // Add a force in. One step of Euler integration.
  this.addForce = function(fx, fy) {
    var ax = fx / this.mass;
    var ay = fy / this.mass;
    this.vx += ax;
    this.vy += ay;
  };

  // Update the position. Another step of Euler integration.
  this.update = function() {
    if (this.bFixed === false){
      this.vx *= this.damping;
      this.vy *= this.damping;
  
      this.limitVelocities();
      this.handleBoundaries();
      this.px += this.vx;
      this.py += this.vy;
    }
  };

  this.limitVelocities = function() {
    if (this.bLimitVelocities) {
      var speed = sqrt(this.vx * this.vx + this.vy * this.vy);
      var maxSpeed = 10;
      if (speed > maxSpeed) {
        this.vx *= maxSpeed / speed;
        this.vy *= maxSpeed / speed;
      }
    }
  };

  this.handleBoundaries = function() {
    if (this.bPeriodicBoundaries) {
      if (this.px > width) this.px -= width;
      if (this.px < 0) this.px += width;
      if (this.py > height) this.py -= height;
      if (this.py < 0) this.py += height;
    } else if (this.bHardBoundaries) {
      if (this.px >= width){
        this.vx = abs(this.vx)*-1;
      }
      if (this.px <= 0){
        this.vx = abs(this.vx);
      }
      if (this.py >= height){
        this.vy = abs(this.vy)*-1;
      }
      if (ledgeActivated && this.py >= ledgeHeight){
        this.vy = abs(this.vy)*-1;
      }
      if (this.py <= 0){
        this.vy = abs(this.vy);
      }
    }
  };

  this.render = function() {
    fill(100,200,220,50);
    ellipse(this.px, this.py, 9, 9);
  };
}


//==========================================================
var Spring = function Spring() {
  var p;
  var q;
  var restLength;
  var springConstant;

  this.set = function(p1, p2, k) {
    p = p1;
    q = p2;
    var dx = p.px - q.px;
    var dy = p.py - q.py;
    restLength = sqrt(dx * dx + dy * dy);
    springConstant = k;
  };

  this.update = function() {
    var dx = p.px - q.px;
    var dy = p.py - q.py;
    var dh = sqrt(dx * dx + dy * dy);

    if (dh > 1) {
      var distention = dh - restLength;
      var restorativeForce = springConstant * distention; // F = -kx
      var fx = (dx / dh) * restorativeForce;
      var fy = (dy / dh) * restorativeForce;
      p.addForce(-fx, -fy);
      q.addForce( fx,  fy);
    }
  };

  this.render = function() {
    stroke(100,200,220,50);
    line(p.px, p.py, q.px, q.py);
  };
}