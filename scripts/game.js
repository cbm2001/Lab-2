var bear; //creating a global variable Bear to instantiate the Bear object in the Javascript file
var bees; // creating a global variable bee to add the number of bees specified by the user.
var Timer;
var lastStingTime;

function Bear(){
    this.dBear = setSpeed(); // gets the speed of the bear.
    this.htmlElement = $('#bear');
    this.id = this.htmlElement.attr('id'); // transferring that to element 'id'
    this.x = this.htmlElement.offset().left;
    this.y = this.htmlElement.offset().top;

    this.move = function(xDir,yDir){
        this.fitBounds(); // to keep the bear within the board.
        this.x += this.dBear * xDir;
        this.y += this.dBear * yDir;
        this.display();
    };

    this.display = function(){ //
        this.htmlElement.css("left", this.x + "px"); // .css(property,value)
        this.htmlElement.css("top", this.y + "px")
        this.htmlElement.css("display","block");
    };

    this.fitBounds = function(){
        let parent = this.htmlElement.parent();
        let iw = this.htmlElement.outerWidth();
        let ih = this.htmlElement.outerHeight();
        let l = parent.offset().left;
        let t = parent.offset().top;
        let w = parent.outerWidth();
        let h = parent.outerHeight();
        if (this.x < 0) {
            this.x = 0;
        }
        if (this.x > w - iw){
            this.x = w-iw;
        } 
        if(this.y < 0){
            this.y =0;
        }
        if (this.y>h-ih){
            this.y = h-ih;
        } 
    }; 
}


//to handle keyboard events 
//to move the bear
function moveBear(e){
    // codes of the four keys
    const KEYUP = 38;
    const KEYDOWN = 40;
    const KEYLEFT = 37;
    const KEYRIGHT = 39;

    if (e.keyCode == KEYRIGHT){ // right key
        bear.move(1,0);
    }
    if (e.keyCode == KEYLEFT){ // left key
        bear.move(-1,0);
    }
    if (e.keyCode == KEYUP){ // up key
        bear.move(0,-1);
    }
    if (e.keyCode == KEYDOWN){ //down key
        bear.move(0,1);
    }
}

function setSpeed(){
    return $('#speedbear').val();
}

class Bee{
    constructor(beeNumber){
        // the HTML element corresponding to the IMG of the bee
        this.htmlElement = createBeeImg(beeNumber);
        // its the HTML ID
        this.id = this.htmlElement.attr('id');
        // the left position (x)
        this.x = this.htmlElement.offset().left;
        // the top position (y)
        this.y = this.htmlElement.offset().top;

        this.move = function(dx,dy){
            // move the bees by dx,dy
            this.x += dx;
            this.y += dy;
            this.display();
        };

        this.display = function(){
            // adjust position of bee and display it
            this.fitBounds(); // add this to adjust to bounds
            this.htmlElement.css("left", this.x + "px");
            this.htmlElement.css("top", this.y + "px");
            this.htmlElement.css("display","block");
        };

        this.fitBounds = function(){
            // check and make sure the bees stay in the board space
            let parent = this.htmlElement.parent();
            let iw = this.htmlElement.outerWidth();
            let ih = this.htmlElement.outerHeight();
            let l = parent.offset().left;
            let t = parent.offset().top;
            let w = parent.outerWidth();
            let h = parent.outerHeight();
            if (this.x <0){
                this.x = 0;
            }
            if (this.x > w - iw){
                this.x = w-iw;
            }
            if (this.y <0){
                this.y = 0;
            }
            if (this.y > h-ih){
                this.y = h-ih;
            }
        };
    }
}

function createBeeImg(wNum){
    // get dimension and position of board div
    let boardDiv = $('#board');
    let boardDivH = boardDiv.outerHeight();
    let boardDivW = boardDiv.outerWidth();
    let boardDivX = boardDiv.offset().left;
    let boardDivY = boardDiv.offset().top;
    
    
    // create IMG element
    boardDiv.prepend('<img id="bee" alt = " A bee!" src="images/bee.gif" width="100" class="bee" />');
    let img = $('#bee');
    img.css("position","absolute");
    //set initial position
    let x = getRandomInt(boardDivW);
    let y = getRandomInt(boardDivH);
    img.css("left",boardDivX + x + "px");
    img.css("top",y + "px");
    // return the img object
    return img;
}

