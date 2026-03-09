import React, { Suspense, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, useAnimations, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { Loader2 } from 'lucide-react';

interface AvatarModelProps {
  url: string;
}

function AvatarModel({ url }: AvatarModelProps) {
  const group = useRef<THREE.Group>(null!);
  const { scene, animations } = useGLTF(url);
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    const firstAction = Object.values(actions)[0];
    if (firstAction) {
      firstAction.reset().fadeIn(0.5).play();
    }
    return () => {
      Object.values(actions).forEach(a => a?.fadeOut(0.5));
    };
  }, [actions]);

  useFrame((state) => {
    if (group.current && Object.keys(actions).length === 0) {
      group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
    }
  });

  return (
    <group ref={group} dispose={null}>
      <primitive object={scene} scale={1} position={[0, -1, 0]} />
    </group>
  );
}

interface Avatar3DProps {
  url: string | null;
  height?: string;
  className?: string;
}

/** Placeholder stylise quand aucun avatar n'est cree */
function AvatarPlaceholder({ height }: { height: string }) {
  return (
    <div className="relative w-full rounded-2xl overflow-hidden" style={{ height }}>
      <div className="absolute inset-0 bg-gradient-to-b from-primary-200 via-primary-100 to-white" />
      <div className="relative z-10 flex flex-col items-center justify-center h-full">
        {/* Stylized silhouette */}
        <div className="relative">
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 shadow-2xl flex items-center justify-center">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="8" r="4" fill="white" fillOpacity="0.9" />
              <path d="M4 20c0-4.418 3.582-8 8-8s8 3.582 8 8" fill="white" fillOpacity="0.9" />
            </svg>
          </div>
          {/* Decorative rings */}
          <div className="absolute -inset-3 rounded-full border-2 border-primary-300/30 animate-pulse" />
          <div className="absolute -inset-6 rounded-full border border-primary-200/20" />
        </div>
        <p className="text-sm font-medium text-primary-400 mt-6">Aucun avatar</p>
      </div>
    </div>
  );
}

export default function Avatar3D({ url, height = '55vh', className = '' }: Avatar3DProps) {
  // No URL = show nice placeholder instead of heavy 3D wireframe
  if (!url) {
    return (
      <div className={className}>
        <AvatarPlaceholder height={height} />
      </div>
    );
  }

  return (
    <div className={`relative w-full rounded-2xl overflow-hidden ${className}`} style={{ height }}>
      <div className="absolute inset-0 bg-gradient-to-b from-primary-100 via-primary-50 to-white" />
      <Suspense fallback={
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 size={32} className="text-primary-400 animate-spin" />
        </div>
      }>
        <Canvas
          camera={{ position: [0, 0.5, 2.5], fov: 35 }}
          style={{ position: 'relative', zIndex: 1 }}
          dpr={[1, 2]}
        >
          <ambientLight intensity={0.7} />
          <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />
          <directionalLight position={[-3, 3, -3]} intensity={0.3} />
          <AvatarModel url={url} />
          <ContactShadows position={[0, -1, 0]} opacity={0.4} scale={5} blur={2.5} />
          <OrbitControls
            enablePan={false}
            enableZoom={false}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 2}
            target={[0, 0, 0]}
          />
        </Canvas>
      </Suspense>
    </div>
  );
}
