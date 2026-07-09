// pages/admin/DashboardPage.jsx
// Overview stats, quick actions, notifications, and recent activity.

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";
import { activityAPI, artworkAPI, inquiryAPI } from "../../services/api";
import LoadingSpinner from "../../components/shared/LoadingSpinner";

const formatDate = (value) => {
  if (!value) return "-";
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
};

const StatCard = ({ label, value, sub, to, tone = "gold" }) => (
  <Link
    to={to}
    className="group relative overflow-hidden bg-white p-6 shadow-sm ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
  >
    <div
      className={`absolute right-0 top-0 h-full w-1 ${
        tone === "green" ? "bg-sage" : tone === "dark" ? "bg-charcoal" : "bg-gold"
      }`}
    />
    <p className="text-xs font-label tracking-widest uppercase text-slate/50 mb-2">{label}</p>
    <p className="font-display text-5xl font-light text-charcoal leading-none mb-3">{value}</p>
    {sub && <p className="text-xs text-slate/55 leading-relaxed">{sub}</p>}
    <div className="mt-5 h-px bg-gray-100">
      <div className="h-px bg-gold w-10 transition-all duration-500 group-hover:w-full" />
    </div>
  </Link>
);

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      artworkAPI.getAll({ limit: 1 }),
      artworkAPI.getAll({ available: "true", limit: 1 }),
      artworkAPI.getAll({ available: "false", limit: 1 }),
      artworkAPI.getAll({ featured: "true", limit: 1 }),
      inquiryAPI.getAll({ limit: 1 }),
      inquiryAPI.getAll({ isRead: "false", limit: 1 }),
      activityAPI.getAll({ limit: 6 }),
    ])
      .then(([all, avail, sold, feat, inq, unread, activity]) => {
        setStats({
          total: all.data.pagination.total,
          available: avail.data.pagination.total,
          notAvailable: sold.data.pagination.total,
          featured: feat.data.pagination.total,
          inquiries: inq.data.pagination.total,
          unread: unread.data.pagination.total,
        });
        setActivities(activity.data.activities || activity.data.data?.activities || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout>
      <div className="p-6 md:p-8">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-label tracking-widest uppercase text-slate/50 mb-1">Overview</p>
            <h1 className="font-display text-4xl font-light text-charcoal">Dashboard</h1>
            <p className="text-sm text-slate/55 mt-2">
              A quick pulse of the portfolio, inquiries, and recent admin activity.
            </p>
          </div>

          {stats?.unread > 0 && (
            <Link
              to="/admin/inquiries"
              className="bg-gold/10 text-charcoal px-4 py-3 ring-1 ring-gold/25 transition-colors hover:bg-gold/15"
            >
              <span className="block text-xs font-label tracking-widest uppercase text-gold">
                Needs Attention
              </span>
              <span className="text-sm">
                {stats.unread} unread inquiry{stats.unread === 1 ? "" : "ies"}
              </span>
            </Link>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              <StatCard
                label="Total Artworks"
                value={stats?.total ?? 0}
                sub="Published in the collection"
                to="/admin/artworks"
                tone="dark"
              />
              <StatCard
                label="Available for Enquiry"
                value={stats?.available ?? 0}
                sub="Ready for enquiry"
                to="/admin/artworks"
                tone="green"
              />
              <StatCard
                label="Featured"
                value={stats?.featured ?? 0}
                sub="Shown in key public sections"
                to="/admin/artworks"
              />
              <StatCard
                label="Unread Inquiries"
                value={stats?.unread ?? 0}
                sub={stats?.unread > 0 ? "Waiting for a response" : "All caught up"}
                to="/admin/inquiries"
              />
            </div>

            <div className="mt-8 grid grid-cols-1 xl:grid-cols-[1.15fr_0.85fr] gap-6">
              <div className="bg-white shadow-sm ring-1 ring-black/5 p-6">
                <div className="mb-5">
                  <p className="text-xs font-label tracking-widest uppercase text-slate/50 mb-1">Quick Actions</p>
                  <h2 className="font-display text-2xl font-light text-charcoal">Manage the portfolio</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Link to="/admin/artworks/new" className="border border-gray-100 p-4 hover:border-gold hover:bg-gold/5 transition-colors">
                    <span className="block text-sm font-medium text-charcoal">Add Artwork</span>
                    <span className="block text-xs text-slate/50 mt-1">Upload a new piece</span>
                  </Link>
                  <Link to="/admin/inquiries" className="border border-gray-100 p-4 hover:border-gold hover:bg-gold/5 transition-colors">
                    <span className="block text-sm font-medium text-charcoal">Review Inquiries</span>
                    <span className="block text-xs text-slate/50 mt-1">{stats?.inquiries ?? 0} total messages</span>
                  </Link>
                  <Link to="/" target="_blank" className="border border-gray-100 p-4 hover:border-gold hover:bg-gold/5 transition-colors">
                    <span className="block text-sm font-medium text-charcoal">View Website</span>
                    <span className="block text-xs text-slate/50 mt-1">Open public gallery</span>
                  </Link>
                </div>
              </div>

              <div className="bg-white shadow-sm ring-1 ring-black/5 p-6">
                <div className="flex items-center justify-between gap-4 mb-5">
                  <div>
                    <p className="text-xs font-label tracking-widest uppercase text-slate/50 mb-1">Recent</p>
                    <h2 className="font-display text-2xl font-light text-charcoal">Activity</h2>
                  </div>
                  <Link to="/admin/activity" className="text-xs font-label tracking-widest uppercase text-gold hover:text-gold-dark">
                    View all
                  </Link>
                </div>
                {activities.length === 0 ? (
                  <p className="text-sm text-slate/50 py-8">No activity recorded yet.</p>
                ) : (
                  <div className="space-y-4">
                    {activities.map((activity) => (
                      <div key={activity._id} className="flex gap-3">
                        <div className="mt-1 h-2 w-2 rounded-full bg-gold flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm text-charcoal truncate">{activity.action}</p>
                          <p className="text-xs text-slate/45 mt-0.5">
                            {activity.module} - {formatDate(activity.createdAt)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default DashboardPage;