function getRandomInt(max){
    return Math.floor(Math.random() * max);
}

function makeBees(){
    // get number of bees specified by the user
    let nbBees = $('#nbBees').val();
    nbBees = Number(nbBees); // converting the content of the input to a number;
    if (isNaN(nbBees)){ //checking if the input field contains a valid number.
        window.alert("Invalid number of bees");
        return;
    }

    // create bees
    let i = 1;
    while (i <= nbBees){
        var num = i;
        var bee = new Bee(num); // create object and its IMG element
        bee.display(); // display the bee
        bees.push(bee); // add the bee object to the bees array
        i++;
    }
}

function addBee(){
    let nbBees = $('#nbBees').val();
    nbBees = Number(nbBees)+1;
    var bee = new Bee(bees.length + 1);
    bee.display(); // display the bee
    bees.push(bee); // add the bee object to the bees array
    $("#nbBees").html(nbBees);
}

function moveBees(){
    // get speed input field value
    let speed = $('#speedBees').val();
    //move each bee to a random location
    for (let i = 0; i < bees.length; i++){
        let dx = getRandomInt(2 * speed) - speed;
        let dy = getRandomInt(2 * speed) - speed;
        bees[i].move(dx,dy);
        isHit(bees[i],bear); // add this to count the stings.
    }
}

function updateBees(){ // update loop for game
    // move the bees randomly
    moveBees();
    // use a fixed update period
    let period = $('#periodTimer').val();
    // update the timer for the next move
    function updateTimer() {
        var score = $('#hits').html();
        if (score >= 1000) {
          clearTimeout(Timer);
          alert("Game Over!");
        } else {
            Timer = setTimeout(function () {updateBees();}, period);
        }
    }
    updateTimer(); 
}

function isHit(defender, offender) {
    if (overlap(defender, offender)) {
        //check if the two image overlap
        let score = $('#hits').html();
        score = Number(score) + 1; //increment the score
        $("#hits").html(score); // 
        //calculate longest duration
        let newStingTime = new Date();
        let thisDuration = newStingTime - lastStingTime;
        lastStingTime = newStingTime;
        let longestDuration = Number($('#duration').html());
        if (longestDuration === 0) {
            longestDuration = thisDuration;
        } else {
            if (longestDuration < thisDuration) {
                longestDuration = thisDuration;
            }
        }
        $('#duration').html(longestDuration); 
    }
}
  
function overlap(element1, element2) {
    left1 = element1.htmlElement.offset().left;
    top1= element1.htmlElement.offset().top;
    right1 = element1.htmlElement.offset().left + element1.htmlElement.outerWidth();
    bottom1 = element1.htmlElement.offset().top + element1.htmlElement.outerHeight();
    
    //rectangle of the second element
    left2 = element2.htmlElement.offset().left;
    top2 = element2.htmlElement.offset().top;
    right2 = element2.htmlElement.offset().left + element2.htmlElement.outerWidth();
    bottom2 = element2.htmlElement.offset().top + element2.htmlElement.outerHeight();
    
    //calculate the intersection of the two rectangles
    x_intersect = Math.max(0, Math.min(right1, right2) - Math.max(left1, left2));
    y_intersect = Math.max(0, Math.min(bottom1, bottom2) - Math.max(top1, top2));
    intersectArea = x_intersect * y_intersect;
    //if intersection is nil no hit
    if (intersectArea == 0 || isNaN(intersectArea)) {
        return false;
    }
    return true;
}


function start(){
    // create bear
    bear = new Bear();
    // add an event listener to the keypress event
    $(document).keydown(function (event){
        moveBear(event)
    });
    lastStingTime = new Date();
    // to change the speed of the bee
    $('#speedbear').change(function() {
        setSpeed();
    });
    // create new array for bees
    bees = new Array();
    // create bees
    makeBees();
    // move the bees continuously
}

function restart(){
    let j = 0;
    while (j != $('#nbBees').val() + 1){
        $('#bee').remove();
        j++;
    }
    bees=[]
    $('#hits').html(0);
    $('#duration').html(0);
    updateBees();
    start();
}

$(document).ready(function() {
    start();
});
