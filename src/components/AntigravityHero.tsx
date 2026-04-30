import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';

// Inner Neural Network Core (Stays visible)
const NeuralNetwork = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const signalsRef = useRef<THREE.InstancedMesh>(null);

  // Generate brain-shaped nodes and edges
  const { nodes, edges } = useMemo(() => {
    const nodes: THREE.Vector3[] = [];
    const edges: THREE.Vector3[] = [];

    // Brain ellipsoid dimensions: wider than tall, slightly flat depth
    const rx = 1.4, ry = 1.0, rz = 0.9;
    const FISSURE = 0.08; // inter-hemispheric gap

    while (nodes.length < 300) {
      // Rejection-sample inside ellipsoid
      const x = (Math.random() * 2 - 1) * rx;
      const y = (Math.random() * 2 - 1) * ry;
      const z = (Math.random() * 2 - 1) * rz;

      if ((x / rx) ** 2 + (y / ry) ** 2 + (z / rz) ** 2 > 1) continue;

      // Organic surface noise
      const noise = (Math.random() - 0.5) * 0.12;
      let fx = x + noise * (x / rx);
      const fy = y + noise * (y / ry);
      const fz = z + noise * (z / rz);

      // Enforce inter-hemispheric fissure — push nodes away from x=0
      if (Math.abs(fx) < FISSURE) {
        fx = fx >= 0 ? FISSURE : -FISSURE;
      }

      nodes.push(new THREE.Vector3(fx, fy, fz));
    }

    // Connect nearby nodes
    for (let i = 0; i < nodes.length; i++) {
      let connections = 0;
      for (let j = i + 1; j < nodes.length; j++) {
        if (nodes[i].distanceTo(nodes[j]) < 0.45 && connections < 3) {
          edges.push(nodes[i], nodes[j]);
          connections++;
        }
      }
    }
    return { nodes, edges };
  }, []);

  const lineGeometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(edges), [edges]);

  // Electrical signals traveling along edges
  const numSignals = 30;
  const signals = useMemo(() => {
    return Array.from({ length: numSignals }).map(() => {
      const edgeIndex = Math.floor(Math.random() * (edges.length / 2)) * 2;
      return {
        start: edges[edgeIndex],
        end: edges[edgeIndex + 1],
        progress: Math.random(),
        speed: 0.5 + Math.random() * 2.0
      };
    });
  }, [edges]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    if (pointsRef.current) {
      // Flicker network
      (pointsRef.current.material as THREE.PointsMaterial).opacity = 0.6 + Math.sin(time * 10) * 0.3;
    }
    
    if (signalsRef.current) {
      signals.forEach((signal, i) => {
        signal.progress += signal.speed * 0.01;
        if (signal.progress >= 1) {
          signal.progress = 0;
          const edgeIndex = Math.floor(Math.random() * (edges.length / 2)) * 2;
          signal.start = edges[edgeIndex];
          signal.end = edges[edgeIndex + 1];
        }
        dummy.position.lerpVectors(signal.start, signal.end, signal.progress);
        dummy.updateMatrix();
        signalsRef.current!.setMatrixAt(i, dummy.matrix);
      });
      signalsRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group>
      <points ref={pointsRef}>
        <bufferGeometry setFromPoints={nodes} />
        <pointsMaterial color="#00aaff" size={0.06} transparent opacity={0.8} blending={THREE.AdditiveBlending} />
      </points>
      <lineSegments geometry={lineGeometry}>
        <lineBasicMaterial color="#0044ff" transparent opacity={0.4} blending={THREE.AdditiveBlending} />
      </lineSegments>
      <instancedMesh ref={signalsRef} args={[undefined, undefined, numSignals]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshBasicMaterial color="#ffffff" />
      </instancedMesh>
    </group>
  );
};

// Build a brain-shaped ellipsoid wireframe BufferGeometry
function buildBrainWireframe(rx: number, ry: number, rz: number, latSegs: number, lonSegs: number): THREE.BufferGeometry {
  const positions: number[] = [];

  // Latitude rings
  for (let i = 0; i <= latSegs; i++) {
    const phi = (i / latSegs) * Math.PI; // 0 → π (top to bottom)
    for (let j = 0; j < lonSegs; j++) {
      const t0 = (j / lonSegs) * 2 * Math.PI;
      const t1 = ((j + 1) / lonSegs) * 2 * Math.PI;
      const x0 = rx * Math.sin(phi) * Math.cos(t0);
      const y0 = ry * Math.cos(phi);
      const z0 = rz * Math.sin(phi) * Math.sin(t0);
      const x1 = rx * Math.sin(phi) * Math.cos(t1);
      const y1 = ry * Math.cos(phi);
      const z1 = rz * Math.sin(phi) * Math.sin(t1);
      positions.push(x0, y0, z0, x1, y1, z1);
    }
  }

  // Longitude lines
  for (let j = 0; j < lonSegs; j++) {
    const theta = (j / lonSegs) * 2 * Math.PI;
    for (let i = 0; i < latSegs; i++) {
      const phi0 = (i / latSegs) * Math.PI;
      const phi1 = ((i + 1) / latSegs) * Math.PI;
      const x0 = rx * Math.sin(phi0) * Math.cos(theta);
      const y0 = ry * Math.cos(phi0);
      const z0 = rz * Math.sin(phi0) * Math.sin(theta);
      const x1 = rx * Math.sin(phi1) * Math.cos(theta);
      const y1 = ry * Math.cos(phi1);
      const z1 = rz * Math.sin(phi1) * Math.sin(theta);
      positions.push(x0, y0, z0, x1, y1, z1);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  return geo;
}

// Outer Brain Shell that shatters
const BrainShell = ({ shattered }: { shattered: boolean }) => {
  const shellRef = useRef<THREE.LineSegments>(null);
  const occluderRef = useRef<THREE.Mesh>(null);

  // Memoize geometry so it's built once
  const brainGeo = useMemo(() => buildBrainWireframe(1.42, 1.02, 0.92, 18, 28), []);

  useFrame(({ clock }) => {
    if (!shattered) {
      const time = clock.getElapsedTime();
      if (shellRef.current) {
        const mat = shellRef.current.material as THREE.LineBasicMaterial;
        // Flickering synapses on the surface
        mat.opacity = 0.55 + Math.sin(time * 15) * 0.35;
      }
    }
  });

  if (shattered) return null;

  return (
    <group>
      {/* Brain-shaped wireframe shell */}
      <lineSegments ref={shellRef} geometry={brainGeo}>
        <lineBasicMaterial
          color="#0066ff"
          transparent
          opacity={0.7}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>
      {/* Dark occluder so inner network is hidden before shatter */}
      <mesh ref={occluderRef}>
        <sphereGeometry args={[0.98, 32, 32]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.85} depthWrite={true} />
      </mesh>
    </group>
  );
};

// Zero-gravity debris created upon shatter
const Debris = ({ shattered }: { shattered: boolean }) => {
  const fragmentsRef = useRef<THREE.InstancedMesh>(null);
  
  const fragments = useMemo(() => {
    return Array.from({ length: 12 }).map(() => {
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = 2 * Math.PI * Math.random();
      const r = 1.5;
      const pos = new THREE.Vector3(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      );
      
      const velocity = pos.clone().normalize().multiplyScalar(0.01 + Math.random() * 0.015);
      
      return {
        position: pos,
        rotation: new THREE.Euler(Math.random(), Math.random(), Math.random()),
        rotSpeed: new THREE.Euler(
          (Math.random() - 0.5) * 0.02, 
          (Math.random() - 0.5) * 0.02, 
          (Math.random() - 0.5) * 0.02
        ),
        velocity,
        scale: 0.3 + Math.random() * 0.5
      };
    });
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(() => {
    if (shattered && fragmentsRef.current) {
      fragments.forEach((frag, i) => {
        frag.position.add(frag.velocity);
        // Slight drag to make them float forever instead of fly away too fast
        frag.velocity.multiplyScalar(0.995);
        
        frag.rotation.x += frag.rotSpeed.x;
        frag.rotation.y += frag.rotSpeed.y;
        frag.rotation.z += frag.rotSpeed.z;

        dummy.position.copy(frag.position);
        dummy.rotation.copy(frag.rotation);
        dummy.scale.setScalar(frag.scale);
        dummy.updateMatrix();
        fragmentsRef.current!.setMatrixAt(i, dummy.matrix);
      });
      fragmentsRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  if (!shattered) return null;

  return (
    <instancedMesh ref={fragmentsRef} args={[undefined, undefined, 12]}>
      <dodecahedronGeometry args={[1, 0]} />
      <meshStandardMaterial 
        color="#050505" 
        roughness={0.4}
        metalness={0.8}
        emissive="#001133"
        emissiveIntensity={0.5}
      />
    </instancedMesh>
  );
};

// Scene Background Transition
const BackgroundTransition = ({ shattered }: { shattered: boolean }) => {
  useFrame(({ scene }) => {
    if (!scene.background) scene.background = new THREE.Color('#000000');
    if (shattered) {
      // Transition to deep electric blue
      (scene.background as THREE.Color).lerp(new THREE.Color('#000a1f'), 0.01);
    }
  });
  return null;
};

// Orchestrates the entire cinematic sequence
export const CinematicBrainSequence = () => {
  const [shattered, setShattered] = useState(false);
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    // Sequence trigger: Shatter the brain after 4 seconds
    const timer = setTimeout(() => {
      setShattered(true);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  useFrame(() => {
    if (groupRef.current) {
      // The brain slowly rotates on its vertical axis
      groupRef.current.rotation.y += 0.003;
    }
  });

  return (
    <>
      <BackgroundTransition shattered={shattered} />
      
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 5, 5]} intensity={2} color="#0088ff" />
      <pointLight position={[0, 0, 0]} intensity={shattered ? 6 : 3} color="#00aaff" distance={10} />
      
      <group ref={groupRef}>
        <BrainShell shattered={shattered} />
        <NeuralNetwork />
        <Debris shattered={shattered} />
      </group>
      
      {/* Tech noir dust/stars floating in zero gravity */}
      <Stars radius={50} depth={50} count={1500} factor={2} saturation={1} fade speed={1} />
      
      <OrbitControls 
        enablePan={false}
        enableZoom={false}
        enableRotate={false}
      />
    </>
  );
};

export default function AntigravityHero() {
  return (
    <div className="relative w-full h-screen bg-black overflow-hidden font-['Inter',sans-serif]">
      {/* 3D Cinematic Background */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 7], fov: 45 }}>
          <CinematicBrainSequence />
        </Canvas>
      </div>

      {/* Cinematic UI Overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none p-8 md:p-16 flex flex-col justify-between">
        
        {/* Top Left Branding */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.5, delay: 0.5 }}
          className="text-white text-3xl font-black tracking-[0.2em] font-['Orbitron',sans-serif]"
          style={{ textShadow: '0 0 20px rgba(0, 170, 255, 0.8)' }}
        >
          PHOTON
        </motion.div>

        {/* Left Side Content */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2, delay: 1.5, ease: "easeOut" }}
          className="max-w-xl"
        >
          <div className="inline-flex items-center gap-3 px-4 py-1.5 mb-6 rounded-full text-xs font-bold tracking-widest text-[#00aaff] uppercase"
               style={{ background: 'rgba(0, 170, 255, 0.1)', border: '1px solid rgba(0, 170, 255, 0.2)' }}>
            <div className="w-2 h-2 rounded-full bg-[#00aaff] animate-pulse" />
            System Online
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-[#0044ff] mb-6 font-['Orbitron',sans-serif] leading-[1.1]">
            NEURO<br />
            SYMBOLIC<br />
            A.I.
          </h1>
          
          <p className="text-lg text-white/60 leading-relaxed max-w-md" style={{ backdropFilter: 'blur(4px)' }}>
            Advanced cognitive architectures bridging connectionist networks with symbolic logic reasoning frameworks.
          </p>
        </motion.div>

      </div>
    </div>
  );
}
