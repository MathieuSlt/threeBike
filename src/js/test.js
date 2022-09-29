var scene, renderer, cam, mesh;

// linear interpolation function
function lerp(a, b, t) { return a + (b - a) * t }

var t = 0, dt = 0.02,                   // t (dt delta for demo)
    a = { x: -2, y: -1, z: -1 },          // start position
    b = { x: 1.5, y: 0.5, z: 0.7 };       // end position

function loop() {
    var newX = lerp(a.x, b.x, ease(t));   // interpolate between a and b where
    var newY = lerp(a.y, b.y, ease(t));   // t is first passed through a easing
    var newZ = lerp(a.z, b.z, ease(t));   // function in this example.
    mesh.position.set(newX, newY, newZ);  // set new position
    t += dt;
    if (t <= 0 || t >= 1) dt = -dt;        // ping-pong for demo
    renderer.render(scene, cam);
    requestAnimationFrame(loop)
}

// example easing function (quadInOut, see link above)
function ease(t) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t }

// setup scene
scene = new THREE.Scene();
renderer = new THREE.WebGLRenderer();
cam = new THREE.PerspectiveCamera(40, innerWidth / innerHeight, 1, 50);
mesh = new THREE.Mesh(new THREE.BoxBufferGeometry(), new THREE.MeshBasicMaterial());
renderer.setPixelRatio(devicePixelRatio);
renderer.setSize(innerWidth, innerHeight);
cam.position.z = 5;
document.body.appendChild(renderer.domElement);
scene.add(mesh);
loop();