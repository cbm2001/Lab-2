function Bear() {
  this.dBear = 100; // dBear is the step (in pixels) made by bear when the user clicks an arrow on the keyboard
  this.htmlElement = document.getElementById("bear");
  this.id = this.htmlElement.id;
  this.x = this.htmlElement.offsetLeft;
  this.y = this.htmlElement.offsetTop;

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
  };
}
function start() {
  //create bear
  bear = new Bear();
  // Add an event listener to the keypress event.
  document.addEventListener("keydown", moveBear, false);
}
// Handle keyboad events
// to move the bear
function moveBear(e) {
  //codes of the four keys
  const KEYUP = 38;
  const KEYDOWN = 40;
  const KEYLEFT = 37;
  const KEYRIGHT = 39;
  if (e.keyCode == KEYRIGHT) {
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

  this.fitBounds = function () {
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
}
