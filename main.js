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

let cube1;
let cube2;

const renderer = createRenderer();
const scene = createScene();
const camera = createCamera();
const controls = createControls(camera, renderer);
createLight(scene);

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
    if (intersect.name === "cube1") {
      //green
      createRequest();
      const position = {
        x: camera.position.x,
        y: camera.position.y,
        z: camera.position.z,
      };
      let tween = new TWEEN.Tween(position);
      tween.to({ x: 1600, y: 150, z: 0 }, 5000);
      tween.easing(TWEEN.Easing.Quadratic.Out);
      tween.onUpdate(() => {
        camera.position.set(position.x, position.y, position.z);
        controls.target.set(position.x + 1, position.y, position.z);
        camera.lookAt(position.x + 1, position.y, position.z);
      });
      tween.start();
    }
    if (intersect.name === "cube2") {
      //orange
      const position = {
        x: camera.position.x,
        y: camera.position.y,
        z: camera.position.z,
      };
      let tween = new TWEEN.Tween(position);
      tween.to({ x: -1400, y: 150, z: 0 }, 1000);
      tween.easing(TWEEN.Easing.Quadratic.Out);
      tween.onUpdate(() => {
        camera.position.set(position.x, position.y, position.z + 0.00001);
        controls.target.set(position.x, position.y, position.z);
        if (position.x > -1000) {
          camera.lookAt(position.x - 1, position.y, position.z - 0.00001);
        } else {
          camera.lookAt(position.x, position.y, position.z);
        }
      });
      tween.start();
    }
    if (intersect.name === "arrow1") {
      //arrow
      const position = {
        x: camera.position.x,
        y: camera.position.y,
        z: camera.position.z,
      };
      console.log("position arrow1", position);
      let tween = new TWEEN.Tween(position);
      tween.to({ x: 0, y: 150, z: 0 }, 5000);
      tween.easing(TWEEN.Easing.Quadratic.Out);
      tween.onUpdate(() => {
        if (position.x > 0) {
          camera.position.set(position.x, position.y, position.z);
          controls.target.set(position.x - 1, position.y, position.z);
          // camera.lookAt(position.x - 1, position.y, position.z);
          console.log("1111");
        }
        if (position.x == 0) {
          camera.position.set(position.x, position.y, position.z);
          controls.target.set(position.x - 1, position.y, position.z);
          camera.lookAt(position.x - 1, position.y, position.z);
          console.log("1111");
        }
        // if (position.x < 0) {
        //   camera.position.set(position.x, position.y, position.z);
        //   controls.target.set(1, position.y, position.z);
        //   console.log("2222");
        // }
      });
      tween.start();
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

    cube1 = createCube({
      width: 2,
      height: 1,
      depth: 2,
      color: 0x35591a,
      x: 16,
      y: 0,
      z: 0,
      name: "cube1",
    });
    cube2 = createCube({
      width: 2,
      height: 1,
      depth: 2,
      color: 0xffce3b,
      x: -14,
      y: 0,
      z: 0,
      name: "cube2",
    });
    const mesh = createPolyhedron();

    gltf.scene.add(cube1, cube2, mesh);
    objects.push(cube1, cube2);

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
