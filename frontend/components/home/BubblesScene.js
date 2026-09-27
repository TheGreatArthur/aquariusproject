'use client';

import { Component, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Color, Object3D } from 'three';

const COUNT = 70;
const HEIGHT = 9;

/**
 * Bulles qui remontent doucement, dessinées en une seule InstancedMesh (un seul draw call)
 */
function Bubbles () {
  const mesh = useRef();
  const dummy = useMemo(() => new Object3D(), []);
  const { viewport } = useThree();
  // Bulles plus petites et resserrées sur les écrans étroits
  const size = Math.min(1, Math.max(0.5, viewport.width / 9));

  const bubbles = useMemo(() => Array.from({ length: COUNT }, () => ({
    x: Math.random() - 0.5,
    y: (Math.random() - 0.5) * HEIGHT,
    z: (Math.random() - 0.5) * 4,
    scale: 0.03 + Math.random() ** 2 * 0.13,
    speed: 0.15 + Math.random() * 0.45,
    wobble: Math.random() * Math.PI * 2,
  })), []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    bubbles.forEach((b, i) => {
      b.y += b.speed * delta;
      if (b.y > HEIGHT / 2)
        b.y = -HEIGHT / 2;
      dummy.position.set(b.x * viewport.width + Math.sin(t * 0.8 + b.wobble) * 0.15, b.y, b.z);
      dummy.scale.setScalar(b.scale * size);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, COUNT]}>
      <sphereGeometry args={[1, 16, 12]}/>
      <meshStandardMaterial
        color={new Color('#9FF5E6')}
        emissive={new Color('#2DD4BF')}
        emissiveIntensity={0.25}
        roughness={0.1}
        metalness={0.2}
        transparent
        opacity={0.35}
      />
    </instancedMesh>
  );
}

/** Le navigateur sait-il créer un contexte WebGL ? */
function hasWebGL () {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

/** Décor uniquement : en cas d'erreur 3D, on n'affiche rien plutôt que de casser la page */
class SceneErrorBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError () {
    return { failed: true };
  }

  render () {
    return this.state.failed ? null : this.props.children;
  }
}

export default function BubblesScene () {
  const wrapper = useRef(null);
  const [visible, setVisible] = useState(true);
  const [supported, setSupported] = useState(false);

  useEffect(() => setSupported(hasWebGL()), []);

  // Met la boucle de rendu en pause quand le hero sort de l'écran
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    if (wrapper.current)
      observer.observe(wrapper.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={wrapper} className="absolute inset-0">
      {supported && (
        <SceneErrorBoundary>
          <Canvas
            dpr={[1, 1.5]}
            frameloop={visible ? 'always' : 'never'}
            camera={{ position: [0, 0, 6], fov: 50 }}
            gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
          >
            <ambientLight intensity={0.6}/>
            <pointLight position={[4, 5, 5]} intensity={40} color="#5EEAD4"/>
            <Bubbles/>
          </Canvas>
        </SceneErrorBoundary>
      )}
    </div>
  );
}
