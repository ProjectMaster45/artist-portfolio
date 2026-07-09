// pages/admin/InquiriesPage.jsx
// View all visitor inquiries, mark read/unread, delete, view detail

import { useState, useEffect, useCallback } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { inquiryAPI } from "../../services/api";
import LoadingSpinner from "../../components/shared/LoadingSpinner";
import toast from "react-hot-toast";

// ── Utility: format a date nicely ───────────────────────────────────────────
const formatDate = (iso) => {
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// ── Detail modal ─────────────────────────────────────────────────────────────
const InquiryModal = ({ inquiry, onClose, onToggleRead, onDelete }) => {
  if (!inquiry) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative bg-white w-full max-w-lg shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="font-display text-2xl font-light text-charcoal">
              {inquiry.name}
            </h2>
            <p className="text-sm text-slate/60 mt-0.5">{formatDate(inquiry.createdAt)}</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate/40 hover:text-charcoal transition-colors text-xl leading-none ml-4 mt-1"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Contact info */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-xs font-label tracking-widest uppercase text-slate/40 mb-0.5">Email</p>
              <a
                href={`mailto:${inquiry.email}`}
                className="text-gold hover:underline break-all"
              >
                {inquiry.email}
              </a>
            </div>
            {inquiry.phone && (
              <div>
                <p className="text-xs font-label tracking-widest uppercase text-slate/40 mb-0.5">Phone</p>
                <a href={`tel:${inquiry.phone}`} className="text-charcoal">
                  {inquiry.phone}
                </a>
              </div>
            )}
          </div>

          {/* Artwork interest */}
          {inquiry.artworkTitle && (
            <div>
              <p className="text-xs font-label tracking-widest uppercase text-slate/40 mb-0.5">
                Interested In
              </p>
              <p className="text-sm text-charcoal font-medium">{inquiry.artworkTitle}</p>
            </div>
          )}

          {/* Message */}
          <div>
            <p className="text-xs font-label tracking-widest uppercase text-slate/40 mb-1">Message</p>
            <p className="text-sm text-slate leading-relaxed whitespace-pre-wrap bg-gray-50 p-4">
              {inquiry.message}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50">
          <div className="flex gap-2">
            <button
              onClick={() => onToggleRead(inquiry)}
              className="text-xs px-3 py-2 border border-charcoal/20 font-label tracking-widest uppercase
                         hover:bg-charcoal hover:text-white transition-colors"
            >
              {inquiry.isRead ? "Mark Unread" : "Mark Read"}
            </button>
            <a
              href={`mailto:${inquiry.email}?subject=Re: Your enquiry about ${inquiry.artworkTitle || "your artwork interest"}`}
              className="text-xs px-3 py-2 bg-gold text-white font-label tracking-widest uppercase
                         hover:bg-gold-dark transition-colors"
            >
              Reply by Email
            </a>
          </div>
          <button
            onClick={() => onDelete(inquiry._id)}
            className="text-xs text-red-500 hover:text-red-700 font-label transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Main page ─────────────────────────────────────────────────────────────────
const InquiriesPage = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // all | unread | read
  const [selected, setSelected] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchInquiries = useCallback(async () => {
    setLoading(true);
    try {
      const params = { limit: 100 };
      if (search) params.search = search;
      if (filter === "unread") params.isRead = "false";
      if (filter === "read") params.isRead = "true";

      const res = await inquiryAPI.getAll(params);
      setInquiries(res.data.inquiries);
      setUnreadCount(res.data.unreadCount);
    } catch {
      toast.error("Failed to load inquiries");
    } finally {
      setLoading(false);
    }
  }, [search, filter]);

  useEffect(() => { fetchInquiries(); }, [fetchInquiries]);

  // Auto-mark as read when opening modal
  const openDetail = async (inq) => {
    setSelected(inq);
    if (!inq.isRead) {
      try {
        await inquiryAPI.toggleRead(inq._id);
        // Update local state
        setInquiries((prev) =>
          prev.map((i) => (i._id === inq._id ? { ...i, isRead: true } : i))
        );
        setUnreadCount((c) => Math.max(0, c - 1));
        setSelected((prev) => prev && { ...prev, isRead: true });
      } catch { /* silent */ }
    }
  };

  const handleToggleRead = async (inq) => {
    try {
      const res = await inquiryAPI.toggleRead(inq._id);
      const updated = res.data.inquiry;
      setInquiries((prev) => prev.map((i) => (i._id === inq._id ? updated : i)));
      setSelected(updated);
      setUnreadCount((c) => (updated.isRead ? Math.max(0, c - 1) : c + 1));
    } catch {
      toast.error("Failed to update inquiry");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this inquiry? This cannot be undone.")) return;
    try {
      await inquiryAPI.delete(id);
      setInquiries((prev) => prev.filter((i) => i._id !== id));
      setSelected(null);
      toast.success("Inquiry deleted");
    } catch {
      toast.error("Failed to delete inquiry");
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 md:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-label tracking-widest uppercase text-slate/50 mb-1">Manage</p>
            <h1 className="font-display text-3xl font-light text-charcoal flex items-center gap-3">
              Inquiries
              {unreadCount > 0 && (
                <span className="text-xs bg-gold text-white px-2 py-0.5 font-label rounded-full">
                  {unreadCount} new
                </span>
              )}
            </h1>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <input
              type="text"
              placeholder="Search by name, email, artwork…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-9"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Filter tabs */}
          <div className="flex gap-1 border border-gray-200 p-0.5 self-start">
            {[
              { key: "all", label: "All" },
              { key: "unread", label: "Unread" },
              { key: "read", label: "Read" },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-4 py-1.5 text-xs font-label tracking-widest uppercase transition-colors ${
                  filter === key
                    ? "bg-charcoal text-white"
                    : "text-slate/60 hover:text-charcoal"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        {loading ? (
          <div className="flex justify-center py-16">
            <LoadingSpinner size="lg" />
          </div>
        ) : inquiries.length === 0 ? (
          <div className="bg-white text-center py-16">
            <p className="font-display text-2xl text-charcoal mb-2">
              {filter === "unread" ? "No unread inquiries" : "No inquiries yet"}
            </p>
            <p className="text-slate/50 text-sm">
              {filter !== "all"
                ? "Try switching to 'All'"
                : "Inquiries from visitors will appear here"}
            </p>
          </div>
        ) : (
          <div className="bg-white shadow-sm overflow-hidden">
            {/* Table header */}
            <div className="hidden md:grid grid-cols-[auto_1fr_1fr_auto_auto] gap-4 px-4 py-2 border-b border-gray-100">
              {["", "Sender", "Artwork", "Date", "Actions"].map((h) => (
                <p key={h} className="text-xs font-label tracking-widest uppercase text-slate/40">
                  {h}
                </p>
              ))}
            </div>

            <div className="divide-y divide-gray-50">
              {inquiries.map((inq) => (
                <div
                  key={inq._id}
                  className={`flex md:grid md:grid-cols-[auto_1fr_1fr_auto_auto] items-center gap-4 px-4 py-3 
                              hover:bg-gray-50 transition-colors cursor-pointer flex-wrap
                              ${!inq.isRead ? "bg-gold/5" : ""}`}
                  onClick={() => openDetail(inq)}
                >
                  {/* Read indicator dot */}
                  <div className="flex-shrink-0">
                    <div
                      className={`w-2 h-2 rounded-full ${inq.isRead ? "bg-gray-200" : "bg-gold"}`}
                      title={inq.isRead ? "Read" : "Unread"}
                    />
                  </div>

                  {/* Sender */}
                  <div className="min-w-0">
                    <p className={`text-sm truncate ${!inq.isRead ? "font-medium text-charcoal" : "text-slate"}`}>
                      {inq.name}
                    </p>
                    <p className="text-xs text-slate/50 truncate">{inq.email}</p>
                  </div>

                  {/* Artwork */}
                  <div className="hidden md:block min-w-0">
                    <p className="text-xs text-slate/60 truncate">
                      {inq.artworkTitle || <em className="text-slate/30">General enquiry</em>}
                    </p>
                  </div>

                  {/* Date */}
                  <div className="hidden md:block flex-shrink-0">
                    <p className="text-xs text-slate/40">{formatDate(inq.createdAt)}</p>
                  </div>

                  {/* Inline actions (stop propagation so row click doesn't fire) */}
                  <div
                    className="flex gap-1 flex-shrink-0 ml-auto"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => handleToggleRead(inq)}
                      title={inq.isRead ? "Mark unread" : "Mark read"}
                      className="text-xs px-2 py-1 border border-gray-200 text-slate/50 hover:text-charcoal hover:border-charcoal transition-colors font-label"
                    >
                      {inq.isRead ? "↩" : "✓"}
                    </button>
                    <button
                      onClick={() => handleDelete(inq._id)}
                      title="Delete"
                      className="text-xs px-2 py-1 text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors font-label"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selected && (
        <InquiryModal
          inquiry={selected}
          onClose={() => setSelected(null)}
          onToggleRead={handleToggleRead}
          onDelete={(id) => handleDelete(id)}
        />
      )}
    </AdminLayout>
  );
};

export default InquiriesPage;
