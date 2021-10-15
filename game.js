function Bear() {
  this.dBear = 100; // dBear is the step (in pixels) made by bear when the user clicks an arrow on the keyboard
  this.htmlElement = document.getElementById("bear"); //any html element
  this.id = this.htmlElement.id; // ??
  this.x = this.htmlElement.offsetLeft; // returns the number of pixels that the upper left corner of the current element is offset to the left
  this.y = this.htmlElement.offsetTop; // returns the distance of the outer border of the current element relative to the inner border of the top

  this.move = function (xDir, yDir) {
    //move() to move the bear by dx and dy steps in the horizontal and vertical directions.
    this.fitBounds(); // we add this instruction here to keep the bear within the board limits.
    this.x += this.dBear * xDir;
    this.y += this.dBear * yDir;
    this.display();
  };

  this.display = function () {
    //displays the bear at new position.
    this.htmlElement.style.left = this.x + "px";
    this.htmlElement.style.top = this.y + "px";
    this.htmlElement.style.display = "block";
  
    this.dBear = function setSpeed(){
        this.dBear = document.getElementById("speedBees");
    }
  }
  function start() {
    //create a global variable bear
    bear = new Bear();
    // Add an event listener to the keypress event to activate the moveBear(e) function.
    document.addEventListener("keydown", moveBear, false);
    <select onchange = "setSpeed()"></select>
    //create new array for bees.
    bees = new Array();
    // create bees
    makeBees();
    updateBees();
    // take start time
    lastStingTime = new Date();
  }
  // Handle keyboard events to move the bear
  function moveBear(e) {
    //defines the function to move the bear.
    //codes of the four keys
    const KEYUP = 38;
    const KEYDOWN = 40;
    const KEYLEFT = 37;
    const KEYRIGHT = 39;
    if (e.keyCode == KEYRIGHT) {
      //represents implementation dependent numerical code identifying the value of the pressed key.
      bear.move(1, 0);
    } // right key
    if (e.keyCode == KEYLEFT) {
      bear.move(-1, 0);
    } // left key
    if (e.keyCode == KEYUP) {
      bear.move(0, -1);
    } // up key
    if (e.keyCode == KEYDOWN) {
      bear.move(0, 1);
    } // down key
  }

  this.fitBounds = function () {
    //this function is implemented to keep the bear moving within the board limits.
    let parent = this.htmlElement.parentElement; //??
    let iw = this.htmlElement.offsetWidth;
    let ih = this.htmlElement.offsetHeight;
    let l = parent.offsetLeft;
    let t = parent.offsetTop;
    let w = parent.offsetWidth;
    let h = parent.offsetHeight;
    if (this.x < 0) this.x = 0;
    if (this.x > w - iw) this.x = w - iw;
    if (this.y < 0) this.y = 0;
    if (this.y > h - ih) this.y = h - ih;
  }

}

