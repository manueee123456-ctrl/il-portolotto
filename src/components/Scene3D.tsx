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

    // 1. Scena, Nebbia e Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb); // Cielo azzurro
    scene.fog = new THREE.FogExp2(0x87ceeb, 0.012);

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
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // 2. Luce Solare e Sole
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.3);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfffaed, 2.8);
    sunLight.position.set(30, 50, 20);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    scene.add(sunLight);

    // Sole visibile in cielo
    const sunMesh = new THREE.Mesh(
      new THREE.SphereGeometry(3, 32, 32),
      new THREE.MeshBasicMaterial({ color: 0xffdd66 })
    );
    sunMesh.position.copy(sunLight.position);
    scene.add(sunMesh);

    // 3. Loader & Gestore Animazioni (Mixers)
    const mixers: THREE.AnimationMixer[] = [];
    let lastTime = performance.now();

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');

    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);

    const baseUrl = import.meta.env.BASE_URL || '/';

    // Funzione helper per avviare le animazioni di un modello
    const playAnimations = (gltf: any) => {
      if (gltf.animations && gltf.animations.length > 0) {
        const mixer = new THREE.AnimationMixer(gltf.scene);
        gltf.animations.forEach((clip: THREE.AnimationClip) => {
          mixer.clipAction(clip).play();
        });
        mixers.push(mixer);
      }
    };

    // 4. Caricamento Parallelo dei due file .GLB
    const loadMainModel = new Promise((resolve) => {
      gltfLoader.load(`${baseUrl}models/format1.glb`, (gltf) => {
        const model = gltf.scene;
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
        scene.add(model);
        playAnimations(gltf);
        resolve(model);
      });
    });

    const loadWaterModel = new Promise((resolve) => {
      // Sostituisci "water.glb" col nome esatto del tuo file nella cartella public/models/
      gltfLoader.load(`${baseUrl}models/water.glb`, (gltf) => {
        const waterModel = gltf.scene;
        
        // Rende il materiale dell'acqua semi-trasparente se non lo è già
        waterModel.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            const mat = mesh.material as THREE.MeshStandardMaterial;
            if (mat) {
              mat.transparent = true;
              mat.opacity = 0.85;
              mat.side = THREE.DoubleSide;
            }
          }
        });

        scene.add(waterModel);
        playAnimations(gltf); // Avvia l'animazione dell'acqua (es. onde riggate)
        resolve(waterModel);
      }, undefined, () => resolve(null)); // Ignora se il file non esiste ancora
    });

    // Inquadratura basata sul modello principale
    loadMainModel.then((model: any) => {
      const box = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());

      model.position.sub(center);

      const maxDim = Math.max(size.x, size.y, size.z);
      const fov = camera.fov * (Math.PI / 180);
      const cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2)) * 1.5;

      camera.position.set(cameraZ * 0.7, maxDim * 0.5, cameraZ);
      camera.lookAt(0, 0, 0);

      controls.target.set(0, 0, 0);
      controls.update();
    });

    // 5. Render loop (aggiorna tutti i mixers delle animazioni)
    let animationFrameId: number;

    const animate = (currentTime: number) => {
      animationFrameId = requestAnimationFrame(animate);

      const delta = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      // Aggiorna le animazioni sia del porto che dell'acqua
      mixers.forEach((mixer) => mixer.update(delta));

      controls.update();
      renderer.render(scene, camera);
    };

    animate(performance.now());

    // Cleanup
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
