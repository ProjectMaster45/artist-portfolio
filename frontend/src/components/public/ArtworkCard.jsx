// components/public/ArtworkCard.jsx
// Gallery card with polished hover actions and quick preview support.

import { Link } from "react-router-dom";

const ArtworkCard = ({ artwork, onPreview }) => {
  const thumbnail = artwork.images?.[0]?.url;
  const formattedPrice = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(artwork.price || 0);

  const handlePreview = (event) => {
    event.preventDefault();
    event.stopPropagation();
    onPreview?.(artwork);
  };

  return (
    <article className="group animate-fade-in">
      <div
        className="relative aspect-artwork overflow-hidden bg-white shadow-sm ring-1 ring-black/5 transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-xl"
        style={{ borderRadius: "var(--theme-card-radius)" }}
      >
        <Link to={`/artwork/${artwork._id}`} aria-label={`View ${artwork.title}`} className="block h-full">
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={artwork.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-slate/35">
              No image
            </div>
          )}
        </Link>

        <div className="absolute inset-0 bg-charcoal/0 transition-all duration-500 group-hover:bg-charcoal/30" />

        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          {artwork.isFeatured && (
            <span className="bg-gold text-white text-[10px] font-label tracking-widest uppercase px-2 py-1 shadow-sm">
              Featured
            </span>
          )}
          {!artwork.isAvailable && (
            <span className="bg-charcoal text-white text-[10px] font-label tracking-widest uppercase px-2 py-1 shadow-sm">
              Not Available
            </span>
          )}
        </div>

        <div className="absolute inset-x-3 bottom-3 translate-y-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handlePreview}
              className="bg-white/95 px-3 py-2 text-xs font-label tracking-widest uppercase text-charcoal hover:bg-gold hover:text-white transition-colors"
            >
              Preview
            </button>
            <Link
              to={`/artwork/${artwork._id}`}
              className="bg-charcoal/95 px-3 py-2 text-center text-xs font-label tracking-widest uppercase text-white hover:bg-gold transition-colors"
            >
              Details
            </Link>
          </div>
        </div>
      </div>

      <div className="pt-4 pb-2">
        <p className="text-[10px] font-label tracking-widest uppercase text-slate/60 mb-1">
          {artwork.category}
        </p>
        <Link to={`/artwork/${artwork._id}`}>
          <h3 className="font-display text-xl font-light text-charcoal group-hover:text-gold transition-colors leading-tight mb-2">
            {artwork.title}
          </h3>
        </Link>
        <div className="flex items-start justify-between gap-3">
          <p className="font-label text-sm font-medium text-charcoal">
            {formattedPrice}
          </p>
          {artwork.medium && (
            <p className="text-xs text-slate/50 text-right leading-relaxed">{artwork.medium}</p>
          )}
        </div>
      </div>
    </article>
  );
};

export default ArtworkCard;
