import * as THREE from "https://threejsfundamentals.org/threejs/resources/threejs/r132/build/three.module.js";
import { GLTFLoader } from "https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/loaders/GLTFLoader.js";
import createRenderer from "./createRenderer.js";
import createScene from "./createScene.js";
import createCamera from "./createCamera.js";
import createCube from "./createCube.js";
import createPolyhedron from "./createPolyhedron.js";
import createLight from "./createLight.js";
import createRequest from "./createRequest.js";
import createControls from "./createControls.js";
import windowResize from "./windowResize.js";
import resizeRendererToDisplaySize from "./resizeRendererToDisplaySize.js";

const objects = [];

let cubeGreen;
let cubeLightGreen;
let cubeYellow;
let cubeRed;
let cubeBlue;
let cubeDarkMagenta;
let cameraPositionCopy;
let max;
let parameters;
const materials = [];

const renderer = createRenderer();
const scene = createScene();
const camera = createCamera();
const controls = createControls(camera, renderer);
createLight(scene);

const axesHelper = new THREE.AxesHelper(500);
scene.add(axesHelper);

const geometry = new THREE.BufferGeometry();
const vertices = [];
const textureLoader = new THREE.TextureLoader();
const sprite1 = textureLoader.load("sprites/snowflake1.png");
const sprite2 = textureLoader.load("sprites/snowflake2.png");
const sprite3 = textureLoader.load("sprites/snowflake3.png");
const sprite4 = textureLoader.load("sprites/snowflake4.png");
const sprite5 = textureLoader.load("sprites/snowflake5.png");
for (let i = 0; i < 50000; i++) {
  const x = Math.random() * 5000 - 1000;
  const y = Math.random() * 5000 - 1000;
  const z = Math.random() * 5000 - 1000;
  vertices.push(x, y, z);
}
geometry.setAttribute(
  "position",
  new THREE.Float32BufferAttribute(vertices, 3)
);
console.log("====================================");
console.log(geometry);
console.log("====================================");
parameters = [
  [[1.0, 0.2, 0.5], sprite2, 20],
  [[0.95, 0.1, 0.5], sprite3, 15],
  [[0.9, 0.05, 0.5], sprite1, 10],
  [[0.85, 0, 0.5], sprite5, 8],
  [[0.8, 0, 0.5], sprite4, 5],
];
for (let i = 0; i < parameters.length; i++) {
  const color = parameters[i][0];
  const sprite = parameters[i][1];
  const size = parameters[i][2];
  materials[i] = new THREE.PointsMaterial({
    size: size,
    map: sprite,
    blending: THREE.AdditiveBlending,
    depthTest: false,
    transparent: true,
  });
  materials[i].color.setHSL(color[0], color[1], color[2]);
  const particles = new THREE.Points(geometry, materials[i]);
  particles.rotation.x = Math.random() * 6;
  particles.rotation.y = Math.random() * 6;
  particles.rotation.z = Math.random() * 6;
  scene.add(particles);
}

render();

function render(time) {
  const timeForSnow = Date.now() * 0.00005;

  for (let i = 0; i < scene.children.length; i++) {
    const object = scene.children[i];
    if (object instanceof THREE.Points) {
      object.rotation.y = timeForSnow * (i < 4 ? i + 1 : -(i + 1));
    }
  }
  for (let i = 0; i < materials.length; i++) {
    const color = parameters[i][0];
    const h = ((360 * (color[0] + timeForSnow)) % 360) / 360;
    materials[i].color.setHSL(h, color[1], color[2]);
  }
  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }
  renderer.render(scene, camera);
  TWEEN.update(time);
  requestAnimationFrame(render);
}

window.addEventListener("resize", () => windowResize(camera, renderer));

