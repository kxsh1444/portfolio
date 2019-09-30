var canvas;
var radius = 90;
var startr = 245;
var startg = 230;
var startb = 170;
var r = 235;
var g = 100;
var b = 120;
var t=0;
var activated = false;
var clickCount = 0;
function preload() {
  myFont = loadFont('Quicksand-Bold.otf');
}
function setup() {
  canvas = createCanvas(0.99*window.innerWidth, 0.98*window.innerHeight);
  background(240,230,230);
  /*textFont(myFont);*/
  textAlign(CENTER);
  textSize(24);
  fill(200,180,180);
  text('press RETURN to save drawing, SPACE to clear',0.1*width, height*0.48, 0.8*width, height);
}

function draw() {
  console.log("activated?" + activated);
  if(activated){
    startr = 35*noise(t+6)+220;
    startg = 35*noise(t+20)+220;
    startb = 35*noise(t+1)+220;
    r = 255-200*noise(t);
    g = 255-210*noise(t+9);
    b = 255-200*noise(t+4);
    for (var i = 1; i <= 180; i++){
      var incrementr = (r-startr)/180;
      var incrementg = (g-startg)/180;
      var incrementb = (b-startb)/180;
      var angle = (i/180)*Math.PI;
      //fullcircle
      var lengthOfLine = Math.abs(radius*(Math.sin(Math.acos((90-i)/radius))));
      //halfcircle
      //var lengthOfLine = Math.abs(radius*(Math.sin(Math.acos(i/radius))));
      //diamond
      //var lengthOfLine = Math.abs(radius*(Math.sin(angle)));
      push();
      stroke(startr+incrementr*i, startg+incrementg*i,startb+incrementb*i);
      line(mouseX-radius+i,mouseY-lengthOfLine,mouseX-radius+i,mouseY+lengthOfLine);
      pop();
    }
  }
  t+=1/1000;
}
function mousePressed(){
  console.log("pressed");
  if(clickCount==0){
    clickCount++;
    background(240,230,230);
  }
  activated = true;
}
function touchMoved(){
  console.log("touchMove");
  activated = true;
}
function mouseReleased(){
  console.log("released");
  activated = false;
}
function keyPressed(){
  if(keyCode===RETURN){
      save(canvas, 'squishy.jpg');
  }else if(key === ' ') {
    background(240,230,230);
  }
}
