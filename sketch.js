//DATA VISUALIZATION ;; KEXP SONGS TOP PLAYED DEC. 2024
//data source: https://www.kexp.org/charts/12-16-2024/
// by gabriel hernandez-zepeda
//call data from JSON
//elements: number, artist, song, record label, category
let top100Data;
let top100Tracks;

let inputBox;
// let topTenData;
// let topTenTracks;

let genresArray = [
  // Rock/Guitar/Alternative/Punk types
  "Indie Rock", "Alternative Rock", "Garage Rock", "Punk", "Punk Rock", "Gothic-Punk", "Post-Punk", "Neo-Psychedelia", "Psychedelic Rock", 
  "Dream Rock", "Shoegaze", "Blues Rock", "Funk Rock", "Dance-Punk", "Rock",

  // Folk/Guitar/Indie acoustic
  "Indie Folk", "Bedroom Pop", 

  // African-American music styles
  "Hip Hop", "Soul", "Soul Funk", "Alternative R&B", "R&B", "R&B/Soul", "Jazz-Funk", "Afrobeat", "Afro-Jazz", "Jazz Fusion",

  // Pop-related styles
  "Pop", "Indie Pop", "Art Pop", "Alt-Pop", "Dream Pop", "Experimental Pop", "Synth Pop", "Synth-Pop", "Glitch Pop", "Nu-Disco",

  // Electronic/Experimental styles
  "Electronica", "Electronic", "Electronic Pop", "Electro-Pop", "House", "Experimental", "Experimental Rock", "Indie Electronic",

  // World/Global/Other
  "World Music", "World Disco"
];
let colorsArray = [
    // Rock/Guitar/Alt/Punk: blue hues
  "royalblue", "deepskyblue", "dodgerblue", "navy", "steelblue", "midnightblue", "slateblue", "cornflowerblue", "teal", "indigo", "powderblue", "blueviolet", "mediumblue", "lightskyblue",

  // Folk/Acoustic: warm soft colors
  "saddlebrown", "peachpuff",

  // African-American styles: green hues
  "mediumseagreen", "forestgreen", "seagreen", "limegreen", "springgreen", "olive", "darkgreen", "yellowgreen", "greenyellow", "lawngreen",

  // Pop/Indie pop: light and saturated pinks/purples
  "hotpink", "lightpink", "magenta", "violet", "orchid", "mediumorchid", "plum", "palevioletred", "fuchsia", "thistle",

  // Electronic/Experimental: purples + strong pinks
  "purple", "mediumpurple", "darkviolet", "deeppink", "darkmagenta", "pink", "mediumslateblue",

  // World/Global: random/other
  "gold", "orange"
];

let hoverFill = 0;
let clickFill = 0;

this.genreFillColor = (180);

let easedX;
let easingFactor = 0.07;
let customFillAlpha = 100;

//array for objects bouncing
let balls = [];

//array to store generated positions
let positions = [];

//variable to output
let globalY;

let minDist = 1;

let ballsInitAmt = 98;
let growInit = 25;


let objectSelected = false;

let songSelected;
let selectedIndex;

function preload() {
top100Data = loadJSON("kexp_top100.json");
//topTenData = loadJSON("kexp_topTen.json");
}


function setup() {
    createCanvas(windowWidth, windowHeight);
    frameRate(30);

    //grab text box once
    inputBox = select('#searchBox');
    if (!inputBox) {
    console.error("❌ No element with ID 'searchBox' found!");
    // Optionally, create one dynamically:
    inputBox = createInput('').id('searchBox').attribute('readonly','');
  }
    //wire the click - google search (only once)
      inputBox.mousePressed(() => {
    const q = encodeURIComponent(inputBox.value());
    window.open(`https://www.google.com/search?q=${q}`, '_blank');
  });

  copyBox = select('#copyBox');
  if (!copyBox) {
  // fallback: create if not found
  copyBox = createInput('').id('copyBox').attribute('readonly', '');
  }



    background(0);
    textFont("courier new");
    //blendMode(OVERLAY);


    easedX = mouseX;
    for (let i = 0; i<ballsInitAmt; i++){
    
    let intentions = 0;
    let valid = false;
    let x, y;

    //let randAdd = 1 + random(-0.1, 0.1);
    // let indexI = i;
    //let ballColor;
    
    while(!valid && intentions < 999){
      x = random(20+width-40);
      y = random(20+height-40);
      //randAdd = random(-.1, 0.1);
      valid = true;
    
    
    //check distance from all previous positions
    for (let p of positions) {
      if(dist(x, y, p.x, p.y) < minDist){
        valid = false;
        break;
      }
    }
    intentions++;
    }
  
  if(valid) {
    const pos = createVector(x,y);

    positions.push(pos);

    let randAdd = 1 + random(-0.1, 0.1);

    let indexI = positions.length - 1; 
    // here index
    //is set to indexI
    
   let b = new Ball(pos.x, pos.y, 10, growInit, randAdd, indexI);
   balls.push(b);
    
  }
 }
}


