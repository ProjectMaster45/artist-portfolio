// pages/public/GalleryPage.jsx
// Full artwork gallery with search, filters, quick preview, and polished pagination.

import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import PublicLayout from "../../components/public/PublicLayout";
import ArtworkCard from "../../components/public/ArtworkCard";
import ArtworkPreviewModal from "../../components/public/ArtworkPreviewModal";
import LoadingSpinner from "../../components/shared/LoadingSpinner";
import { publicDataAPI } from "../../services/publicData";

const formatPrice = (price) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price || 0);

const GalleryPreview = ({ artwork, onClose }) => {
  if (!artwork) return null;
  return <ArtworkPreviewModal artwork={artwork} onClose={onClose} />;
};

const FilterBadge = ({ label, onRemove }) => (
  <button
    type="button"
    onClick={onRemove}
    className="inline-flex items-center gap-2 bg-white px-3 py-2 text-xs font-label tracking-widest uppercase text-charcoal ring-1 ring-charcoal/10 hover:ring-gold hover:text-gold transition-colors"
  >
    {label}
    <span aria-hidden="true">x</span>
  </button>
);

const GalleryPage = () => {
  const [artworks, setArtworks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState(null);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [available, setAvailable] = useState("all");
  const [page, setPage] = useState(1);

  const fetchArtworks = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 12 };
      if (search) params.search = search;
      if (category !== "all") params.category = category;
      if (available !== "all") params.available = available;

      const res = await publicDataAPI.getArtworks(params);
      setArtworks(res.items || []);
      setPagination(res.pagination || {});
    } catch (err) {
      console.error("Gallery fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [search, category, available, page]);

  useEffect(() => {
    publicDataAPI.getCategories()
      .then((items) => setCategories(items || []))
      .catch(console.error);
  }, []);

  useEffect(() => {
    fetchArtworks();
  }, [fetchArtworks]);

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setPreview(null);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  const resetFilters = () => {
    setSearch("");
    setCategory("all");
    setAvailable("all");
    setPage(1);
  };

  const activeFilterCount = [search, category !== "all", available !== "all"].filter(Boolean).length;
  const availableLabel = available === "true" ? "Available for Enquiry" : available === "false" ? "Not Available for Enquiry" : "";

  return (
    <PublicLayout>
      <div className="bg-charcoal pt-28 pb-16">
        <div className="container-site text-center">
          <p className="eyebrow text-gold mb-3">Complete Collection</p>
          <h1 className="font-display text-5xl md:text-7xl font-light text-white">
            The Gallery
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-sm md:text-base text-white/60 leading-relaxed">
            Browse original artworks by mood, medium, availability, and collection.
          </p>
        </div>
      </div>

      <section className="section bg-ivory">
        <div className="container-site">
          <div className="mb-8 bg-ivory/95 py-4 backdrop-blur supports-[backdrop-filter]:bg-ivory/80 lg:sticky lg:top-20 lg:z-30">
            <div
              className="bg-white p-4 shadow-sm ring-1 ring-black/5"
              style={{ borderRadius: "var(--theme-card-radius)" }}
            >
              <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_220px_220px_auto]">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search artworks..."
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    className="input-field pl-10"
                  />
                  <svg
                    className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>

                <select
                  value={category}
                  onChange={(e) => { setCategory(e.target.value); setPage(1); }}
                  className="input-field"
                >
                  <option value="all">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>

                <select
                  value={available}
                  onChange={(e) => { setAvailable(e.target.value); setPage(1); }}
                  className="input-field"
                >
                  <option value="all">All Availability</option>
                  <option value="true">Available for Enquiry</option>
                  <option value="false">Not Available for Enquiry</option>
                </select>

                <button
                  type="button"
                  onClick={resetFilters}
                  className="btn-secondary whitespace-nowrap"
                  disabled={activeFilterCount === 0}
                >
                  Clear
                </button>
              </div>

              <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <p className="text-sm text-slate/60">
                  {pagination.total !== undefined
                    ? `${pagination.total} artwork${pagination.total === 1 ? "" : "s"} found`
                    : "Searching the collection"}
                </p>
                {activeFilterCount > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {search && <FilterBadge label={`Search: ${search}`} onRemove={() => { setSearch(""); setPage(1); }} />}
                    {category !== "all" && <FilterBadge label={category} onRemove={() => { setCategory("all"); setPage(1); }} />}
                    {available !== "all" && <FilterBadge label={availableLabel} onRemove={() => { setAvailable("all"); setPage(1); }} />}
                  </div>
                )}
              </div>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {Array.from({ length: 8 }, (_, index) => (
                <div key={index} className="animate-pulse">
                  <div
                    className="aspect-artwork bg-white/80 ring-1 ring-black/5"
                    style={{ borderRadius: "var(--theme-card-radius)" }}
                  />
                  <div className="mt-4 h-3 w-1/3 bg-white" />
                  <div className="mt-3 h-5 w-2/3 bg-white" />
                </div>
              ))}
            </div>
          ) : artworks.length === 0 ? (
            <div
              className="bg-white py-20 text-center shadow-sm ring-1 ring-black/5"
              style={{ borderRadius: "var(--theme-card-radius)" }}
            >
              <p className="font-display text-3xl text-charcoal mb-3">No artworks found</p>
              <p className="text-slate/60 text-sm">Try adjusting your search or filters.</p>
              <button type="button" onClick={resetFilters} className="mt-6 btn-secondary">
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {artworks.map((artwork) => (
                <ArtworkCard
                  key={artwork._id}
                  artwork={artwork}
                  onPreview={() => setPreview(artwork)}
                />
              ))}
            </div>
          )}

          {pagination.pages > 1 && (
            <div className="mt-12 flex flex-col items-center gap-4">
              <p className="text-xs text-slate/45">
                Page {page} of {pagination.pages}
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 border border-charcoal/20 text-sm font-label disabled:opacity-30 hover:bg-charcoal hover:text-white transition-colors"
                >
                  Prev
                </button>
                {Array.from({ length: pagination.pages }, (_, i) => i + 1)
                  .filter((p) => pagination.pages <= 7 || p === 1 || p === pagination.pages || Math.abs(p - page) <= 1)
                  .map((p, index, visiblePages) => {
                    const previous = visiblePages[index - 1];
                    const showGap = previous && p - previous > 1;
                    return (
                      <span key={p} className="flex gap-2">
                        {showGap && <span className="px-2 py-2 text-sm text-slate/40">...</span>}
                        <button
                          type="button"
                          onClick={() => setPage(p)}
                          className={`px-4 py-2 text-sm font-label transition-colors ${
                            p === page
                              ? "bg-charcoal text-white"
                              : "border border-charcoal/20 hover:bg-charcoal hover:text-white"
                          }`}
                        >
                          {p}
                        </button>
                      </span>
                    );
                  })}
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                  disabled={page === pagination.pages}
                  className="px-4 py-2 border border-charcoal/20 text-sm font-label disabled:opacity-30 hover:bg-charcoal hover:text-white transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      <GalleryPreview artwork={preview} onClose={() => setPreview(null)} />
    </PublicLayout>
  );
};

export default GalleryPage;
