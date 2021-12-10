import * as THREE from "https://threejsfundamentals.org/threejs/resources/threejs/r132/build/three.module.js";
import createRenderer from "./createRenderer.js";
import createScene from "./createScene.js";
import createCamera from "./createCamera.js";
import createLight from "./createLight.js";
import createRequest from "./createRequest.js";
import createControls from "./createControls.js";
import windowResize from "./windowResize.js";
import gltfLoader from "./gltfLoader.js";
import resizeRendererToDisplaySize from "./resizeRendererToDisplaySize.js";
import Stats from "./stats.module.js";

let cameraPositionCopy;
let max;
let stats;

stats = new Stats();
document.body.appendChild(stats.dom);

const renderer = createRenderer();
const scene = createScene();
const camera = createCamera();
const controls = createControls(camera, renderer);
const objects = gltfLoader(scene, controls);
createLight(scene);

const axesHelper = new THREE.AxesHelper(500);
scene.add(axesHelper);

render();

function render(time) {
  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }
  renderer.render(scene, camera);
  TWEEN.update(time);
  requestAnimationFrame(render);
  stats.update();
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
    return new TWEEN.Tween(camera.quaternion)
      .easing(TWEEN.Easing.Quartic.Out)
      .to(endRotation, max);
  }

  let tweenLook = tweenLookAt();

  function tweenMove() {
    let timeMoving = max;
    return new TWEEN.Tween(camera.position)
      .to(coordinates, timeMoving)
      .easing(TWEEN.Easing.Linear.None)
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

function changeVisible(name, boolean) {
  console.log("scene.children ---", scene.children);
  scene.children.map((child) => {
    if (child.name === name) {
      child.visible = boolean;
      child.children.map((child) => {
        child.visible = boolean;
      });
    }
  });
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
      changeVisible("ARR", true);
    }
    if (intersect.name === "cubeYellow") {
      tweenJS({ x: -1400, y: 150, z: 0 });
      changeVisible("ARR", false);
    }
    if (intersect.name === "arrow1" && intersect.visible === true) {
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
    if (intersect.name === "cylinder") {
      tweenJS({ x: -2800, y: 150, z: -300 });
      changeVisible("ARR", false);
    }
  }
  render();
}