function draw(){
 background(245, 255, 250);
//  fill(255, 200);
//  rect(0, 0, width, height)


 




 let iX = mouseX;
 let iY = mouseY;

    fill(0, 50, 100);
    strokeWeight(2);
    stroke(0, 100, 0);
    textAlign(CENTER);
    textSize(20);
    text('Most Played Songs on KEXP December 2024', width/2, 25);
    
    
    



for (i = 0; i< positions.length; i++){
  
    balls[i].rollover(iX, iY, 'blue');
  
    balls[i].update(iX, iY);
    
    balls[i].displayBall();
    //balls[i].pulse(iX, iY);

  }

if(selectedIndex>-1){

    //ensure song ifno correctly retreived
    top100Tracks = top100Data.tracks[selectedIndex];

    //check if track data valid before trying to display
    if(top100Tracks){
    let artist = top100Tracks.artist;
    let song = top100Tracks.song;
    let category = top100Tracks.category;
    let number = top100Tracks.number;
    let label = top100Tracks.label;

    textSize(24);
    //display song info code//
    strokeWeight(3);
    stroke(255, 240, 255);
    fill(hoverFill);
    //calculate difference between the target (mouseX) and the current easedX
    let targetX = mouseX;
    let easedDifference = targetX - easedX;
    //add a fraction of the difference to the easedX
    easedX += easedDifference * easingFactor;
    textAlign(LEFT);
    easedX = map(easedX, 0, width, 0, width-35);
    text('Top Played Song #'+number, easedX, (height/10));
    strokeWeight(1);
    fill(clickFill*-1);
    textAlign(LEFT);
    textSize(18);
    text('Artist: '+artist, 20, (height/10)*1.5);
    text('Song Title: '+song, 20, (height/10)*2);
    text('Record Label: '+label, 20, (height/10)*2.5);
    text('Genre: '+category, 20, (height/10)*3);

         let artistHTML = artist;
         let songHTML   = song;
         let genreHTML  = category;
         let labelHTML = label ;

        // --- update the box dynamically ---
        const outputText = `Artist: ${artistHTML} | Song: ${songHTML} | Genre: ${genreHTML} | Label: ${labelHTML}`;

        inputBox.value(outputText);
        copyBox.value(outputText); // top box updates too

    }
 }
}


class Ball {
  constructor(tempX, tempY, tempD, tempGrow, randAddAmt, indx){
  

    this.x = tempX;
    this.y = tempY;
    this.d = tempD;

    this.storedSize;

    this.b = 255;

    this.tempFill = 0;
    this.strokeW = 1;
    this.strokeTextW = 1;
    this.clickedStrokeColor = ('black');

    this.ballModify = map(indx, 98, 0, 1, 100);
    

    //rotation vars
    let rotationInit = random(90, 270);
    this.rotAngle = rotationInit;
    this.rotateSpeed = 2;
       
    //this.pulseGrow = tempGrow;
    //this.randXadd = randAddAmt;

    this.objectIndex = indx;

    this.xspeed = 1;
    this.vy = 0.5;
    this.g = 0.1;
    this.damping = 1.0;
    this.paused = false; //true while hovered over
    this.iAmHovering = false;
    this.savedX = this.xspeed;
    this.savedY = this.vy;
    this.catColor = 'green';
    }
  
  update (px, py){
      

        //hover to stop
        // let canHover = !objectSelected || this.iAmHovering;

        // const hovering = dist(px, py, this.x, this.y) <= this.d/2;

        if(this.iAmHovering){

        if(!this.paused){
          //only save speed and paused if we weren't already paused
          this.savedX = this.xspeed;
          this.savedY = this.vy; // also save Y speed for vertical movement
          this.paused = true;
         }
         //freeze in place while hovered
         this.vy = 0;
         this.xspeed = 0;
         return; // stop further calculations
        } else {
          //if we are NOT hovering over this ball
          //unpause logic; restore speed once when unpausing
          if(this.paused) {
            
            this.xspeed = this.savedX !== undefined ? this.savedX : 0.5; // restore x speed;
            this.vy = this.savedY !==undefined ? this.savedY : 0.5;
            this.paused = false;
          }
        }

          //movement
          this.x = this.x - this.xspeed;
          if(this.x <= -5) {
           this.x = this.x+windowWidth+5;
           }
          //fall with acceleration (drops faster near bottom of screen)

        let localG = map(this.objectIndex, -1, 101, 0.3, 0.01);

          
          this.vy += localG;
          this.y += this.vy;

            //bounce with logarithmic-like decay
            //(exponential envelope)

            const floorY = height - this.d;
            if(this.y > floorY) {
              this.y  = floorY;
              this.vy *= -this.damping // invert & dampen
              if(abs(this.vy) < 0.2) this.vy = 0;
            }
        }
        

    
  
