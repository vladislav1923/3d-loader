'use client';

import { useState } from "react";

export default function Home() {
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFile(e.target?.files?.[0] ?? null);
    };

    const submitHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            console.log(response);
        } catch (error) {
            console.error('Error:', error);
        }

    }


    return (
      <div className="flex h-[100vh]">
          <section className="m-auto">
              <form onSubmit={submitHandler}>
                  <h1 className="text-xl font-bold text-center mb-2">3D Loader</h1>
                  <fieldset className="fieldset mb-2">
                      <legend className="fieldset-legend">Pick a file</legend>
                      <input type="file" className="file-input w-100" onChange={handleFileChange} />
                      <label className="fieldset-label">Max size 1.5GB</label>
                  </fieldset>
                  <button type="submit" className="btn btn-primary w-100">Upload</button>
              </form>
          </section>
      </div>
    );
}
