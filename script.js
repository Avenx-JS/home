import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const heroVisual = document.getElementById('hero-visual');
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
camera.position.set(0, 0.5, 4.2);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x000000, 0);

if (heroVisual) {
  heroVisual.appendChild(renderer.domElement);
}

const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2.2);
directionalLight.position.set(4, 6, 5);
scene.add(directionalLight);

let model = null;

const mouse = { x: 0, y: 0 };
const targetRotation = { x: 0, y: 0 };

function updateRendererSize() {
  if (!heroVisual) return;

  const { width, height } = heroVisual.getBoundingClientRect();
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

window.addEventListener('mousemove', (event) => {
  const rect = heroVisual ? heroVisual.getBoundingClientRect() : { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight };
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);

  const maxRotation = 0.45;
  targetRotation.y = mouse.x * maxRotation;
  targetRotation.x = -mouse.y * maxRotation;
});

const loader = new GLTFLoader();
const modelUrl = 'Manex3D-generated-model_3ffde9527ee1_1788423609572.glb';

loader.load(
  modelUrl,
  (gltf) => {
    model = gltf.scene;
    model.scale.setScalar(1.2);
    model.position.set(0, -0.4, 0);
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

window.addEventListener('resize', updateRendererSize);
updateRendererSize();

function animate() {
  requestAnimationFrame(animate);

  if (model) {
    model.rotation.y += (targetRotation.y - model.rotation.y) * 0.15;
    model.rotation.x += (targetRotation.x - model.rotation.x) * 0.15;
    model.position.y = 0.25 + Math.sin(Date.now() * 0.0015) * 0.08;
  }

  renderer.render(scene, camera);
}

animate();