    rollover(px, py, color){

        //1. calc perm size base -(sizeAdjusted)
        let sizeAdjusted;

         if(this.ballModify>= 90 && this.ballModify <= 100) {
            sizeAdjusted = map(this.ballModify, 100, 90, 200, 75);
        } else if (this.ballModify < 90 && this.ballModify >= 50){
            sizeAdjusted = map(this.ballModify, 89, 50, 75, 40);
        } else if (this.ballModify < 49 && this.ballModify >= 1){
            sizeAdjusted = map(this.ballModify, 51, 98, 40, 25);
        } else {
            sizeAdjusted = 25; //fallback for unhandled indexes.
        }
        //critical correction (from manus)
        //store base ize to ensure current size is at least
        //base size
         this.baseSize = sizeAdjusted;
        if (this.d < this.baseSize) {
            this.d = this.baseSize;
        }
       

        let distance = dist(this.x, this.y, px, py);
        //use proportional detection radius
        let isOver = distance <= this.d / 2;
        let isHoldingLock = this.iAmHovering;

        //2. lock release logic (must be at top
        //for immediate response)
        if(isHoldingLock && !isOver){
          this.iAmHovering = false;
          objectSelected = false;
          //ball will shrink back to base size in 'else
            //block below
          // release global lock
          //reset visual state here if needed
          // this.strokeW = 10;
          // this.clickedStrokeColor = 255;
        }
     

        let canAcquireLock = isOver && !objectSelected;

        //3. hover / selection logic
        if (canAcquireLock || isHoldingLock) {

          if(canAcquireLock){
          this.iAmHovering = true;
          objectSelected = true;
          selectedIndex = this.objectIndex; // set global index
          

          //animation : grow/pulse when hovered;
          let maxGrow = this.baseSize + 15;
          //define max size for growth
        
          if (this.d <= maxGrow) {
            this.d+= 1.5;
          } else {
            //optional; add subtle pulse effect once max size is reached
            let pulse = sin(frameCount*0.1) * 2;//
            //oscillates between - 2 and 2
            this.d = maxGrow + pulse;
          }
        if(objectSelected === true){
          hoverFill = this.clickedStrokeColor;
          clickFill = this.clickedStrokeColor;
          textSize(20);

        //calculate distance from mouse xy to object(ball)
        ///executes if distance is less than diameter and  diameter is greater than 50
        
        textSize(20);
        hoverFill = 0;
        //fill(128, 128, 255, 1);
        strokeWeight(this.strokeTextW);
        //text("current-y: "+round(this.y), this.x, this.y-25);
          
          if(mouseIsPressed){
            console.log('mouse is pressed')
            
         
            globalY = round(this.y);
            //console.log("current-y Updated! "+round(millis()/100) );
            songSelected = globalY;

            //clickFill = 0;
            //hoverFill = 0;

            selectedIndex = this.objectIndex;
            this.strokeW = 5;

               
            // assignCategoryColorFromData(selectedIndex)
            if(selectedIndex> -1) {
            let trackSelected = top100Data.tracks[selectedIndex];

             //category color override
            let gi = genresArray.indexOf(trackSelected.category);
            if (gi > -1) {
          // grab the matching CSS colour name
           this.catColor = colorsArray[gi % colorsArray.length];
            }
            
            if(trackSelected){
            
            let genre = trackSelected.category;
                //console.log(genre);
            //find index in genre array
            let gi = genresArray.indexOf(genre);

        //     if (foundIndex > -1){
             //use color name mapped to found genre
             let colorName = colorsArray[gi % colorsArray.length]
             this.catColor = colorName;
        //     }
        //  else {
        //     //not matched, treat as OTHER : random color
        //     //this.catColor = 'black';
        // }
        }
            this.clickedStrokeColor = this.catColor;
            console.log(this.clickedStrokeColor);
        }
            
        }
        }
        this.tempFill = 128;
      } else {
        //smaller balls 'grow' while hovered
        textSize(8);
        //fill(222);
        strokeWeight(this.strokeTextW);
        //text("grow", this.x, this.y+10);
        hoverFill = 0;
        clickFill = 128;
        
        selectedIndex = this.objectIndex;
        
        //text("size: "+this.d, this.x, this.y-25);
      } 
    } else {
      // not over : shrink gently (down to a floor), clear flags 'if we owned the lock
      if(isHoldingLock) {
        this.iAmHovering = false;
        objectSelected = false; // release global lock
      }
      if(this.d > this.baseSize) {
        this.d = this.d - 1.5; // shrink rate
      } else {
        this.d = this.baseSize;
        if(!isHoldingLock) {
            //selectedIndex = -1;
        }
        //ensure it doesnt shrink past base size
      }
        //visuals
        strokeWeight(this.strokeTextW);
        //text("shrink", this.x, this.y-10);
        clickFill = 240;
        hoverFill = 0;
        //clear selected index when no ball is selected
        //selectedIndex = -1;
      }
      
      if(this.d <= 30){
        hoverFill = 0;
        this.tempFill = 200;
       }
      }
        
    
  
        

