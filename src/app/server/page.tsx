'use client';

import { useState } from "react";


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
            const form = new FormData();
            form.append('file', file);

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: form
            });
            
            if (!response.ok) {
                throw new Error('Failed to generate thumbnail');
            }

            const data = await response.json();
            setImage(data.base64Data);
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
