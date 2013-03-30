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

Leap.loop(function(frame) {
  var fingers = frame.pointables;
  if(!fingers.length) return;
  var finger = fingers.shift();

  var x = finger.tipPosition[0],
      y = finger.tipPosition[1],
      z = finger.tipPosition[2];

  // normalizing leapmotion
  // change of origin and scale to window height and width
  y -= 240;
  x = x / leap.x * win.x;
  y = y / leap.y * win.y;

  // position DOM node
  one.style.top = -y + 'px';
  one.style.left = x + 'px';

})
