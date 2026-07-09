const ArtworkPreviewModal = ({ artwork, onClose }) => {
  if (!artwork) return null;
  const image = artwork.images?.[0]?.url;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-6xl overflow-hidden rounded-3xl shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 h-10 w-10 rounded-full bg-white/95 text-charcoal shadow transition-colors hover:bg-charcoal hover:text-white"
          aria-label="Close preview"
        >
          ×
        </button>
        <div className="bg-black">
          {image ? (
            <img
              src={image}
              alt={artwork.title}
              className="h-[80vh] w-full object-contain bg-black"
            />
          ) : (
            <div className="flex h-[60vh] items-center justify-center bg-slate-900 text-white">
              No preview available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArtworkPreviewModal;
