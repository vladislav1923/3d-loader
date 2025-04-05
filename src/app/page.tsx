import Image from "next/image";

export default function Home() {
  return (
      <div className="flex h-[100vh]">
          <section className="m-auto">
              <h1 className="text-xl font-bold text-center mb-2">3D Loader</h1>
              <fieldset className="fieldset mb-2">
                  <legend className="fieldset-legend">Pick a file</legend>
                  <input type="file" className="file-input w-100"/>
                  <label className="fieldset-label">Max size 1.5GB</label>
              </fieldset>
              <button className="btn btn-primary w-100">Upload</button>
          </section>
      </div>
  );
}
