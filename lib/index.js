/**
 * Module Dependencies
 */

var svg = require('svg'),
    Sketch = require('./sketch');


var draw = svg(document.getElementById('svg'));
var sketch = Sketch(draw);

// var rect = draw.rect(100, 50)
// console.log(rect.el);
var one = document.querySelector('.one');

// constants
var win = {
  x : window.innerWidth,
  y : window.innerHeight
};

var leap = {
  x : 300,
  y : 420,
  z : 400
};

// Change the origin of the pointer to the middle ot the box

function changeOfOrigin(pt) {
  pt.x = pt.x;
  pt.y = pt.y - 180;
  pt.z = pt.z;
};

function rescale(pt) {
  pt.x = (pt.x / leap.x + 1/2) * win.x;
  pt.y = -(pt.y / leap.y + 1/2) * win.y;
}

function progressive (pt) {
  return 
    Math.max(
      Math.min(-pt.z / 30 , 1),
      0
    );
}

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

Leap.loop(function(frame) {
  var fingers = frame.pointables;
  if(!fingers.length) return;
  var finger = fingers.shift();

  console.log("test");

  // create meter point
  var pt = {
    x = finger.tipPosition[0],
    y = finger.tipPosition[1],
    z = finger.tipPosition[2]
  };
  // change of origin
  changeOfOrigin(p);
  
  // create pixel point
  var px = {
    x : pt.x,
    y : pt.y,
    z : pt.z
  }
  rescale(px);

  // draw
  zDraw(p, px, progressive);

  one.style.top = (y + 40) + 'px';
  one.style.left = x + 'px';
});