class Bee {
  constructor(beeNumber) {
    // the HTML  element corressponding to the IMG of the bee.
    this.htmlElement = createBeeImg(beeNumber);
    this.id = this.htmlElement.id; // the html id
    this.x = this.htmlElement.offsetLeft; //the left position (x)
    this.y = this.htmlElement.offsetTop; // the top

    this.move = function (dx, dy) {
      // move the bee by dx and dy steps.
      this.x += dx;
      this.y += dy;
    };
    this.display = function () {
      //adjust position of bee and display it
      this.fitBounds(); //add this to adjust to bounds
      this.htmlElement.style.left = this.x + "px";
      this.htmlElement.style.top = this.y + "px";
      this.htmlElement.style.display = "block";
    };
    this.fitBounds = function () {
      //check and make sure the bees stays in the board space
      let parent = this.htmlElement.parentElement;
      let iw = this.htmlElement.offsetWidth;
      let ih = this.htmlElement.offsetHeight;
      let l = parent.offsetLeft;
      let t = parent.offsetTop;
      let w = parent.offsetWidth;
      let h = parent.offsetHeight;
      if (this.x < 0) this.x = 0;
      if (this.x > w - iw) this.x = w - iw;
      if (this.y < 0) this.y = 0;
      if (this.y > h - ih) this.y = h - ih;
    };
    function createBeeImg(wNum) {
      //get dimension and position of board div
      let boardDiv = document.getElementById("board");
      let boardDivW = boardDiv.offsetWidth;
      let boardDivH = boardDiv.offsetHeight;
      let boardDivX = boardDiv.offsetLeft;
      let boardDivY = boardDiv.offsetTop;
      //create the IMG element
      let img = document.createElement("img");
      img.setAttribute("src", "images/bee.gif");
      img.setAttribute("width", "100");
      img.setAttribute("alt", "A bee!");
      img.setAttribute("id", "bee" + wNum);
      img.setAttribute("class", "bee"); //set class of html tag img
      //add the IMG element to the DOM as a child of the board div
      img.style.position = "absolute";
      boardDiv.appendChild(img);
      //set initial position
      let x = getRandomInt(boardDivW);
      let y = getRandomInt(boardDivH);
      img.style.left = boardDivX + x + "px";
      img.style.top = y + "px";
      //return the img object
      return img;
    }

    function makeBees(){
      // get number of bees specified by the user.
      let nbees = document.getElementById("nbBees").value;
      nbBees = Number(nbBees); //try converting the content of the input to a number.
      if (isNaN(nbBees)){
        window.alert("invalid number of bees");
        return;
      }
    
      // create bees
      let i = 1;
      while (i <= nbBees){
        var num = i;
        var bee = new Bee(num); //create object and its IMG element.
        bee.display(); //display the bee.
        bees.push(bee); // add the bee object to the bees array.
        i++;
      }

    }

    function moveBees(){
      // get speed input field value
      let speed = document.getElementById("speedBees").value;
      // move each bee to a random location.
      for (let i = 0; i <bees.length; i++){
        let dx = getRandomInt(2* speed) - speed;
        let dy = getRandomInt(2* speed) - speed;
        bees[i].move(dx,dy);
        isHit(bees[i],bear); // we add this to count stings.
      }
    }

    function updateBees(){
      // update loop for game.
      // move the bees randomly
      moveBees();
      // use a fixed update period
      let period = document.getElementById("periodTimer");
      if (score <= 1000){
        updateTimer = setTimeout('updateBees()',period);
      }else{
        clearTimeout(updateTimer);
        alert("Game Over!")
      }
    }

    function isHit(defender,offender){
      if (overlap(defender,offender)) {  // check if the two images overlap
        let score = hits.innerHTML;
        score = Number(score) + 1; // increment the score.
        hits.innerHTML = score; //display the new score.
        //calculate longest duration
        let newStingtTime = new Date();
        let thisDuration = newStingTime - lastStingTime;
        if (keyCode == KEYDOWN){
          lastStingTime = newStingtTime;
        } 
        let longestDuration = Number(duration.innerHTML);
        if (longestDuration === 0){
          longestDuration = thisDuration;
        } else{
          if(longestDuration < thisDuration) longestDuration = thisDuration;
        }
        document.getElementById("duration").innerHTML = longestDuration;
      }
    }

    function overlap(element1,element2){
      // consider the two rectangles wrapping the two elements
      // rectangle of the first element.
      left1 = element1.htmlElement.offsetLeft;  // htmlElement represents the element 'element1'
      top1 = element1.htmlElement.offsetTop;
      right1 = element1.htmlElement.offsetRight;
      bottom1= element1.htmlElement.offsetHeight;

      //rectangle of the second element.
      left2 = element2.htmlElement.offsetLeft;
      right2 = element2.htmlElement.offsetRight;
      top2 = element2.htmlElement.offsetTop;
      bottom2 = element2.htmlElement.offsetHeight;

      //calculate the intersection of the two rectangles
      x_intersect = Math.max(0,Math.min(right1, right2)-Math.max(left1,left2));
      y_intersect = Math.max(0, Math.min(bottom1,bottom2)-Math.max(top1,top2));
      intersectArea = x_intersect * y_intersect;
      // if intersection is nil no hit
      if (intersectArea == 0 || isNaN(intersectArea)) {
        return false;
      }
      return true;
    }


  }
}
