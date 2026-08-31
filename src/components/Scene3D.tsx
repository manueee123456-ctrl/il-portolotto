import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { Timer } from 'three/addons/misc/Timer.js';

export const Scene3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scena, Camera e Renderer
    const scene = new THREE.Scene();
    
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 2, 5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    
    // Sostituito PCFSoftShadowMap (deprecato) con PCFShadowMap
    renderer.shadowMap.type = THREE.PCFShadowMap;
    
    container.appendChild(renderer.domElement);

    // 2. Luci
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2);
    dirLight.position.set(5, 10, 7);
    dirLight.castShadow = true;
    scene.add(dirLight);

    // 3. Setup Decodificatore DRACO & Caricamento GLTF
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');

    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);

    // Percorso base per GitHub Pages / ambiente locale
    const baseUrl = import.meta.env.BASE_URL || '/';
    
    gltfLoader.load(
      `${baseUrl}models/format1.glb`,
      (gltf) => {
        const model = gltf.scene;
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
        scene.add(model);
      },
      undefined,
      (error) => console.error('Errore nel caricamento del modello 3D:', error)
    );

    // 4. Timer Animation Loop (sostituisce THREE.Clock deprecato)
    const timer = new Timer();
    let animationFrameId: number;

    const animate = (timestamp: number) => {
      animationFrameId = requestAnimationFrame(animate);

      // Aggiorna il timer fornendo il timestamp nativo
      timer.update(timestamp);
      const delta = timer.getDelta();

      // Qui puoi inserire eventuali animazioni usando 'delta'
      renderer.render(scene, camera);
    };

    animationFrameId = requestAnimationFrame(animate);

    // 5. Gestione Resize Finestra
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup alla smontaggio del componente
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      dracoLoader.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      style={{ width: '100%', height: '100vh', overflow: 'hidden' }} 
    />
  );
};

export default Scene3D;
