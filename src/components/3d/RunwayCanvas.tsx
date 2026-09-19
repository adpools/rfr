import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshReflectorMaterial } from '@react-three/drei';
import * as THREE from 'three';

function SculpturalRunwayObject({ scrollProgress }: { scrollProgress: number }) {
  const monolithRef = useRef<THREE.Group>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const particleGroupRef = useRef<THREE.Points>(null);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    if (monolithRef.current) {
      monolithRef.current.rotation.y = t * 0.15 + scrollProgress * Math.PI * 0.8;
      monolithRef.current.rotation.x = Math.sin(t * 0.2) * 0.08 + scrollProgress * 0.2;
      monolithRef.current.position.y = Math.sin(t * 0.5) * 0.1 - scrollProgress * 0.5;
    }

    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = t * 0.25;
      ring1Ref.current.rotation.z = t * 0.18;
    }

    if (ring2Ref.current) {
      ring2Ref.current.rotation.y = -t * 0.2;
      ring2Ref.current.rotation.z = -t * 0.15;
    }

    if (particleGroupRef.current) {
      particleGroupRef.current.rotation.y = t * 0.03;
    }
  });

  // Particle positions
  const particlesCount = 180;
  const particlePositions = React.useMemo(() => {
    const pos = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return pos;
  }, []);

  return (
    <group position={[0, 0, 0]}>
      {/* Golden Ambient Particles */}
      <points ref={particleGroupRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particlesCount}
            array={particlePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.035}
          color="#C7A46A"
          transparent
          opacity={0.4}
          sizeAttenuation
        />
      </points>

      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.4}>
        <group ref={monolithRef}>
          {/* Central Monolith Tower / Runway Column */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.7, 3.2, 0.7]} />
            <meshStandardMaterial
              color="#0d0d0d"
              roughness={0.15}
              metalness={0.92}
              envMapIntensity={1.5}
            />
          </mesh>

          {/* Champagne Gold Accent Blades */}
          <mesh position={[0.42, 0, 0]}>
            <boxGeometry args={[0.04, 3.0, 0.6]} />
            <meshStandardMaterial
              color="#C7A46A"
              roughness={0.2}
              metalness={0.85}
              emissive="#3d2c11"
            />
          </mesh>
          <mesh position={[-0.42, 0, 0]}>
            <boxGeometry args={[0.04, 3.0, 0.6]} />
            <meshStandardMaterial
              color="#C7A46A"
              roughness={0.2}
              metalness={0.85}
              emissive="#3d2c11"
            />
          </mesh>

          {/* Outer Orbital Sculptural Rings */}
          <mesh ref={ring1Ref}>
            <torusGeometry args={[2.2, 0.02, 16, 100]} />
            <meshStandardMaterial
              color="#C7A46A"
              metalness={0.95}
              roughness={0.1}
            />
          </mesh>

          <mesh ref={ring2Ref}>
            <torusGeometry args={[2.7, 0.015, 16, 100]} />
            <meshStandardMaterial
              color="#FAF9F6"
              metalness={0.9}
              roughness={0.2}
              transparent
              opacity={0.7}
            />
          </mesh>
        </group>
      </Float>

      {/* Reflective Dark Obsidian Runway Floor */}
      <mesh position={[0, -2.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[25, 25]} />
        <MeshReflectorMaterial
          blur={[300, 100]}
          resolution={512}
          mirror={0.4}
          mixBlur={0.8}
          mixStrength={1.2}
          roughness={0.6}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#080808"
          metalness={0.7}
        />
      </mesh>
    </group>
  );
}

interface RunwayCanvasProps {
  scrollProgress?: number;
}

export const RunwayCanvas: React.FC<RunwayCanvasProps> = ({ scrollProgress = 0 }) => {
  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-90">
      <Canvas
        camera={{ position: [0, 0.5, 6.2], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={['#080808']} />
        <ambientLight intensity={0.6} />
        
        {/* Dramatic Editorial Lighting */}
        <spotLight
          position={[5, 8, 4]}
          angle={0.4}
          penumbra={1}
          intensity={2.5}
          color="#FAF9F6"
        />
        <spotLight
          position={[-6, -3, 2]}
          angle={0.6}
          penumbra={0.8}
          intensity={2.0}
          color="#C7A46A"
        />
        <pointLight position={[0, 2, -2]} intensity={1.2} color="#C7A46A" />

        <SculpturalRunwayObject scrollProgress={scrollProgress} />
      </Canvas>
    </div>
  );
};
