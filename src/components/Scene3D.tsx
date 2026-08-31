import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export const Scene3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scena con sfumatura di sfondo pulita (stile cielo/mare)
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xa0c4ff);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // 2. Luci ambientali e direzionali per esaltare texture e acqua
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 2.5);
    sunLight.position.set(10, 20, 10);
    scene.add(sunLight);

    const fillLight = new THREE.DirectionalLight(0x88ccff, 1.2);
    fillLight.position.set(-10, -5, -10);
    scene.add(fillLight);

    // 3. Animazioni & Draco Loader
    let mixer: THREE.AnimationMixer | null = null;
    let lastTime = performance.now();

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');

    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);

    const baseUrl = import.meta.env.BASE_URL || '/';

    gltfLoader.load(
      `${baseUrl}models/format1.glb`,
      (gltf) => {
        const model = gltf.scene;

        // --- CORREZIONE MATERIALI E ACQUA ---
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            const mat = mesh.material as THREE.MeshStandardMaterial;

            if (mat) {
              mat.transparent = true;
              mat.depthWrite = true;

              // Forza la visibilità dei materiali dell'acqua o trasparenti
              if (
                mesh.name.toLowerCase().includes('water') ||
                mesh.name.toLowerCase().includes('acqua') ||
                mat.name.toLowerCase().includes('water') ||
                mat.opacity < 1
              ) {
                mat.opacity = 0.85;
                mat.roughness = 0.1;
                mat.metalness = 0.1;
                mat.side = THREE.DoubleSide; // Rende l'acqua visibile da ogni angolazione
              }
            }
          }
        });

        // --- CORREZIONE ROTAZIONE (Ruota il modello sul lato corretto) ---
        model.rotation.y = -Math.PI / 2; // Modifica in Math.PI o 0 se desideri un altro orientamento

        scene.add(model);

        // Riproduzione animazioni GLTF
        if (gltf.animations && gltf.animations.length > 0) {
          mixer = new THREE.AnimationMixer(model);
          gltf.animations.forEach((clip) => {
            mixer?.clipAction(clip).play();
          });
        }

        // --- INQUADRATURA AUTOMATICA ---
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        model.position.sub(center);

        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = camera.fov * (Math.PI / 180);
        const cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2)) * 1.6;

        camera.position.set(cameraZ * 0.8, maxDim * 0.6, cameraZ);
        camera.lookAt(0, 0, 0);

        controls.target.set(0, 0, 0);
        controls.update();
      },
      undefined,
      (error) => console.error('Errore nel caricamento del modello 3D:', error)
    );

    // 4. Render loop senza THREE.Clock (elimina il warning di deprecazione)
    let animationFrameId: number;

    const animate = (currentTime: number) => {
      animationFrameId = requestAnimationFrame(animate);

      const delta = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      if (mixer) mixer.update(delta);

      controls.update();
      renderer.render(scene, camera);
    };

    animate(performance.now());

    // 5. Cleanup
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

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
