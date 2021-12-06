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
let cubeYellow;
let cubeRed;
let cubeBlue;

const renderer = createRenderer();
const scene = createScene();
const camera = createCamera();
const controls = createControls(camera, renderer);
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
}

window.addEventListener("resize", () => windowResize(camera, renderer));

function tweenJS(coordinates) {
  function tweenLookAt() {
    // backup original rotation
    let startRotation = camera.quaternion.clone();
    // final rotation (with lookAt)
    if (camera.position.x - coordinates.x > 0) {
      camera.lookAt(
        camera.position.x - 1,
        camera.position.y,
        camera.position.z
      );
    }
    if (camera.position.x - coordinates.x < 0) {
      camera.lookAt(
        camera.position.x + 1,
        camera.position.y,
        camera.position.z
      );
    }
    let endRotation = camera.quaternion.clone();
    // revert to original rotation
    camera.quaternion.copy(startRotation);
    return new TWEEN.Tween(camera.quaternion).to(endRotation, 500);
  }
  let tweenlook = tweenLookAt();

  function tweenMove() {
    return new TWEEN.Tween(camera.position)
      .to(coordinates, 3000)
      .easing(TWEEN.Easing.Quadratic.Out)
      .onUpdate(() => {
        camera.position.set(
          camera.position.x,
          camera.position.y,
          camera.position.z
        );
        if (camera.position.x - coordinates.x > 0) {
          controls.target.set(
            camera.position.x - 1,
            camera.position.y,
            camera.position.z
          );
        }
        if (camera.position.x - coordinates.x < 0) {
          controls.target.set(
            camera.position.x + 1,
            camera.position.y,
            camera.position.z
          );
        }
      });
  }
  let tweenM = tweenMove();

  tweenlook.chain(tweenM);
  tweenlook.start();
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
    const mesh = createPolyhedron();

    gltf.scene.add(cubeGreen, cubeYellow, cubeRed, cubeBlue, mesh);
    objects.push(cubeGreen, cubeYellow, cubeRed, cubeBlue);

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
