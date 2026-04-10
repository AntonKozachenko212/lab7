 import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { inventoryApi } from "../services/inventoryApi";

export default function AdminInventoryEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // Text fields state
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [textLoading, setTextLoading] = useState(false);
  const [textError, setTextError] = useState(null);
  const [textSuccess, setTextSuccess] = useState(false);

  // Photo state
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [photoError, setPhotoError] = useState(null);
  const [photoSuccess, setPhotoSuccess] = useState(false);

  useEffect(() => {
    inventoryApi
      .getById(id)
      .then((data) => {
        setItem(data);
        setName(data.inventory_name || "");
        setDesc(data.description || "");
      })
      .catch((e) => setFetchError(e.message))
      .finally(() => setFetchLoading(false));
  }, [id]);

  async function handleTextSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return;
    setTextLoading(true);
    setTextError(null);
    setTextSuccess(false);
    try {
      await inventoryApi.updateInfo(id, {
        inventory_name: name.trim(),
        description: desc.trim(),
      });
      setTextSuccess(true);
      setTimeout(() => setTextSuccess(false), 3000);
    } catch (e) {
      setTextError(e.message);
    } finally {
      setTextLoading(false);
    }
  }

  function handlePhotoChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setPhoto(file);
    setPreview(URL.createObjectURL(file));
  }

  async function handlePhotoSubmit(e) {
    e.preventDefault();
    if (!photo) return;
    setPhotoLoading(true);
    setPhotoError(null);
    setPhotoSuccess(false);
    try {
      const fd = new FormData();
      fd.append("photo", photo);
      await inventoryApi.updatePhoto(id, fd);
      setPhotoSuccess(true);
      setTimeout(() => setPhotoSuccess(false), 3000);
    } catch (e) {
      setPhotoError(e.message);
    } finally {
      setPhotoLoading(false);
    }
  }

  if (fetchLoading) {
    return (
      <div className="flex items-center gap-3 text-zinc-500 text-sm py-10">
        <span className="inline-block w-4 h-4 border border-zinc-600 border-t-zinc-400 rounded-full animate-spin" />
        Loading...
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="px-4 py-3 rounded border border-red-800 bg-red-950/30 text-red-400 text-sm">
        ⚠ {fetchError}
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="text-zinc-500 hover:text-zinc-100 transition-colors text-sm"
        >
          ← Back
        </button>
        <span className="text-zinc-700">/</span>
        <h1 className="text-xl font-bold text-zinc-100">Edit: {item?.inventory_name}</h1>
      </div>

      <div className="space-y-10 max-w-lg">
        {/* Section 1: Text info */}
        <section>
          <h2 className="text-xs uppercase tracking-widest text-amber-400 mb-5 pb-2 border-b border-zinc-800">
            01 — Item Info
          </h2>
          <form onSubmit={handleTextSubmit} className="space-y-5">
            <div>
              <label className="block text-xs uppercase tracking-widest text-zinc-500 mb-2">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded px-4 py-3 text-zinc-100 text-sm focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-zinc-500 mb-2">
                Description
              </label>
              <textarea
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                rows={4}
                className="w-full bg-zinc-900 border border-zinc-700 rounded px-4 py-3 text-zinc-100 text-sm focus:outline-none focus:border-amber-500 transition-colors resize-none"
              />
            </div>

            {textError && (
              <p className="text-xs text-red-400">⚠ {textError}</p>
            )}
            {textSuccess && (
              <p className="text-xs text-emerald-400">✓ Info updated successfully</p>
            )}

            <button
              type="submit"
              disabled={textLoading || !name.trim()}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs uppercase tracking-widest font-bold rounded transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {textLoading && (
                <span className="inline-block w-3 h-3 border border-zinc-800/40 border-t-zinc-800 rounded-full animate-spin" />
              )}
              Update Info
            </button>
          </form>
        </section>

        {/* Section 2: Photo */}
        <section>
          <h2 className="text-xs uppercase tracking-widest text-amber-400 mb-5 pb-2 border-b border-zinc-800">
            02 — Photo
          </h2>
          <form onSubmit={handlePhotoSubmit} className="space-y-5">
            <div className="flex gap-4 items-start">
              {/* Current photo */}
              <div className="shrink-0">
                <p className="text-xs text-zinc-600 mb-1">Current</p>
                <div className="w-16 h-16 rounded border border-zinc-800 overflow-hidden bg-zinc-900">
                  <img
                    src={inventoryApi.photoUrl(id)}
                    alt="current"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.parentNode.innerHTML =
                        '<div class="w-full h-full flex items-center justify-center text-zinc-700 text-xl">▦</div>';
                    }}
                  />
                </div>
              </div>

              {/* Upload new */}
              <div className="flex-1">
                <p className="text-xs text-zinc-600 mb-1">New</p>
                <label className="flex flex-col items-center justify-center border border-dashed border-zinc-700 hover:border-amber-500/50 rounded px-4 py-5 cursor-pointer transition-colors group">
                  {preview ? (
                    <img src={preview} alt="new" className="h-10 object-contain" />
                  ) : (
                    <>
                      <span className="text-xl text-zinc-600 group-hover:text-amber-500/60 transition-colors mb-1">↑</span>
                      <span className="text-xs text-zinc-500">Upload new image</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {photoError && <p className="text-xs text-red-400">⚠ {photoError}</p>}
            {photoSuccess && <p className="text-xs text-emerald-400">✓ Photo updated</p>}

            <button
              type="submit"
              disabled={photoLoading || !photo}
              className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-xs uppercase tracking-widest font-bold rounded transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {photoLoading && (
                <span className="inline-block w-3 h-3 border border-zinc-500/40 border-t-zinc-300 rounded-full animate-spin" />
              )}
              Update Photo
            </button>
          </form>
        </section>
      </div>
    </div>
  );
} 
