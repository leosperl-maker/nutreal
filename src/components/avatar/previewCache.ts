/**
 * Offscreen preview renderer — renders 3D item snapshots using a SINGLE WebGL context.
 * Avoids the browser limit of ~8-16 contexts that caused crashes with per-item <Canvas>.
 */
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';
import { MODEL_PATHS } from './modelLoader';
import { GLB_MESH_MAP, ALL_CHARACTER_MESHES, ALWAYS_VISIBLE_MESHES } from './avatarItems';

const PREVIEW_SIZE = 128;
const cache = new Map<string, string>();
let initPromise: Promise<boolean> | null = null;
let renderer: THREE.WebGLRenderer | null = null;
let baseScene: THREE.Group | null = null;

async function ensureInit(): Promise<boolean> {
  if (renderer && baseScene) return true;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = PREVIEW_SIZE;
      canvas.height = PREVIEW_SIZE;
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, preserveDrawingBuffer: true });
      renderer.setSize(PREVIEW_SIZE, PREVIEW_SIZE);
      renderer.setPixelRatio(1);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.2;

      const loader = new GLTFLoader();
      const gltf = await loader.loadAsync(MODEL_PATHS.base);
      baseScene = gltf.scene;
      return true;
    } catch (e) {
      console.warn('[PreviewCache] Failed to init:', e);
      initPromise = null;
      return false;
    }
  })();

  return initPromise;
}

type CameraPreset = 'head' | 'face' | 'torso' | 'lower' | 'feet' | 'hands' | 'full';

function getCameraPreset(itemId: string): CameraPreset {
  if (itemId.startsWith('hair_')) return 'head';
  if (/^acc_(cap|hat|bandana|headphones)/.test(itemId)) return 'head';
  if (/^acc_(glasses|sunglasses|moustache|clownnose|pacifier)/.test(itemId)) return 'face';
  if (itemId.startsWith('top_') || itemId.startsWith('ow_')) return 'torso';
  if (itemId.startsWith('bot_')) return 'lower';
  if (itemId.startsWith('shoes_')) return 'feet';
  if (itemId.startsWith('acc_gloves')) return 'hands';
  return 'full';
}

function getCameraConfig(preset: CameraPreset): { pos: [number, number, number]; target: [number, number, number] } {
  switch (preset) {
    case 'head':  return { pos: [0, 1.9, 1.3],  target: [0, 1.8, 0] };
    case 'face':  return { pos: [0, 1.75, 1.0], target: [0, 1.7, 0] };
    case 'torso': return { pos: [0, 1.2, 2.2],  target: [0, 1.1, 0] };
    case 'lower': return { pos: [0, 0.65, 2.2], target: [0, 0.55, 0] };
    case 'feet':  return { pos: [0, 0.15, 1.6], target: [0, 0.1, 0] };
    case 'hands': return { pos: [0.8, 1.0, 1.8], target: [0, 0.9, 0] };
    case 'full':  return { pos: [0, 1.0, 3.2],  target: [0, 0.9, 0] };
  }
}

export async function getItemPreview(itemId: string): Promise<string | null> {
  if (cache.has(itemId)) return cache.get(itemId)!;

  const meshNames = GLB_MESH_MAP[itemId];
  if (!meshNames?.length) return null;

  const ready = await ensureInit();
  if (!ready || !renderer || !baseScene) return null;

  const clone = SkeletonUtils.clone(baseScene);

  const visible = new Set([...ALWAYS_VISIBLE_MESHES, ...meshNames]);
  clone.traverse(child => {
    if (ALL_CHARACTER_MESHES.includes(child.name)) {
      child.visible = visible.has(child.name);
    }
  });

  const scene = new THREE.Scene();
  scene.add(new THREE.AmbientLight(0xffffff, 0.9));
  const dir = new THREE.DirectionalLight(0xffffff, 0.7);
  dir.position.set(2, 3, 3);
  scene.add(dir);
  const fill = new THREE.DirectionalLight(0xB4C6FF, 0.3);
  fill.position.set(-2, 2, -2);
  scene.add(fill);
  scene.add(clone);

  const preset = getCameraPreset(itemId);
  const { pos, target } = getCameraConfig(preset);
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 20);
  camera.position.set(...pos);
  camera.lookAt(new THREE.Vector3(...target));

  renderer.render(scene, camera);
  const dataUrl = renderer.domElement.toDataURL('image/png');
  cache.set(itemId, dataUrl);

  scene.remove(clone);

  return dataUrl;
}

export function clearPreviewCache(): void {
  cache.clear();
}
