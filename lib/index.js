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



var win = {
  x : window.innerWidth,
  y : window.innerHeight
};

var leap = {
  x : 300,
  y : 420,
  z : 400
};

var drawing = false;

Leap.loop(function(frame) {
  var fingers = frame.pointables;
  if(!fingers.length) return;
  var finger = fingers.shift();

  var x = finger.tipPosition[0],
      y = finger.tipPosition[1],
      z = finger.tipPosition[2];

  // normalizing leapmotion
  // change of origin and scale to window height and width
  y -= 180;
  x = x / leap.x * win.x;
  y = y / leap.y * win.y;

  // map to 0, 1
  z = Math.min(-(z / 60), 1);
  if (z < 0) z = 0;


  x += win.x / 2;
  y = -y;
  y += (win.y / 2);

  if(z === 1 && !drawing) {
    sketch.start(x, y);
    drawing = true;
  } else if(z === 0) {
    sketch.finish();
    drawing = false;
  } else {
    sketch.draw(x, y);
  }

  one.style.top = (y + 40) + 'px';
  one.style.left = x + 'px';


  // // position DOM node
  // one.style.top = -y + 'px';
  // one.style.left = x + 'px';

});
