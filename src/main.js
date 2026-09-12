import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { toRadians, map, lerp, random } from "./utils.js";
import { Pane } from "tweakpane";

const myCanvas = document.querySelector(".webgl");
const pane = new Pane({
  title: "Params",
});

const PARAMS = {
  aspectRatio: 3 / 4,
};

const resolutions = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const sizes = {
  width: resolutions.height * PARAMS.aspectRatio,
  height: resolutions.height,
};

//Scene
const scene = new THREE.Scene();

//Object
const cube = new THREE.Mesh(
  new THREE.BoxGeometry(),
  new THREE.MeshBasicMaterial({
    color: "#ff0000",
  }),
);

scene.add(cube);

//Camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  1000,
);
camera.position.z = 3;

//Render
const renderer = new THREE.WebGLRenderer({
  canvas: myCanvas,
  antialias: true,
});
renderer.setSize(sizes.width, sizes.height);

const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

//Animate
const tick = () => {
  controls.update();

  renderer.render(scene, camera);
  requestAnimationFrame(tick);
};

//Resize
const resize = () => {
  resolutions.width = window.innerWidth;
  resolutions.height = window.innerHeight;
  sizes.width = resolutions.height * PARAMS.aspectRatio;
  sizes.height = resolutions.height;
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
};

pane
  .addBinding(PARAMS, "aspectRatio", {
    options: {
      "1:1": 1 / 1,
      "3:4": 3 / 4,
      "4:3": 4 / 3,
      "3:5": 3 / 5,
      "4:5": 4 / 5,
      "9:16": 9 / 16,
    },
    label: "ratio",
  })
  .on("change", resize);

window.addEventListener("resize", resize);

tick();
