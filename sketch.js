let video;
let predictions = [];

let tiles=[];
let tileSize=80;
let tileSpace=20;
let speed=5;
let col1=255;
let instruments=["trumpet","piano","drum","percussion","stab"];

let sound0;
let sound1;
let sound2;
let sound3;
let sound4;

function preload(){
    // some reason it does not work with the loadSound
    // sound0=loadSound('1stab.mp3');
    // sound1=loadSound('2percussion.mp3');
    // sound2=loadSound('3drum.mp3');
    // sound3=loadSound('4piano.mp3');
    // sound4=loadSound('5suspense.mp3');
}

function setup() {
    createCanvas(400, 400);
    angleMode(DEGREES);

    video = createCapture(VIDEO);
    video.size(width, height);
    print("loading")

    handpose = ml5.handpose(video, modelReady);

    // This sets up an event that fills the global variable "predictions"
    // with an array every time new hand poses are detected
    handpose.on("predict", function(results) {
    predictions = results;
    });


    // Hide the video element, and just show the canvas
    video.hide();

    for(let i=0; i<height; i+=tileSize){
        for(let j=0; j<width; j+=tileSize){
            let makeTile = new Tile(j,i,tileSize,tileSpace,col1,(i/tileSize)+(j/tileSize*5));
            tiles.push(makeTile);
        }    
    }
}

function modelReady() {
    console.log("Model ready!");
}

function draw() {
    image(video, 0, 0, width, height);
    drawObject();

    textSize(10);
    textFont("monospace");
    noStroke(); 
    
    for(let i=0; i<tiles.length; i++){
        tiles[i].grid();
        
        fill('black');
        text(i+1,i*tileSize+(tileSize/2),tileSpace/2);
        
        push();
        translate(0,height);
        rotate(-90);
        text(instruments[floor(i%5)],i*tileSize+(tileSpace/2),tileSpace/2);
        pop();
    }

    let bar=frameCount*speed%width
    stroke(1);
    line(bar,0,
        bar,height);
    noStroke(); 
  
    let columnNum=floor(bar/tileSize);
    if(frameCount % (tileSize/speed) == 0){
        for(let rowNum=0; rowNum<5; rowNum++){
        tiles[(rowNum*5)+columnNum].play();
        }
    }
    floor(columnNum);
}

// A function to draw a ball at the tip of the fingers
function drawObject() {
    if (predictions.length > 0) {
        let prediction = predictions[0];
        //index finger
        let indexX = prediction.annotations.indexFinger[3][0]
        let indexY = prediction.annotations.indexFinger[3][1]
        //middle finger    
        let middleX = prediction.annotations.middleFinger[3][0]
        let middleY = prediction.annotations.middleFinger[3][1]
        //ring finger
        let ringX = prediction.annotations.ringFinger[3][0]
        let ringY = prediction.annotations.ringFinger[3][1]

        noStroke();

        ellipse(round(indexX), round(indexY), 33, 33);    // Top circle
        ellipse(round(middleX), round(middleY), 33, 33); // Middle circle
        ellipse(round(ringX), round(ringY), 33, 33); // Bottom circle
    }
}

function mousePressed(){
    for(let i=0; i<height; i+=tileSize){
        for(let j=0; j<width; j+=tileSize){
         
            if(indexX>i+10 && indexX<i+tileSize-10){
                if(indexY>j+10 && indexY<j+tileSize-10){
            
                    tiles[(i/tileSize)+(j/tileSize*5)].click();
                }
            }   
        }    
    }
}

class Tile {
    constructor(x,y,size,space,col1,order){
        this.x=x;
        this.y=y;
        this.size=size;
        this.space=space;
        this.col1=col1;
        this.on=false;
        this.order=order;
        this.instrument=this.order%5;
    }
    grid(){
        fill(this.col1);
        rect(this.x+(this.space/2),this.y+(this.space/2),
            this.size-this.space,this.size-this.space);
    }
    click(){
        this.on = !this.on;
    }
    play(){
        if(this.on == true){
            if(this.instrument == 0){
                sound0.setVolume(10);
                sound0.play();
            }else if(this.instrument == 1){
                sound1.play();
            }else if(this.instrument == 2){
                sound2.play();
            }else if(this.instrument == 3){
                sound3.play();
            }else{
                sound4.setVolume(0.08);
                sound4.play();
            } 
        }
    }
}