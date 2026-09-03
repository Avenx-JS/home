import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75, 
  window.innerWidth / window.innerHeight, 
  0.1, 
  1000
);
camera.position.set(0, 1, 3);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2.5);
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);

let model = null;

const mouse = { x: 0, y: 0 };
const targetRotation = { x: 0, y: 0 };

window.addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  const maxRotation = 0.3;
  targetRotation.y = mouse.x * maxRotation;
  targetRotation.x = -mouse.y * maxRotation;
});

const loader = new GLTFLoader();
const modelUrl = 'Manex3D-generated-model_3ffde9527ee1_1788423609572.glb';

loader.load(
  modelUrl,
  (gltf) => {
    model = gltf.scene;
    scene.add(model);

    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    model.position.sub(center);
  },
  (xhr) => {
    console.log(`Ladefortschritt: ${(xhr.loaded / xhr.total * 100).toFixed(2)}%`);
  },
  (error) => {
    console.error('Fehler beim Laden des Modells:', error);
  }
);

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

function animate() {
  requestAnimationFrame(animate);

  if (model) {
    model.rotation.y += (targetRotation.y - model.rotation.y) * 0.2;
    model.rotation.x += (targetRotation.x - model.rotation.x) * 0.2;
  }

  renderer.render(scene, camera);
}

animate();
