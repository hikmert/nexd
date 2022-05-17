import "./style.css";
import * as THREE from "three";

const canvas = document.querySelector("canvas.webgl");
const scene = new THREE.Scene();
const cubeGeometry = new THREE.BoxGeometry(0.95, 2, 0.95);
const cubeGeometry2 = new THREE.BoxGeometry(1.4, 1.4, 1.4);
const loader = new THREE.TextureLoader();

const materialArray = [
  new THREE.MeshBasicMaterial({ map: loader.load("1.jpg") }),
  new THREE.MeshBasicMaterial({ map: loader.load("2.jpg") }),
  new THREE.MeshBasicMaterial({ map: loader.load("3.jpg") }),
  new THREE.MeshBasicMaterial({ map: loader.load("4.jpg") }),
  new THREE.MeshBasicMaterial({ map: loader.load("4.jpg") }),
  new THREE.MeshBasicMaterial({ map: loader.load("4.jpg") }),
];
const materialArray2 = [
  new THREE.MeshBasicMaterial({
    map: loader.load("obj_1.png"),
    transparent: true,
  }),
  new THREE.MeshBasicMaterial({
    map: loader.load("obj_1.png"),
    transparent: true,
  }),
  new THREE.MeshBasicMaterial({
    map: loader.load("obj_3.png"),
    transparent: true,
  }),

  new THREE.MeshBasicMaterial({
    map: loader.load("obj_4.png"),
    transparent: true,
  }),
  new THREE.MeshBasicMaterial({
    map: loader.load("obj_3.png"),
    transparent: true,
  }),
  new THREE.MeshBasicMaterial({
    map: loader.load("obj_3.png"),
    transparent: true,
  }),
];
const cube = new THREE.Mesh(cubeGeometry, materialArray);
const cube2 = new THREE.Mesh(cubeGeometry2, materialArray2);

let mouseClicked = false;
let mouseFirstPosition = 0;
let mouseRotationMultiplier = 5;
let cubeFirstRotationY = 0;
let totalRotation = 0;

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = camera.position.y = 0;
camera.position.z = 3;

scene.add(cube);
scene.add(cube2);
scene.add(camera);

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

document.addEventListener("mousemove", onDocumentMouseMove, false);
document.addEventListener("mousedown", onMouseDown, false);
document.addEventListener("mouseup", onMouseUp, false);
window.addEventListener("resize", onWindowResize, false);

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onMouseDown(event) {
  if (event.button === 0) {
    mouseClicked = true;
    mouseFirstPosition = (event.clientX / window.innerWidth) * 2 - 1;
    cubeFirstRotationY = cube.rotation.y;
  }
}

function onDocumentMouseMove(event) {
  if (mouseClicked) {
    event.preventDefault();
    const currentMousePosition = (event.clientX / window.innerWidth) * 2 - 1;
    totalRotation =
      cubeFirstRotationY +
      (currentMousePosition - mouseFirstPosition) * mouseRotationMultiplier;
    cube.rotation.y = totalRotation;
  }
}

function onMouseUp(event) {
  mouseClicked = false;
}

const getDegrees = (radiant) => {
  return radiant * (180 / Math.PI);
};

const tick = () => {
  const slerpMultiplier = 5;
  cube2.quaternion.slerp(
    new THREE.Quaternion().setFromAxisAngle(
      new THREE.Vector3(0, 1, 0),
      totalRotation
    ),
    slerpMultiplier * clock.getDelta()
  );
  getCube1AlignedOnTheMove();

  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};
const clock = new THREE.Clock();

tick();
function getCube1AlignedOnTheMove() {
  const alignMultiplier = 1.5;
  if (!mouseClicked) {
    let diff = getDegrees(totalRotation) % 90;
    if (diff > 1) {
      if (diff < 45) {
        totalRotation -=diff *diff * alignMultiplier * clock.getDelta();
        cube.rotation.y = totalRotation;
      } else {
        totalRotation +=
          (90 - diff) * (90 - diff) * alignMultiplier * clock.getDelta();
        cube.rotation.y = totalRotation;
      }
    } else if (diff < -1) {
      if (diff < -45) {
        totalRotation -=
          (90 + diff) * (90 + diff) * alignMultiplier * clock.getDelta();
        cube.rotation.y = totalRotation;
      } else {
        totalRotation += diff * diff * alignMultiplier * clock.getDelta();
        cube.rotation.y = totalRotation;
      }
    }
  }
}
