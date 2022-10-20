const canvas = document.querySelector('#threebike');
var renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
});
renderer.setPixelRatio(window.devicePixelRatio);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

const controls = new THREE.OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

const scene = new THREE.Scene()
// scene.add(new THREE.AxesHelper(5))

const ambient = new THREE.AmbientLight(0x111111);

// Lights
const spotLight1 = createSpotlight(0xFF7F00);
const spotLight2 = createSpotlight(0x00FF7F);
const spotLight3 = createSpotlight(0x7F00FF);
const spotLight4 = createSpotlight(0x7F00FF);
const spotLight5 = createSpotlight(0xFFFFFF);
let lightHelper1, lightHelper2, lightHelper3, lightHelper4;

// LOADING PAGE
const loadingManager = new THREE.LoadingManager();
const progressBarContainer = document.querySelector('.progress-bar-container');
loadingManager.onLoad = function () {
    progressBarContainer.style.display = 'none';
}

// Button for stop
const stopButton = document.querySelector('.stopButton');
stopButton.style.display = 'none';


// raycaster
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

import bike from '../media/road_bike.glb';
// Load the bike
const loader = new THREE.GLTFLoader(loadingManager)
loader.load(
    bike,
    function (gltf) {
        gltf.scene.scale.set(0.8, 0.8, 0.8);
        gltf.scene.position.y = -0.8;
        scene.add(gltf.scene);
    },
    (xhr) => {
        console.log('ok');
    },
    (error) => {
        console.log(error);
    }
)

function createSpotlight(color) {
    const newObj = new THREE.SpotLight(color, 2);
    newObj.castShadow = true;
    newObj.angle = 0.3;
    newObj.penumbra = 0.2;
    newObj.decay = 2;
    newObj.distance = 50;
    return newObj;
}

// Resize event listener
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}

// Animate function
function animate() {
    requestAnimationFrame(animate)
    // controls.update()
    render()
}

function render() {
    renderer.render(scene, camera)
}

function transpAllExceptThisObj(obj) {

    renderer.domElement.removeEventListener("click", comeBack, false);
    stopButton.style.display = 'block';
    scene.traverse(function (child) {
        if (child instanceof THREE.Mesh) {
            if (child.name == obj.name) {
                let TURN = false;
                console.log(child);
                renderer.setAnimationLoop(function () {
                    child.material.transparent = false;
                    child.material.opacity = 1;
                    var a = { x: child.position.x, y: child.position.y, z: child.position.z };
                    if (!TURN) {
                        var newX = lerp(a.x, zoomIn.x, t);
                        var newY = lerp(a.y, zoomIn.y, t);
                        var newZ = lerp(a.z, zoomIn.z, t);
                        child.position.set(newX, newY, newZ);
                        t += dt;
                        if (newZ >= zoomIn.z) {
                            TURN = true;
                        }
                        // render();
                    } else {
                        // console.log(child.name);
                        child.rotateOnAxis(new THREE.Vector3(0, 1, 0), rotateSpeed);
                        t = 0;
                        render();
                    }
                });
            } else {
                child.material.transparent = true;
                child.material.opacity = 0.05;
                render();
            }
        }
    });
}

function removeTransparency() {
    scene.traverse(function (child) {
        if (child instanceof THREE.Mesh) {
            child.material.transparent = false;
            child.material.opacity = 1;
            render();
        }
    });
    stopButton.style.display = 'none';
}


function comeBack() {
    renderer.domElement.addEventListener('click', onClick, false);
    scene.traverse(function (child) {
        if (child instanceof THREE.Mesh) {
            if (child.rotation.y != 0) {
                renderer.setAnimationLoop(function () {
                    child.rotateOnAxis(new THREE.Vector3(0, 1, 0), rotateSpeed * 2);
                    var a = { x: child.position.x, y: child.position.y, z: child.position.z };
                    var newX = lerp(a.x, zoom0.x, t);
                    var newY = lerp(a.y, zoom0.y, t);
                    var newZ = lerp(a.z, zoom0.z, t);
                    child.position.set(newX, newY, newZ);
                    t += dt;
                    if (newZ <= 0) {
                        child.position.set(0, 0, 0);
                        // console.log(child.rotation);
                        if (Math.abs(child.rotation.x).toFixed(1) == "0.0" && Math.abs(child.rotation.y).toFixed(1) == "0.0") {
                            child.rotateOnAxis(new THREE.Vector3(0, 0, 0), 0);
                            removeTransparency();
                            renderer.setAnimationLoop(null);
                            t = 0;
                            // init_all();
                        }
                    }
                });
            }
        }
    });

}


function onClick() {
    event.preventDefault();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    var intersects = raycaster.intersectObject(scene, true);
    if (intersects.length > 0) {
        transpAllExceptThisObj(intersects[0].object);
    }
    render();
}


// Init renderer, camera, controls, scene
function init_all() {
    renderer.setClearColor(0xffffff, 0);
    renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(renderer.domElement)

    camera.position.z = 2;

    spotLight1.position.set(1, 4, 4);
    spotLight2.position.set(0, 4, 3);
    spotLight3.position.set(-1, 4, 4);
    spotLight4.position.set(0, 4, -4);
    spotLight5.position.set(0, 0, 30);

    lightHelper1 = new THREE.SpotLightHelper(spotLight1);
    lightHelper2 = new THREE.SpotLightHelper(spotLight2);
    lightHelper3 = new THREE.SpotLightHelper(spotLight3);
    lightHelper4 = new THREE.SpotLightHelper(spotLight4);
    lightHelper5 = new THREE.SpotLightHelper(spotLight5);

    scene.add(ambient);
    scene.add(spotLight1, spotLight2, spotLight3, spotLight4, spotLight5);
    // scene.add(lightHelper1, lightHelper2, lightHelper3, lightHelper4, lightHelper5);

    window.addEventListener('resize', onWindowResize, false)
    renderer.domElement.addEventListener('click', onClick, false);
    document.getElementById("PAW").addEventListener("click", comeBack, false);
}

function logTransparency() {
    scene.traverse(function (child) {
        if (child instanceof THREE.Mesh) {
            console.log(child.name);
            console.log(child.material.transparent);
        }
    });
}

init_all();
animate();