function tweenJS(coordinates) {
  cameraPositionCopy = camera.position.clone();
  let positionX = Math.abs(cameraPositionCopy.x - coordinates.x);
  let positionY = Math.abs(cameraPositionCopy.y - coordinates.y);
  let positionZ = Math.abs(cameraPositionCopy.z - coordinates.z);
  max = Math.max(positionX, positionY, positionZ);

  function tweenLookAt() {
    // backup original rotation
    let startRotation = camera.quaternion.clone();
    // final rotation (with lookAt)
    if (max === positionX) {
      if (coordinates.x > cameraPositionCopy.x) {
        camera.lookAt(
          camera.position.x + 1,
          camera.position.y,
          camera.position.z
        );
      }
      if (coordinates.x < cameraPositionCopy.x) {
        camera.lookAt(
          camera.position.x - 1,
          camera.position.y,
          camera.position.z
        );
      }
    }
    if (max === positionZ) {
      if (coordinates.z > cameraPositionCopy.z) {
        camera.lookAt(
          camera.position.x,
          camera.position.y,
          camera.position.z + 1
        );
      }
      if (coordinates.z < cameraPositionCopy.z) {
        camera.lookAt(
          camera.position.x,
          camera.position.y,
          camera.position.z - 1
        );
      }
    }

    let endRotation = camera.quaternion.clone();
    // revert to original rotation
    camera.quaternion.copy(startRotation);
    return new TWEEN.Tween(camera.quaternion).to(endRotation, 500);
  }

  let tweenLook = tweenLookAt();

  function tweenMove() {
    let timeMoving = max;
    return new TWEEN.Tween(camera.position)
      .to(coordinates, timeMoving)
      .easing(TWEEN.Easing.Quadratic.Out)
      .onComplete((obj) => {
        camera.position.set(obj.x, obj.y, obj.z);
        if (max === positionX) {
          if (coordinates.x > cameraPositionCopy.x) {
            controls.target.set(
              camera.position.x + 1,
              camera.position.y,
              camera.position.z
            );
          }
          if (coordinates.x < cameraPositionCopy.x) {
            controls.target.set(
              camera.position.x - 1,
              camera.position.y,
              camera.position.z
            );
          }
        }
        if (max === positionZ) {
          if (coordinates.z > cameraPositionCopy.z) {
            controls.target.set(
              camera.position.x,
              camera.position.y,
              camera.position.z + 1
            );
          }
          if (coordinates.z < cameraPositionCopy.z) {
            controls.target.set(
              camera.position.x,
              camera.position.y,
              camera.position.z - 1
            );
          }
        }
      });
  }

  let tweenM = tweenMove();

  // tweenLook.chain(tweenM);
  // tweenLook.start();
  tweenLook.start();
  tweenM.start();
}

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
window.addEventListener("dblclick", onPointerDown, false);
function onPointerDown(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(objects, false);
  console.log("intersects", intersects);
  if (intersects.length > 0) {
    const intersect = intersects[0].object;
    if (intersect.name === "cubeGreen") {
      createRequest();
      tweenJS({ x: 1600, y: 150, z: 0 });
    }
    if (intersect.name === "cubeYellow") {
      tweenJS({ x: -1400, y: 150, z: 0 });
    }
    if (intersect.name === "arrow1") {
      tweenJS({ x: 0, y: 150, z: 0 });
    }
    if (intersect.name === "cubeRed") {
      tweenJS({ x: -1400, y: 150, z: -1000 });
    }
    if (intersect.name === "cubeBlue") {
      tweenJS({ x: -1400, y: 150, z: 1000 });
    }
    if (intersect.name === "cubeDarkGreen") {
      tweenJS({ x: -5500, y: 150, z: 200 });
    }
    if (intersect.name === "cubeDarkMagenta") {
      tweenJS({ x: -1400, y: 150, z: 2000 });
    }
    controls.update();
  }
  render();
}
{
  const gltfLoader = new GLTFLoader();
  gltfLoader.load("./untitled.gltf", (gltf) => {
    gltf.scene.scale.multiplyScalar(100);
    gltf.scene.position.x = 0;
    gltf.scene.position.y = 0;
    gltf.scene.position.z = 0;
    scene.add(gltf.scene);

    cubeGreen = createCube({
      width: 2,
      height: 1,
      depth: 2,
      color: 0x35591a,
      x: 16,
      y: 0,
      z: 0,
      name: "cubeGreen",
    });
    cubeYellow = createCube({
      width: 2,
      height: 1,
      depth: 2,
      color: 0xffce3b,
      x: -14,
      y: 0,
      z: 0,
      name: "cubeYellow",
    });
    cubeRed = createCube({
      width: 2,
      height: 1,
      depth: 2,
      color: 0xff1100,
      x: -14,
      y: 0,
      z: -10,
      name: "cubeRed",
    });
    cubeBlue = createCube({
      width: 2,
      height: 1,
      depth: 2,
      color: 0x1b2ba5,
      x: -14,
      y: 0,
      z: 10,
      name: "cubeBlue",
    });
    cubeLightGreen = createCube({
      width: 2,
      height: 1,
      depth: 2,
      color: 0x93c47d,
      x: -55,
      y: 0,
      z: 2,
      name: "cubeDarkGreen",
    });
    cubeDarkMagenta = createCube({
      width: 2,
      height: 1,
      depth: 2,
      color: 0x741b47,
      x: -14,
      y: 0,
      z: 20,
      name: "cubeDarkMagenta",
    });
    const mesh = createPolyhedron();

    gltf.scene.add(
      cubeGreen,
      cubeYellow,
      cubeRed,
      cubeBlue,
      cubeLightGreen,
      cubeDarkMagenta,
      mesh
    );
    objects.push(
      cubeGreen,
      cubeYellow,
      cubeRed,
      cubeBlue,
      cubeLightGreen,
      cubeDarkMagenta
    );

    controls.update();
  });
}
{
  const gltfLoader = new GLTFLoader();
  gltfLoader.load("./arrow.gltf", (gltf) => {
    gltf.scene.scale.multiplyScalar(100);
    gltf.scene.position.x = 0;
    gltf.scene.position.y = 0;
    gltf.scene.position.z = 0;
    scene.add(gltf.scene);

    gltf.scene.children[2].name = "arrow1";
    objects.push(gltf.scene.children[2]);
    controls.update();
  });
}
