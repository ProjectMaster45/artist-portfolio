// pages/public/ArtworkDetailPage.jsx
// Single artwork — large image gallery, details, inquiry form

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import PublicLayout from "../../components/public/PublicLayout";
import { publicDataAPI } from "../../services/publicData";
import { submitNetlifyForm } from "../../services/netlifyForms";
import { PageLoader } from "../../components/shared/LoadingSpinner";
import LoadingSpinner from "../../components/shared/LoadingSpinner";
import toast from "react-hot-toast";

const ArtworkDetailPage = () => {
  const { id } = useParams();
  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [showInquiry, setShowInquiry] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "", email: "", phone: "", message: "",
  });

  useEffect(() => {
    publicDataAPI.getArtworkById(id)
      .then((item) => {
        if (!item) throw new Error("Artwork not found");
        setArtwork(item);
      })
      .catch(() => toast.error("Artwork not found"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in all required fields");
      return;
    }
    setSubmitting(true);
    try {
      await submitNetlifyForm("artwork-inquiry", {
        ...form,
        artworkId: artwork._id,
        artworkTitle: artwork.title,
      });
      toast.success("Inquiry sent! The artist will be in touch soon.");
      setForm({ name: "", email: "", phone: "", message: "" });
      setShowInquiry(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send inquiry");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <PageLoader />;
  if (!artwork) return (
    <PublicLayout>
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="font-display text-3xl mb-4">Artwork not found</p>
          <Link to="/gallery" className="btn-primary">Back to Gallery</Link>
        </div>
      </div>
    </PublicLayout>
  );

  const formattedPrice = new Intl.NumberFormat("en-IN", {
    style: "currency", currency: "INR", maximumFractionDigits: 0,
  }).format(artwork.price);

  return (
    <PublicLayout>
      <div className="pt-20 bg-white min-h-screen">
        <div className="container-site py-12">
          {/* Breadcrumb */}
          <nav className="mb-8 text-sm text-slate/60 font-label">
            <Link to="/gallery" className="hover:text-gold transition-colors">Gallery</Link>
            <span className="mx-2">/</span>
            <span className="text-charcoal">{artwork.title}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* ── Image Gallery ───────────────────────────── */}
            <div>
              {/* Main Image */}
              <div className="aspect-artwork bg-gray-50 overflow-hidden mb-4">
                {artwork.images?.[activeImage]?.url ? (
                  <img
                    src={artwork.images[activeImage].url}
                    alt={`${artwork.title} — image ${activeImage + 1}`}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-gray-200 text-8xl">🖼</span>
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {artwork.images?.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {artwork.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`flex-shrink-0 w-16 h-16 overflow-hidden border-2 transition-all ${
                        i === activeImage ? "border-gold" : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img src={img.url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ── Details ─────────────────────────────────── */}
            <div className="flex flex-col">
              <p className="eyebrow mb-3">{artwork.category}</p>
              <h1 className="font-display text-4xl md:text-5xl font-light text-charcoal mb-4 leading-tight">
                {artwork.title}
              </h1>

              {/* Availability badge */}
              <span className={`self-start text-xs font-label tracking-widest uppercase px-3 py-1 mb-6 ${
                artwork.isAvailable ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
              }`}>
                {artwork.isAvailable ? "Available for Enquiry" : "Not Available for Enquiry"}
              </span>

              {/* Price */}
              <p className="font-display text-3xl text-charcoal mb-8">{formattedPrice}</p>

              {/* Metadata */}
              <div className="grid grid-cols-2 gap-4 mb-8 border-t border-b border-gray-100 py-6">
                {artwork.medium && (
                  <div>
                    <p className="text-xs font-label text-slate/50 tracking-widest uppercase mb-1">Medium</p>
                    <p className="text-sm text-charcoal">{artwork.medium}</p>
                  </div>
                )}
                {artwork.dimensions && (
                  <div>
                    <p className="text-xs font-label text-slate/50 tracking-widest uppercase mb-1">Dimensions</p>
                    <p className="text-sm text-charcoal">{artwork.dimensions}</p>
                  </div>
                )}
                {artwork.year && (
                  <div>
                    <p className="text-xs font-label text-slate/50 tracking-widest uppercase mb-1">Year</p>
                    <p className="text-sm text-charcoal">{artwork.year}</p>
                  </div>
                )}
              </div>

              {/* Description */}
              {artwork.description && (
                <p className="text-slate leading-relaxed mb-8 font-light">{artwork.description}</p>
              )}

              {/* Inquiry Button */}
              {artwork.isAvailable && (
                <button
                  onClick={() => setShowInquiry(!showInquiry)}
                  className="btn-gold self-start"
                >
                  {showInquiry ? "Close Inquiry Form" : "Send an Enquiry"}
                </button>
              )}

              {/* ── Inline Inquiry Form ──────────────────── */}
              {showInquiry && (
                <form onSubmit={handleSubmit} className="mt-8 border border-gray-100 p-6 animate-slide-up">
                  <h3 className="font-display text-xl mb-4">Enquire about "{artwork.title}"</h3>
                  <div className="space-y-4">
                    <input type="text" placeholder="Your Name *" value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="input-field" required />
                    <input type="email" placeholder="Your Email *" value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="input-field" required />
                    <input type="tel" placeholder="Phone (optional)" value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="input-field" />
                    <textarea placeholder="Your message *" value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="textarea-field" rows={4} required />
                    <button type="submit" disabled={submitting} className="btn-primary w-full flex items-center justify-center gap-2">
                      {submitting ? <><LoadingSpinner size="sm" light />Sending…</> : "Send Enquiry"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default ArtworkDetailPage;
