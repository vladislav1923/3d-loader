import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const generator = async (file: File): Promise<string> => {
    return new Promise((res, rej) => {
        // 1. Setup Scene, Camera, Renderer
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(512, 512); // Output image size

        // 2. Add Light (optional, for visibility)
        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(0, 1, 1);
        scene.add(light);

        // 3. Load 3D Model (e.g., GLTF)
        const loader = new GLTFLoader();
        const url = URL.createObjectURL(file);

        loader.load(url, (gltf) => {
            const model = gltf.scene;
            scene.add(model);

            // Position camera to frame the model
            camera.position.z = 5;

            // 4. Render Once
            renderer.render(scene, camera);

            // 5. Export to PNG
            const imgData = renderer.domElement.toDataURL('image/png');
            const base64Data = imgData.replace(/^data:image\/png;base64,/, '');
            renderer.dispose();
            URL.revokeObjectURL(url);
            res(base64Data);
        }, undefined, (err) => {
            renderer.dispose();
            URL.revokeObjectURL(url);
            rej(err)
        });
    });
}

export default generator;
