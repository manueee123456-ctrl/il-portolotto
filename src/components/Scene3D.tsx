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

    // 1. Scena e Luce Ambientale Pulita
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xbae6fd); // Cielo chiaro e brillante

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      2000
    );

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    
    // Corretto il tipo di ombre per evitare il warning PCFSoftShadowMap
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;

    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // 2. Illuminazione Naturale (Senza sfere o elementi visibili brutti)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 2.5);
    sunLight.position.set(50, 80, 50);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    scene.add(sunLight);

    const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x38bdf8, 1.0);
    scene.add(hemisphereLight);

    // 3. Setup Caricamento Modelli
    const mixers: THREE.AnimationMixer[] = [];
    let lastTime = performance.now();

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');

    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);

    const baseUrl = import.meta.env.BASE_URL || '/';

    const playAnimations = (gltf: any) => {
      if (gltf.animations && gltf.animations.length > 0) {
        const mixer = new THREE.AnimationMixer(gltf.scene);
        gltf.animations.forEach((clip: THREE.AnimationClip) => {
          mixer.clipAction(clip).play();
        });
        mixers.push(mixer);
      }
    };

    // Gruppo unico per mantenere sincronizzati Porto e Mare nelle stesse coordinate
    const worldGroup = new THREE.Group();
    scene.add(worldGroup);

    // 4. Caricamento Modello Porto (format1.glb)
    const loadMainModel = new Promise<THREE.Group>((resolve) => {
      gltfLoader.load(`${baseUrl}models/format1.glb`, (gltf) => {
        const model = gltf.scene;
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
        worldGroup.add(model);
        playAnimations(gltf);
        resolve(model);
      });
    });

    // 5. Caricamento Modello Mare (mar.glb) con correzione trasparenza e colore
    const loadWaterModel = new Promise<THREE.Group | null>((resolve) => {
      gltfLoader.load(
        `${baseUrl}models/mar.glb`,
        (gltf) => {
          const waterModel = gltf.scene;

          waterModel.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
              const mesh = child as THREE.Mesh;
              
              // Forzatura materiale acqua blu lucido e semi-trasparente
              mesh.material = new THREE.MeshStandardMaterial({
                color: 0x0284c7,
                roughness: 0.1,
                metalness: 0.1,
                transparent: true,
                opacity: 0.8,
                side: THREE.DoubleSide,
                depthWrite: false
              });
            }
          });

          worldGroup.add(waterModel);
          playAnimations(gltf);
          resolve(waterModel);
        },
        undefined,
        (err) => {
          console.error('Errore nel caricamento di mar.glb:', err);
          resolve(null);
        }
      );
    });

    // 6. Centratura Scena e Posizionamento Telecamera
    Promise.all([loadMainModel, loadWaterModel]).then(([mainModel]) => {
      const box = new THREE.Box3().setFromObject(worldGroup);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());

      // Centra l'intero mondo al punto (0,0,0) mantenendo l'allineamento porto-mare
      worldGroup.position.sub(center);

      const maxDim = Math.max(size.x, size.y, size.z);
      const fov = camera.fov * (Math.PI / 180);
      const cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2)) * 1.5;

      camera.position.set(cameraZ * 0.8, maxDim * 0.6, cameraZ * 1.2);
      camera.lookAt(0, 0, 0);

      controls.target.set(0, 0, 0);
      controls.update();
    });

    // 7. Render Loop
    let animationFrameId: number;

    const animate = (currentTime: number) => {
      animationFrameId = requestAnimationFrame(animate);

      const delta = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

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
