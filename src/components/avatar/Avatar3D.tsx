import React, { Suspense, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, useAnimations, ContactShadows, Environment } from '@react-three/drei';
import * as THREE from 'three';

interface AvatarModelProps {
  url: string;
}

function AvatarModel({ url }: AvatarModelProps) {
  const group = useRef<THREE.Group>(null!);
  const { scene, animations } = useGLTF(url);

  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    // Play the first animation if available (idle)
    const firstAction = Object.values(actions)[0];
    if (firstAction) {
      firstAction.reset().fadeIn(0.5).play();
    }
    return () => {
      Object.values(actions).forEach(a => a?.fadeOut(0.5));
    };
  }, [actions]);

  // Gentle idle sway if no animation
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

function AvatarFallback() {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <capsuleGeometry args={[0.3, 0.8, 8, 16]} />
      <meshStandardMaterial color="#2A6B8A" wireframe />
    </mesh>
  );
}

interface Avatar3DProps {
  url: string | null;
  height?: string;
  className?: string;
}

export default function Avatar3D({ url, height = '55vh', className = '' }: Avatar3DProps) {
  return (
    <div className={`relative w-full rounded-2xl overflow-hidden ${className}`} style={{ height }}>
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary-100 via-primary-50 to-white" />

      <Canvas
        camera={{ position: [0, 0.5, 2.5], fov: 35 }}
        style={{ position: 'relative', zIndex: 1 }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />
        <directionalLight position={[-3, 3, -3]} intensity={0.3} />

        <Suspense fallback={<AvatarFallback />}>
          {url ? (
            <AvatarModel url={url} />
          ) : (
            <AvatarFallback />
          )}
          <ContactShadows position={[0, -1, 0]} opacity={0.4} scale={5} blur={2.5} />
        </Suspense>

        <OrbitControls
          enablePan={false}
          enableZoom={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2}
          target={[0, 0, 0]}
        />
      </Canvas>
    </div>
  );
}
