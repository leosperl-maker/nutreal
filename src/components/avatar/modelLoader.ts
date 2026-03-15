import * as THREE from 'three';
import { GLTFLoader, type GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';

/**
 * GLB Model Loader for the avatar system.
 * Loads and caches GLB files from public/models/ (ithappy Creative Characters FREE).
 */

const loader = new GLTFLoader();
const cache = new Map<string, GLTF>();
const loadingPromises = new Map<string, Promise<GLTF | null>>();

async function fileExists(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, { method: 'HEAD' });
    return res.ok;
  } catch {
    return false;
  }
}

export async function loadModel(path: string): Promise<GLTF | null> {
  if (cache.has(path)) return cache.get(path)!;
  if (loadingPromises.has(path)) return loadingPromises.get(path)!;

  const promise = (async () => {
    try {
      const exists = await fileExists(path);
      if (!exists) return null;
      return new Promise<GLTF | null>((resolve) => {
        loader.load(path, (gltf) => {
          cache.set(path, gltf);
          loadingPromises.delete(path);
          resolve(gltf);
        }, undefined, () => {
          loadingPromises.delete(path);
          resolve(null);
        });
      });
    } catch {
      loadingPromises.delete(path);
      return null;
    }
  })();

  loadingPromises.set(path, promise);
  return promise;
}

export async function preloadModels(paths: string[]): Promise<void> {
  await Promise.all(paths.map(p => loadModel(p)));
}

export function getCachedModel(path: string): GLTF | null {
  return cache.get(path) ?? null;
}

export async function hasGLBModels(): Promise<boolean> {
  return fileExists('/models/character/base.glb');
}

export function extractMesh(gltf: GLTF, name: string): THREE.Object3D | null {
  let found: THREE.Object3D | null = null;
  gltf.scene.traverse((child) => {
    if (child.name.toLowerCase().includes(name.toLowerCase()) && !found) {
      found = child;
    }
  });
  return found;
}

export function cloneGLTFScene(gltf: GLTF): THREE.Group {
  const clone = gltf.scene.clone(true);
  clone.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh;
      if (Array.isArray(mesh.material)) {
        mesh.material = mesh.material.map(m => m.clone());
      } else if (mesh.material) {
        mesh.material = mesh.material.clone();
      }
    }
  });
  return clone;
}

export function applyColor(object: THREE.Object3D, color: string): void {
  const c = new THREE.Color(color);
  object.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh;
      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      materials.forEach((mat) => {
        if ('color' in mat) {
          (mat as THREE.MeshStandardMaterial).color.copy(c);
        }
      });
    }
  });
}

export function getAnimations(gltf: GLTF): THREE.AnimationClip[] {
  return gltf.animations || [];
}

export const MODEL_PATHS = {
  base: '/models/character/base.glb',
  getItemPath: (itemId: string) => `/models/character/${itemId}.glb`,
} as const;
