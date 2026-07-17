// pages/public/ContactPage.jsx
// Contact form + artist contact info + social links

import { useState, useEffect } from "react";
import PublicLayout from "../../components/public/PublicLayout";
import { publicDataAPI } from "../../services/publicData";
import { submitNetlifyForm } from "../../services/netlifyForms";
import LoadingSpinner from "../../components/shared/LoadingSpinner";
import toast from "react-hot-toast";

const ContactPage = () => {
  const [profile, setProfile] = useState(null);
  const [artworks, setArtworks] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "", email: "", phone: "", message: "", artworkId: "",
  });

  useEffect(() => {
    Promise.all([
      publicDataAPI.getProfile(),
      publicDataAPI.getArtworks({ available: "true", limit: 100 }),
    ])
      .then(([profileRes, artworksRes]) => {
        setProfile(profileRes);
        setArtworks(artworksRes.items || []);
      })
      .catch(console.error);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in all required fields");
      return;
    }
    setSubmitting(true);
    try {
      const selectedArtwork = artworks.find((artwork) => artwork._id === form.artworkId);
      await submitNetlifyForm("contact", {
        name: form.name,
        email: form.email,
        phone: form.phone,
        message: form.message,
        artworkId: form.artworkId || undefined,
        artworkTitle: selectedArtwork?.title || "General Enquiry",
      });
      toast.success("Message sent! Expect a reply within 1–2 days.");
      setForm({ name: "", email: "", phone: "", message: "", artworkId: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send message");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PublicLayout>
      {/* Header */}
      <div className="bg-charcoal pt-28 pb-16">
        <div className="container-site text-center">
          <p className="eyebrow text-gold mb-3">Get in Touch</p>
          <h1 className="font-display text-5xl md:text-6xl font-light text-white">
            Contact
          </h1>
        </div>
      </div>

      <section className="section bg-ivory">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* ── Contact Info ───────────────────────────── */}
            <div>
              <p className="eyebrow mb-6">Reach Out</p>
              <h2 className="font-display text-3xl md:text-4xl font-light text-charcoal mb-6">
                Let's discuss your interest in a piece
              </h2>
              <p className="text-slate font-light leading-relaxed mb-10">
                Whether you're interested in an existing artwork, a commission, or simply want
                to know more about the creative process — I'd love to hear from you.
              </p>

              <div className="space-y-5">
                {profile?.email && (
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 border border-gold/30 flex items-center justify-center text-gold flex-shrink-0">
                      ✉
                    </div>
                    <div>
                      <p className="text-xs font-label tracking-widest uppercase text-slate/50 mb-0.5">Email</p>
                      <a href={`mailto:${profile.email}`}
                        className="text-charcoal hover:text-gold transition-colors">
                        {profile.email}
                      </a>
                    </div>
                  </div>
                )}

                {profile?.phone && (
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 border border-gold/30 flex items-center justify-center text-gold flex-shrink-0">
                      ☎
                    </div>
                    <div>
                      <p className="text-xs font-label tracking-widest uppercase text-slate/50 mb-0.5">Phone</p>
                      <a href={`tel:${profile.phone}`}
                        className="text-charcoal hover:text-gold transition-colors">
                        {profile.phone}
                      </a>
                    </div>
                  </div>
                )}

                {profile?.whatsapp && (
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 border border-gold/30 flex items-center justify-center text-gold flex-shrink-0">
                      💬
                    </div>
                    <div>
                      <p className="text-xs font-label tracking-widest uppercase text-slate/50 mb-0.5">WhatsApp</p>
                      <a href={`https://wa.me/${profile.whatsapp.replace(/\D/g, "")}`}
                        target="_blank" rel="noopener noreferrer"
                        className="text-charcoal hover:text-gold transition-colors">
                        Message on WhatsApp
                      </a>
                    </div>
                  </div>
                )}

                {profile?.address && (
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 border border-gold/30 flex items-center justify-center text-gold flex-shrink-0 mt-0.5">
                      ⌖
                    </div>
                    <div>
                      <p className="text-xs font-label tracking-widest uppercase text-slate/50 mb-0.5">Location</p>
                      <p className="text-charcoal">{profile.address}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Social links */}
              {(profile?.instagram || profile?.facebook || profile?.youtube) && (
                <div className="mt-10 flex gap-4">
                  {profile.instagram && (
                    <a href={profile.instagram} target="_blank" rel="noopener noreferrer"
                      className="text-xs font-label tracking-widest uppercase border border-charcoal/20 px-4 py-2 hover:bg-charcoal hover:text-white transition-colors">
                      Instagram
                    </a>
                  )}
                  {profile.facebook && (
                    <a href={profile.facebook} target="_blank" rel="noopener noreferrer"
                      className="text-xs font-label tracking-widest uppercase border border-charcoal/20 px-4 py-2 hover:bg-charcoal hover:text-white transition-colors">
                      Facebook
                    </a>
                  )}
                  {profile.youtube && (
                    <a href={profile.youtube} target="_blank" rel="noopener noreferrer"
                      className="text-xs font-label tracking-widest uppercase border border-charcoal/20 px-4 py-2 hover:bg-charcoal hover:text-white transition-colors">
                      YouTube
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* ── Inquiry Form ───────────────────────────── */}
            <div>
              <form onSubmit={handleSubmit} className="bg-white p-8 shadow-sm">
                <h3 className="font-display text-2xl font-light mb-6">Send a Message</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-label tracking-widest uppercase text-slate/60 block mb-1">
                        Name *
                      </label>
                      <input type="text" value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="input-field" required />
                    </div>
                    <div>
                      <label className="text-xs font-label tracking-widest uppercase text-slate/60 block mb-1">
                        Email *
                      </label>
                      <input type="email" value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="input-field" required />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-label tracking-widest uppercase text-slate/60 block mb-1">
                      Phone
                    </label>
                    <input type="tel" value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="input-field" />
                  </div>

                  <div>
                    <label className="text-xs font-label tracking-widest uppercase text-slate/60 block mb-1">
                      Interested in Artwork
                    </label>
                    <select value={form.artworkId}
                      onChange={(e) => setForm({ ...form, artworkId: e.target.value })}
                      className="input-field">
                      <option value="">General Enquiry</option>
                      {artworks.map((aw) => (
                        <option key={aw._id} value={aw._id}>{aw.title}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-label tracking-widest uppercase text-slate/60 block mb-1">
                      Message *
                    </label>
                    <textarea value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="textarea-field" rows={5} required
                      placeholder="Tell me about your interest…" />
                  </div>

                  <button type="submit" disabled={submitting}
                    className="btn-primary w-full flex items-center justify-center gap-2">
                    {submitting ? <><LoadingSpinner size="sm" light />Sending…</> : "Send Message"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default ContactPage;
