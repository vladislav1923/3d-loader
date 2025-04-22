'use client';

import { useState } from "react";
import { WebGLRenderer, Scene, PerspectiveCamera, AmbientLight, DirectionalLight, Color, Group } from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

async function generateThumbnail(file: File): Promise<string> {
    // Create a canvas element
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    
    // Create a WebGL renderer
    const renderer = new WebGLRenderer({ 
        canvas: canvas,
        antialias: true 
    });
    renderer.setSize(800, 600);
    renderer.setClearColor(new Color(0xffffff));

    // Create scene and camera
    const scene = new Scene();
    const camera = new PerspectiveCamera(75, 800 / 600, 0.1, 1000);
    camera.position.z = 5;

    // Add lights
    const ambientLight = new AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const directionalLight = new DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 1, 0);
    scene.add(directionalLight);

    // Load GLTF model
    const loader = new GLTFLoader();
    const url = URL.createObjectURL(file);
    const gltf = await loader.loadAsync(url);
    scene.add(gltf.scene);

    // Render scene
    renderer.render(scene, camera);

    // Convert canvas to data URL
    const thumbnailUrl = canvas.toDataURL('image/png');
    
    // Cleanup
    URL.revokeObjectURL(url);
    
    return thumbnailUrl;
}

export default function Home() {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [image, setImage] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            // Check file size (1.5GB = 1.5 * 1024 * 1024 * 1024 bytes)
            if (selectedFile.size > 1.5 * 1024 * 1024 * 1024) {
                setErrorMessage('File size exceeds 1.5GB limit');
                return;
            }
            setFile(selectedFile);
            setErrorMessage('');
        }
    };

    const submitHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;

        setLoading(true);
        setErrorMessage('');
        
        try {
            // Create FormData and append file
            const thumbnailUrl = await generateThumbnail(file);
            setImage(thumbnailUrl);
            console.info('Thumbnail generated successfully');
        } catch (err) {
            const message = err instanceof Error ? err.message : 'An error occurred';
            setErrorMessage(message);
            console.error('Error generating thumbnail', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-[100vh] max-w-[1000px] justify-between items-center px-4 mx-auto">
            <section className="m-auto">
                <form onSubmit={submitHandler}>
                    <h1 className="text-xl font-bold text-center mb-2">3D Loader</h1>
                    <fieldset className="fieldset mb-2">
                        <legend className="fieldset-legend">Pick a file</legend>
                        <input 
                            type="file" 
                            className="file-input w-100" 
                            onChange={handleFileChange}
                            accept=".glb,.gltf"
                        />
                        <label className="fieldset-label">Max size 1.5GB</label>
                    </fieldset>
                    <button 
                        type="submit" 
                        className="btn btn-primary w-100"
                        disabled={loading || !file}
                    >
                        {loading ? 'Processing...' : 'Upload'}
                    </button>
                </form>

                {errorMessage && (
                    <div className="alert alert-error mt-4">
                        {errorMessage}
                    </div>
                )}
            </section>
            <section>
                {image && (
                    <div className="mt-4">
                        <img src={image} alt="3d model" className="max-w-full" />
                    </div>
                )}
            </section>
        </div>
    );
}
