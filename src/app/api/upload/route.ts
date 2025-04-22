import { createCanvas } from 'canvas';
import { WebGLRenderer, Scene, PerspectiveCamera, AmbientLight, DirectionalLight, Color } from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

async function generateThumbnail(file: File): Promise<string> {
    // Create a canvas
    const canvas = createCanvas(800, 600);
    
    // Create a WebGL renderer
    const renderer = new WebGLRenderer({ 
        canvas: canvas as unknown as HTMLCanvasElement,
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
    const arrayBuffer = await file.arrayBuffer();
    const gltf = await loader.parseAsync(arrayBuffer, '');
    scene.add(gltf.scene);

    // Render scene
    renderer.render(scene, camera);

    // Convert canvas to base64
    const buffer = canvas.toBuffer('image/png');
    return `data:image/png;base64,${buffer.toString('base64')}`;
}

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file');

        if (!file || !(file instanceof File)) {
            return new Response(JSON.stringify({ error: 'Invalid file' }), { status: 400 });
        }

        // Generate thumbnail on the server
        const base64Data = await generateThumbnail(file);

        return new Response(JSON.stringify({ base64Data }), { 
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error('Error processing file:', error);
        return new Response(JSON.stringify({ error: 'Failed to process file' }), { status: 500 });
    }
}
