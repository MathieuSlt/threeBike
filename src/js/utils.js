// linear interpolation function
function lerp(a, b, t) { return a + (b - a) * t }

// t (dt delta for demo)
var t = 0, dt = 0.02;
// end position
var zoomIn = { x: 0, y: 0, z: 10 };
var zoomOut = { x: 0, y: 0, z: -5 };
var zoom0 = { x: 0, y: 0, z: 0 };

var rotateSpeed = 0.01;


// example easing function (quadInOut, see link above)
function ease(t) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t }