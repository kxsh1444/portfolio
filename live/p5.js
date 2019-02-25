var things = [];
var numOfThings;
  var which;
function setup() { 
  colorMode(HSB,100);
  angleMode(DEGREES);
  numOfThings = random(15,40);
  which= int(random(0,2));
  print(which);
  createCanvas(windowWidth, windowHeight);
  if(which==1){
    for (var i=0; i<numOfThings; i++) {
      things.push(new Bubble(i,numOfThings));
    }
  }else{
    for (var j=0; j<numOfThings; j++) {
      things.push(new Liner(j,numOfThings));
    }
  }

} 

function draw() { 
  background(255);
  for (var i=0; i<things.length; i++) {
    things[i].move();
    things[i].display();
  }
}

function Bubble(order,total) {
  this.x = height/2;
  this.y = width/2;
  this.targetY = random(height);
  this.targetX = random(width);
  this.diameter = random(10,0.04*width);
  this.o = map(dist(this.targetX,this.targetY,width*0.4,height/2),0,width/2,0,80);
  this.range =map(order,0,total,0,40);

  this.move = function() {
    this.x = this.x*0.9+0.1*map(mouseX,0,width,
                       this.targetX+this.range,
                       this.targetX-this.range);
    this.y = this.y*0.9+0.1*map(mouseY,0,height,
                       this.targetY+this.range,
                       this.targetY-this.range);
  };

  this.display = function() {
    this.h = map(this.x,0,width,35,60);
    stroke(this.h,70,80,this.o);    
    fill(255);
    ellipse(this.x, this.y, this.diameter, this.diameter);
  };
}

function Liner(order,total) {
  this.x = height/2;
  this.y = width/2;
  this.angle = random(0,360);
  this.targetY = random(height);
  this.targetX = random(width);
  this.diameter = random(15,50);
      this.xx = this.x+(cos(this.angle)/this.diameter);
    this.yy = this.y+(sin(this.angle)/this.diameter);
  this.o = map(dist(this.targetX,this.targetY,width*0.4,height/2),0,width/2,0,80);
  this.range =map(order,0,total,0,40);

  this.move = function() {
    this.x = this.x*0.9+0.1*map(mouseX,0,width,
                       this.targetX+this.range,
                       this.targetX-this.range);
    this.y = this.y*0.9+0.1*map(mouseY,0,height,
                       this.targetY+this.range,
                       this.targetY-this.range);
    this.xx = this.x+(cos(this.angle)*this.diameter);
    this.yy = this.y+(sin(this.angle)*this.diameter);
  };

  this.display = function() {
    this.h = map(this.x,0,width,35,60);
    stroke(this.h,70,80,this.o);
    strokeWeight(2);
    line(this.x, this.y, this.xx,this.yy);
  };
}
function windowResized () {resizeCanvas (windowWidth, windowHeight); }