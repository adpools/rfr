import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { ecosystemNodes } from '../../data/ecosystemData';
import { EcosystemNode } from '../../types';

interface NodeMeshProps {
  node: EcosystemNode;
  isSelected: boolean;
  onSelect: (node: EcosystemNode) => void;
}

function NodeMesh({ node, isSelected, onSelect }: NodeMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      const scale = hovered || isSelected ? 1.35 : 1.0;
      meshRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1);
    }
  });

  const isCore = node.id === 'rfr-core';

  return (
    <group position={[node.x, node.y, node.z]}>
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(node);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[isCore ? 0.45 : 0.28, 32, 32]} />
        <meshStandardMaterial
          color={isCore ? '#C7A46A' : hovered ? '#FAF9F6' : node.color}
          emissive={isCore ? '#573d16' : hovered ? '#444444' : '#111111'}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Halo Glow Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[isCore ? 0.6 : 0.38, isCore ? 0.64 : 0.42, 32]} />
        <meshBasicMaterial
          color={isCore ? '#C7A46A' : '#FAF9F6'}
          transparent
          opacity={hovered || isSelected ? 0.8 : 0.25}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 3D Floating Label */}
      <Html distanceFactor={10} position={[0, isCore ? 0.65 : 0.45, 0]} center>
        <div
          onClick={(e) => {
            e.stopPropagation();
            onSelect(node);
          }}
          className={`px-2 py-1 rounded text-[10px] tracking-widest whitespace-nowrap uppercase font-sans cursor-pointer transition-all duration-300 ${
            isCore
              ? 'bg-[#C7A46A] text-black font-bold shadow-lg shadow-[#C7A46A]/30'
              : isSelected
              ? 'bg-white text-black font-semibold'
              : 'bg-[#111111]/90 text-[#FAF9F6] border border-[#C7A46A]/30 hover:border-[#C7A46A]'
          }`}
        >
          {node.label}
        </div>
      </Html>
    </group>
  );
}

function ConnectionLines({ selectedNode }: { selectedNode: EcosystemNode | null }) {
  const lineGeometry = React.useMemo(() => {
    const points: THREE.Vector3[] = [];
    const core = ecosystemNodes.find((n) => n.id === 'rfr-core')!;

    ecosystemNodes.forEach((node) => {
      if (node.id !== 'rfr-core') {
        points.push(new THREE.Vector3(core.x, core.y, core.z));
        points.push(new THREE.Vector3(node.x, node.y, node.z));
      }
    });

    const geom = new THREE.BufferGeometry().setFromPoints(points);
    return geom;
  }, []);

  return (
    <lineSegments geometry={lineGeometry}>
      <lineBasicMaterial
        color="#C7A46A"
        transparent
        opacity={selectedNode ? 0.35 : 0.2}
        linewidth={1}
      />
    </lineSegments>
  );
}

function GraphScene({
  selectedNode,
  onSelectNode,
}: {
  selectedNode: EcosystemNode | null;
  onSelectNode: (node: EcosystemNode) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.04;
    }
  });

  return (
    <group ref={groupRef}>
      <ConnectionLines selectedNode={selectedNode} />
      {ecosystemNodes.map((node) => (
        <NodeMesh
          key={node.id}
          node={node}
          isSelected={selectedNode?.id === node.id}
          onSelect={onSelectNode}
        />
      ))}
    </group>
  );
}

interface NetworkGraph3DProps {
  onNodeSelect?: (node: EcosystemNode) => void;
}

export const NetworkGraph3D: React.FC<NetworkGraph3DProps> = ({ onNodeSelect }) => {
  const [selectedNode, setSelectedNode] = useState<EcosystemNode | null>(ecosystemNodes[0]);

  const handleSelect = (node: EcosystemNode) => {
    setSelectedNode(node);
    if (onNodeSelect) onNodeSelect(node);
  };

  return (
    <div className="w-full h-[480px] md:h-[600px] relative rounded-2xl overflow-hidden border border-[#C7A46A]/20 bg-[#0c0c0c]/80 backdrop-blur-md">
      <Canvas camera={{ position: [0, 0, 7.8], fov: 45 }} gl={{ alpha: true }}>
        <ambientLight intensity={0.8} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#FAF9F6" />
        <pointLight position={[-10, -10, -10]} intensity={1.2} color="#C7A46A" />
        <GraphScene selectedNode={selectedNode} onSelectNode={handleSelect} />
      </Canvas>

      {/* Interactive Detail Overlay Card */}
      {selectedNode && (
        <div className="absolute bottom-6 left-6 right-6 md:right-auto md:max-w-md p-5 rounded-xl bg-[#141414]/95 border border-[#C7A46A]/40 backdrop-blur-xl shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] tracking-widest uppercase font-mono text-[#C7A46A]">
              {selectedNode.category} HUB
            </span>
            <span className="text-[11px] text-neutral-400">
              {selectedNode.connections.length} Symbiotic Links
            </span>
          </div>
          <h4 className="text-xl font-serif text-white tracking-wide mb-2">
            {selectedNode.label}
          </h4>
          <p className="text-sm text-neutral-300 font-light leading-relaxed">
            {selectedNode.description}
          </p>
        </div>
      )}

      <div className="absolute top-4 right-4 text-[10px] uppercase font-sans tracking-widest text-[#C7A46A]/70 pointer-events-none">
        Interactive 3D Network • Click Nodes to Inspect
      </div>
    </div>
  );
};