    displayBall() {
        let sizeAdjusted;

        //adjusts ellipse size bazed on song position# (this.ballModify)

        if(this.ballModify>= 90 && this.ballModify <= 100) {
            sizeAdjusted = map(this.ballModify, 100, 90, 200, 75);
        } else if (this.ballModify < 90 && this.ballModify >= 50){
            sizeAdjusted = map(this.ballModify, 89, 50, 75, 40);
        } else if (this.ballModify < 49 && this.ballModify >= 1){
            sizeAdjusted = map(this.ballModify, 51, 98, 40, 25);
        } else {
            sizeAdjusted = 25; //fallback for unhandled indexes.
        }

        //(0, 25);
        strokeWeight(5);

        //spotlight effect
        stroke(hoverFill, 20);
        line(this.x, this.y, width/2, 40);
        
        strokeWeight(this.strokeW);
        const isSelected = objectSelected && selectedIndex === this.objectIndex;

    // 2. Set Stroke Weight and Color
    if (isSelected) {
        // When this ball is the selected one (clicked)
        strokeWeight(5); // Thick stroke
        stroke(this.clickedStrokeColor); // Genre color
    } else if (this.iAmHovering) {
        // When this ball is hovered but not clicked (optional hover effect)
        strokeWeight(3);
        stroke(255, 255, 255, 150); // White stroke for hover
    } else {
        // Default state
        strokeWeight(1);
        stroke(255, 250, 240, 50); // Light color with low opacity
    }

    // 3. Draw the Ball
    
    fill(this.tempFill, 0, this.tempFill, customFillAlpha*1.3);
    ellipse(this.x, this.y, sizeAdjusted); // Use this.d for the animated size
    if(this.iAmHovering) {
        fill(this.catColor);
    } else {
        fill(0, 200, this.tempFill, customFillAlpha*1.3);
    }
    if(this.genreFillColor){
    fill(color(this.genreFillColor));
    }
    ellipse(this.x, this.y, sizeAdjusted/2);
    // ... (Your existing drawRotatingLine logic) ...

        // if(objectSelected && selectedIndex === this.objectIndex){
        // stroke(this.clickedStrokeColor);
        // } else {
        //     //non highlighted stroke color
        //     stroke(255, 250, 240, 50);
        // }

        
        
        // ellipse(this.x, this.y, sizeAdjusted);
        
        //rotating vinyl arm effect
        
  this.rotAngle = (this.rotAngle || 0) + 4; // set rotation speed.
   if(this.rotAngle >= 360) this.rotAngle -=360;

   push();
   translate(this.x, this.y);
   rotate(radians(this.rotAngle));
   //draw line from center outward to record edge
   //(radius is half diameter)
   line(sizeAdjusted/6, 0, sizeAdjusted/2, 0);
   pop();

        fill(255, 50);
        
        ellipse(this.x, this.y, sizeAdjusted/3);
        
    }

    drawRotatingLine(rotateSpeed, newSize){};
    
  
}

function keyReleased() {
if(keyCode === 32){
    //console.log(positions.length);
    //console.log(balls);

 }
}


function mousePressed() {
    // Loop through balls to check which one should get the click
  for (let i = 0; i < balls.length; i++) {
    let ball = balls[i];
    let distance = dist(ball.x, ball.y, mouseX, mouseY);
    // Use proportional detection radius (same as rollover):
    if (distance <= ball.d / 2) {
      // Execute click-only logic here:
      objectSelected = true;
      selectedIndex = ball.objectIndex;
      ball.iAmHovering = true;
      // Assign genre color logic:
      let trackSelected = top100Data.tracks[selectedIndex];
      if(trackSelected){
        let genre = trackSelected.category ? trackSelected.category.trim() : '';
        let foundIndex = genresArray.findIndex(g => g.toLowerCase() === genre.toLowerCase());
        if (foundIndex > -1){
          let colorName = colorsArray[foundIndex % colorsArray.length];
          ball.catColor = color(colorName);
        } else {
          ball.catColor = color(random(255), random(255), random(255));
        }
        ball.genreFillColor = ball.catColor;
        ball.clickedStrokeColor = ball.catColor;
      }
      //break; // Only allow one ball to be selected
    }
  }
}


