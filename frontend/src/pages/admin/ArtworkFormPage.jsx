// pages/admin/ArtworkFormPage.jsx
// Shared form for creating a new artwork AND editing an existing one.
// Route: /admin/artworks/new  →  create mode
// Route: /admin/artworks/:id/edit  →  edit mode

import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";
import { artworkAPI } from "../../services/api";
import LoadingSpinner from "../../components/shared/LoadingSpinner";
import toast from "react-hot-toast";

// ─── Empty form defaults ──────────────────────────────────────────────────────
const EMPTY_FORM = {
  title: "",
  description: "",
  category: "",
  price: "",
  medium: "",
  dimensions: "",
  year: "",
  isAvailable: true,
  isFeatured: false,
};

const ArtworkFormPage = () => {
  const { id } = useParams();           // undefined in create mode
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(EMPTY_FORM);
  const [existingImages, setExistingImages] = useState([]); // already on Cloudinary
  const [newFiles, setNewFiles] = useState([]);              // File objects to upload
  const [previews, setPreviews] = useState([]);              // local blob URLs
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [deletingImg, setDeletingImg] = useState(null);
  const fileInputRef = useRef();

  // ── Load existing artwork when in edit mode ──────────────────────────────
  useEffect(() => {
    if (!isEdit) return;
    artworkAPI.getById(id)
      .then((res) => {
        const a = res.data.artwork;
        setForm({
          title: a.title || "",
          description: a.description || "",
          category: a.category || "",
          price: a.price ?? "",
          medium: a.medium || "",
          dimensions: a.dimensions || "",
          year: a.year ?? "",
          isAvailable: a.isAvailable,
          isFeatured: a.isFeatured,
        });
        setExistingImages(a.images || []);
      })
      .catch(() => toast.error("Failed to load artwork"))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  // ── Cleanup blob URLs on unmount ─────────────────────────────────────────
  useEffect(() => {
    return () => previews.forEach(URL.revokeObjectURL);
  }, [previews]);

  // ── File picker handler ──────────────────────────────────────────────────
  const handleFiles = (e) => {
    const picked = Array.from(e.target.files || []);
    if (!picked.length) return;

    previews.forEach(URL.revokeObjectURL);
    const file = picked[0];
    setNewFiles([file]);
    setPreviews([URL.createObjectURL(file)]);
    // Reset input so same file can be re-picked if removed
    fileInputRef.current.value = "";
  };

  // ── Remove a locally-staged image (not yet uploaded) ────────────────────
  const removeNewFile = (index) => {
    URL.revokeObjectURL(previews[index]);
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // ── Delete an already-uploaded Cloudinary image ──────────────────────────
  const handleDeleteExisting = async (publicId) => {
    if (!window.confirm("Remove this image? This cannot be undone.")) return;
    setDeletingImg(publicId);
    try {
      await artworkAPI.deleteImage(id, publicId);
      setExistingImages((prev) => prev.filter((img) => img.publicId !== publicId));
      toast.success("Image removed");
    } catch {
      toast.error("Failed to remove image");
    } finally {
      setDeletingImg(null);
    }
  };

  // ── Field change helper ──────────────────────────────────────────────────
  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  // ── Submit ───────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) { toast.error("Title is required"); return; }
    if (!form.category.trim()) { toast.error("Category is required"); return; }
    if (form.price === "" || isNaN(Number(form.price))) { toast.error("A valid price is required"); return; }

    setSaving(true);
    try {
      if (isEdit) {
        // 1. Update metadata fields
        await artworkAPI.update(id, {
          title: form.title,
          description: form.description,
          category: form.category,
          price: form.price,
          medium: form.medium,
          dimensions: form.dimensions,
          year: form.year,
          isAvailable: form.isAvailable,
          isFeatured: form.isFeatured,
        });

        // 2. Upload any newly staged images
        if (newFiles.length > 0) {
          const imgData = new FormData();
          imgData.append("images", newFiles[0]);
          await artworkAPI.addImages(id, imgData);
        }

        toast.success("Artwork updated");
        navigate("/admin/artworks");
      } else {
        // Create mode — send everything in one multipart request
        if (newFiles.length === 0) {
          toast.error("Please add at least one image");
          return;
        }
        const formData = new FormData();
        Object.entries(form).forEach(([k, v]) => formData.append(k, v));
        formData.append("images", newFiles[0]);

        await artworkAPI.create(formData);
        toast.success("Artwork created!");
        navigate("/admin/artworks");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save artwork");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-8 flex justify-center"><LoadingSpinner size="lg" /></div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 md:p-8 max-w-4xl">
        {/* ── Header ─────────────────────────────────────────── */}
        <div className="flex items-center gap-3 mb-8">
          <Link to="/admin/artworks" className="text-slate/50 hover:text-charcoal transition-colors text-sm">
            ← Artworks
          </Link>
          <span className="text-slate/30">/</span>
          <h1 className="font-display text-3xl font-light text-charcoal">
            {isEdit ? "Edit Artwork" : "New Artwork"}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ── Basic Information ──────────────────────────────── */}
          <div className="bg-white p-6 shadow-sm">
            <h2 className="font-display text-xl font-light mb-5">Basic Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* Title */}
              <div className="sm:col-span-2">
                <label className="text-xs font-label tracking-widest uppercase text-slate/60 block mb-1">
                  Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => set("title", e.target.value)}
                  className="input-field"
                  placeholder="e.g. Crimson Horizon"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="text-xs font-label tracking-widest uppercase text-slate/60 block mb-1">
                  Category <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={form.category}
                  onChange={(e) => set("category", e.target.value)}
                  className="input-field"
                  placeholder="e.g. Landscape, Portrait, Abstract"
                  list="category-suggestions"
                  required
                />
                <datalist id="category-suggestions">
                  {["Landscape", "Portrait", "Abstract", "Still Life", "Figurative", "Seascape", "Cityscape", "Wildlife"].map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </div>

              {/* Price */}
              <div>
                <label className="text-xs font-label tracking-widest uppercase text-slate/60 block mb-1">
                  Price (₹) <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={form.price}
                  onChange={(e) => set("price", e.target.value)}
                  className="input-field"
                  placeholder="e.g. 25000"
                  required
                />
              </div>

              {/* Medium */}
              <div>
                <label className="text-xs font-label tracking-widest uppercase text-slate/60 block mb-1">
                  Medium
                </label>
                <input
                  type="text"
                  value={form.medium}
                  onChange={(e) => set("medium", e.target.value)}
                  className="input-field"
                  placeholder="e.g. Oil on Canvas"
                  list="medium-suggestions"
                />
                <datalist id="medium-suggestions">
                  {["Oil on Canvas", "Acrylic on Canvas", "Watercolour on Paper", "Mixed Media", "Charcoal on Paper", "Pastel on Board"].map((m) => (
                    <option key={m} value={m} />
                  ))}
                </datalist>
              </div>

              {/* Dimensions */}
              <div>
                <label className="text-xs font-label tracking-widest uppercase text-slate/60 block mb-1">
                  Dimensions
                </label>
                <input
                  type="text"
                  value={form.dimensions}
                  onChange={(e) => set("dimensions", e.target.value)}
                  className="input-field"
                  placeholder='e.g. 24" × 36" or 60 × 90 cm'
                />
              </div>

              {/* Year */}
              <div>
                <label className="text-xs font-label tracking-widest uppercase text-slate/60 block mb-1">
                  Year
                </label>
                <input
                  type="number"
                  min="1900"
                  max={new Date().getFullYear()}
                  value={form.year}
                  onChange={(e) => set("year", e.target.value)}
                  className="input-field"
                  placeholder={new Date().getFullYear()}
                />
              </div>

              {/* Description */}
              <div className="sm:col-span-2">
                <label className="text-xs font-label tracking-widest uppercase text-slate/60 block mb-1">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  className="textarea-field"
                  rows={4}
                  placeholder="Describe the artwork, its inspiration, or technique…"
                />
              </div>
            </div>
          </div>

          {/* ── Status Toggles ─────────────────────────────────── */}
          <div className="bg-white p-6 shadow-sm">
            <h2 className="font-display text-xl font-light mb-5">Status</h2>
            <div className="flex flex-col sm:flex-row gap-6">
              {/* Available toggle */}
              <label className="flex items-center gap-3 cursor-pointer">
                <div
                  onClick={() => set("isAvailable", !form.isAvailable)}
                  className={`relative w-11 h-6 rounded-full transition-colors duration-200 cursor-pointer ${
                    form.isAvailable ? "bg-green-500" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
                      form.isAvailable ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-charcoal">Available for Enquiry</p>
                  <p className="text-xs text-slate/50">
                    {form.isAvailable ? "Shown as 'Available for Enquiry'" : "Shown as 'Not Available for Enquiry'"}
                  </p>
                </div>
              </label>

              {/* Featured toggle */}
              <label className="flex items-center gap-3 cursor-pointer">
                <div
                  onClick={() => set("isFeatured", !form.isFeatured)}
                  className={`relative w-11 h-6 rounded-full transition-colors duration-200 cursor-pointer ${
                    form.isFeatured ? "bg-gold" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
                      form.isFeatured ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-charcoal">Featured on Homepage</p>
                  <p className="text-xs text-slate/50">
                    {form.isFeatured ? "Visible in featured section" : "Not featured"}
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* ── Images ─────────────────────────────────────────── */}
          <div className="bg-white p-6 shadow-sm">
            <h2 className="font-display text-xl font-light mb-5">
              Images
              {!isEdit && <span className="text-red-400 text-sm ml-2">*</span>}
            </h2>

            {/* Already-saved images (edit mode only) */}
            {isEdit && existingImages.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-label tracking-widest uppercase text-slate/50 mb-3">
                  Current Images
                </p>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {existingImages.map((img) => (
                    <div key={img.publicId} className="relative group">
                      <img
                        src={img.url}
                        alt=""
                        className="w-full aspect-square object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteExisting(img.publicId)}
                        disabled={deletingImg === img.publicId}
                        className="absolute top-1 right-1 w-6 h-6 bg-red-600 text-white text-xs 
                                   opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                        title="Remove image"
                      >
                        {deletingImg === img.publicId ? "…" : "×"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Newly staged images */}
            {previews.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-label tracking-widest uppercase text-slate/50 mb-3">
                  {isEdit ? "Images to Add" : "Selected Images"}
                </p>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {previews.map((src, i) => (
                    <div key={i} className="relative group">
                      <img
                        src={src}
                        alt=""
                        className="w-full aspect-square object-cover opacity-80"
                      />
                      <button
                        type="button"
                        onClick={() => removeNewFile(i)}
                        className="absolute top-1 right-1 w-6 h-6 bg-red-600 text-white text-xs 
                                   opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                        title="Remove"
                      >
                        ×
                      </button>
                      {/* "New" badge */}
                      <span className="absolute bottom-1 left-1 text-[9px] bg-gold text-white px-1 font-label uppercase">
                        New
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload area */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-200 hover:border-gold p-8 text-center cursor-pointer transition-colors duration-200"
            >
              <p className="text-3xl mb-2">📁</p>
              <p className="text-sm text-slate/60 mb-1">
                Click to select one image
              </p>
              <p className="text-xs text-slate/40">JPG, PNG, or WebP. Use Bulk Add to create many artworks.</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFiles}
              />
            </div>

            {!isEdit && newFiles.length === 0 && (
              <p className="text-xs text-red-400 mt-2">At least one image is required</p>
            )}
          </div>

          {/* ── Actions ────────────────────────────────────────── */}
          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={saving}
              className="btn-primary flex items-center gap-2"
            >
              {saving
                ? <><LoadingSpinner size="sm" light />{isEdit ? "Saving…" : "Creating…"}</>
                : isEdit ? "Save Changes" : "Create Artwork"
              }
            </button>
            <Link to="/admin/artworks" className="btn-secondary">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default ArtworkFormPage;
