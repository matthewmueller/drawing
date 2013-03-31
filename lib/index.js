/**
 * Module Dependencies
 */

var svg = require('svg'),
    Sketch = require('./sketch');

var draw = svg(document.getElementById('svg'));
var sketch = Sketch(draw);

// point box
var one = document.querySelector('.one');

/*
 * -----------
 * constants
 * -----------
 */

var win = {
  x : window.innerWidth,
  y : window.innerHeight
};

var leap = {
  x : 300,
  y : 420,
  z : 400
};

/*
 * -----------
 * geometric functions
 * -----------
 */

// Change the origin of the pointer to the middle ot the box
function changeOfOrigin(pt) {
  pt.x = pt.x;
  pt.y = pt.y - 180;
  pt.z = pt.z;
};

function rescale(pt) {
  pt.x = (pt.x / leap.x + 1/2) * win.x;
  pt.y = (- pt.y / leap.y + 1/2) * win.y;
}

function isContinuous(pos, pt) {

  if(!pos.length) {
    return true;
  } else {
    var test = ((pos[0].x - pt.x) * (pos[0].x - pt.x)) + ((pos[0].y - pt.y) * (pos[0].y - pt.y));
    console.log(test);

    if(test < 700) {
      return true;
    } else {
      return false;
    }
  }
}

/*
 * -----------
 * potential functions
 * -----------
 */

function progressive (pt) {
  return Math.max(
      Math.min(-(pt.z / 30) , 1),
      0
    );
}

/*
 * -----------
 * drawing functions
 * -----------
 */

function zDraw(pt, px, sensibility) {
  // map to 0, 1
  var z = sensibility(pt);

  if(z === 1 && !drawing) {
    sketch.start(px.x, px.y);
    drawing = true;
  } else if(z === 0) {
    sketch.finish();
    drawing = false;
  } else {
    sketch.draw(px.x, px.y);
  }
}

var drawing = false;

/*
 * -----------
 * global variables
 * -----------
 */

var pos = [];

/*
 * -----------
 * main loop
 * -----------
 */

Leap.loop(function(frame) {
  var fingers = frame.pointables;
  if(!fingers.length) return;
  var finger = fingers.shift();
  
  // create meter point
  var pt = {
    x : finger.tipPosition[0],
    y : finger.tipPosition[1],
    z : finger.tipPosition[2]
  };

  // change of origin
  changeOfOrigin(pt);
 
  // continuity check
  if(!isContinuous(pos, pt)) {
    console.log("failed");
    return;
  }
  if(pos.length > 5) {
    pos.pop();
  }

  pos.unshift(pt);
  
  // create pixel point
  var px = {
    x : pt.x,
    y : pt.y,
    z : pt.z
  };
  rescale(px);

  // draw
  zDraw(pt, px, progressive);

  one.style.top = px.y + 'px';
  one.style.left = px.x + 'px';
});
