import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

function SculpturalMic() {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.4;
      groupRef.current.position.y = Math.sin(t * 0.8) * 0.1;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = -t * 0.5;
      ringRef.current.rotation.x = t * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
      <group ref={groupRef}>
        {/* Cylindrical Mic Body */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.45, 0.45, 1.4, 32]} />
          <meshStandardMaterial color="#141414" metalness={0.95} roughness={0.15} />
        </mesh>

        {/* Champagne Metallic Mesh Capsule */}
        <mesh position={[0, 1.0, 0]}>
          <sphereGeometry args={[0.46, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial
            color="#C7A46A"
            metalness={0.88}
            roughness={0.25}
            wireframe={true}
          />
        </mesh>

        {/* Gold Accent Band */}
        <mesh position={[0, 0.7, 0]}>
          <cylinderGeometry args={[0.48, 0.48, 0.1, 32]} />
          <meshStandardMaterial color="#C7A46A" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Studio Shockmount Ring */}
        <mesh ref={ringRef} position={[0, 0, 0]}>
          <torusGeometry args={[0.9, 0.03, 16, 64]} />
          <meshStandardMaterial color="#FAF9F6" metalness={0.8} roughness={0.3} />
        </mesh>

        {/* Vertical Stand Stem */}
        <mesh position={[0, -1.2, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 1.2, 16]} />
          <meshStandardMaterial color="#080808" metalness={0.9} roughness={0.3} />
        </mesh>
      </group>
    </Float>
  );
}

export const StudioMicScene: React.FC = () => {
  return (
    <div className="w-full h-80 md:h-96 relative">
      <Canvas camera={{ position: [0, 0, 4.2], fov: 45 }} gl={{ alpha: true }}>
        <ambientLight intensity={0.7} />
        <spotLight position={[3, 5, 3]} intensity={2.5} color="#FAF9F6" />
        <pointLight position={[-3, -2, 2]} intensity={1.8} color="#C7A46A" />
        <SculpturalMic />
      </Canvas>
    </div>
  );
};
