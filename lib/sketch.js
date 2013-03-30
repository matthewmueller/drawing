/**
 * Module Dependencies
 */

var offset = require('offset'),
    classes = require('classes'),
    simplify = require('simplify');

/**
 * Expose `Sketch`
 */

module.exports = Sketch

/**
 * Initialize `Sketch`
 *
 * @param {SVG} svg
 * @param {Object} opts
 * @return {Sketch}
 */

function Sketch(svg, opts) {
  if (!(this instanceof Sketch)) return new Sketch(svg, opts);
  opts = opts || {};
  this.el = svg.el;
  this.svg = svg;
  this.classes = classes(this.el);

  // simplify
  // this.simplify = opts.simplify || 2;
};

/**
 * Start drawing
 *
 * @param {Event} e
 * @return {Sketch}
 * @api private
 */

Sketch.prototype.start = function(x, y) {
  this.drawing = true;

  var path = 'M' + x + ',' + y;

  this.path = this.svg.path(path);
  this.points = [{ x : x, y : y }];
  return this;
};

/**
 * Draw
 *
 * @param {Event} e
 * @return {Sketch}
 * @api private
 */

Sketch.prototype.draw = function(x, y) {
  if(!this.drawing) return this;

  var path = 'L' + x + ',' + y;

  this.path.add(path);
  this.points.push({ x : x, y : y });
  return this;
};

/**
 * Finish drawing
 *
 * @param {Event} e
 * @return {Sketch}
 * @api private
 */

Sketch.prototype.finish = function() {
  this.drawing = false;

  if(this.simplify) {
    this.points = simplify(this.points, this.simplify);
    this.path.update(points_to_svg(this.points));
  }

  this.points = [];
};

/**
 * Get offset
 *
 * @param {Event} e
 * @api private
 */

Sketch.prototype.offset = function(e) {
  var pos = offset(this.el),
      x = (e.pageX - pos.left) | 0,
      y = (e.pageY - pos.top) | 0;

  // scrolling
  x -= window.pageXOffset || document.documentElement.scrollLeft;
  y -= window.pageYOffset || document.documentElement.scrollTop;

  return [x, y];
};

/**
 * Points to SVG
 *
 * `points` takes the following form:
 *
 *   [ [x0, y0], [x1, y1], ... ]
 *
 * @param {Array} points
 * @return {String} svg path
 */

function points_to_svg(points) {
  if (!points || points.length <= 1) return '';

  var path = [],
      str = 'M',
      p;

  for (var i = 0, len = points.length; i < len; i++) {
    p = points[i];
    if(!p) continue;
    path[path.length] = str + p.x + ',' + p.y;
    str = 'L';
  };

  return path.join('');
}
