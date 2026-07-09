// components/shared/LoadingSpinner.jsx

const LoadingSpinner = ({ size = "md", light = false }) => {
  const sizes = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-2",
    lg: "w-12 h-12 border-3",
  };

  const colorClass = light
    ? "border-white/20 border-t-white"
    : "border-gray-200 border-t-gold";

  return (
    <div
      className={`${sizes[size]} ${colorClass} rounded-full animate-spin`}
      role="status"
      aria-label="Loading"
    />
  );
};

export const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-ivory">
    <div className="flex flex-col items-center gap-4">
      <LoadingSpinner size="lg" />
      <p className="text-sm text-slate font-label tracking-widest uppercase">Loading</p>
    </div>
  </div>
);

export default LoadingSpinner;
