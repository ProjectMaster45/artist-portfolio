import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import LoadingSpinner from "../../components/shared/LoadingSpinner";
import { activityAPI } from "../../services/api";
import toast from "react-hot-toast";

const MODULES = ["all", "auth", "security", "artworks", "inquiries", "profile", "settings", "system"];

const formatDate = (value) => {
  if (!value) return "-";
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
};

const ActivityPage = () => {
  const [activities, setActivities] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [module, setModule] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadActivities = async () => {
      setLoading(true);
      try {
        const res = await activityAPI.getAll({ module, page: pagination.page, limit: 20 });
        setActivities(res.data.activities || res.data.data?.activities || []);
        setPagination(res.data.pagination || res.data.data?.pagination || { page: 1, pages: 1, total: 0 });
      } catch {
        toast.error("Failed to load activity logs");
      } finally {
        setLoading(false);
      }
    };

    loadActivities();
  }, [module, pagination.page]);

  const changeModule = (value) => {
    setModule(value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const changePage = (direction) => {
    setPagination((prev) => ({
      ...prev,
      page: Math.min(prev.pages || 1, Math.max(1, prev.page + direction)),
    }));
  };

  return (
    <AdminLayout>
      <div className="p-6 md:p-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-label tracking-widest uppercase text-slate/50 mb-1">Admin</p>
            <h1 className="font-display text-3xl font-light text-charcoal">Activity Logs</h1>
          </div>

          <label className="block w-full md:w-56">
            <span className="text-xs font-label tracking-widest uppercase text-slate/60 block mb-1">
              Module
            </span>
            <select
              value={module}
              onChange={(e) => changeModule(e.target.value)}
              className="input-field bg-white"
            >
              {MODULES.map((item) => (
                <option key={item} value={item}>
                  {item === "all" ? "All Modules" : item[0].toUpperCase() + item.slice(1)}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="bg-white shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-16">
              <LoadingSpinner size="lg" />
            </div>
          ) : activities.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <p className="font-display text-2xl font-light text-charcoal mb-2">No activity yet</p>
              <p className="text-sm text-slate/50">Security and admin actions will appear here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-5 py-3 text-left text-xs font-label tracking-widest uppercase text-slate/50">
                      Time
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-label tracking-widest uppercase text-slate/50">
                      Action
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-label tracking-widest uppercase text-slate/50">
                      Module
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-label tracking-widest uppercase text-slate/50">
                      Admin
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-label tracking-widest uppercase text-slate/50">
                      Device
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {activities.map((activity) => (
                    <tr key={activity._id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="px-5 py-4 text-sm text-slate whitespace-nowrap">
                        {formatDate(activity.createdAt)}
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm font-medium text-charcoal">{activity.action}</p>
                        {activity.ipAddress && (
                          <p className="text-xs text-slate/45 mt-1">IP {activity.ipAddress}</p>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex px-2 py-1 text-xs font-medium bg-gold/10 text-charcoal">
                          {activity.module}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-slate">
                        {activity.admin?.email || "System"}
                      </td>
                      <td className="px-5 py-4 text-sm text-slate">
                        {activity.device || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate/50">
            Showing page {pagination.page || 1} of {pagination.pages || 1} - {pagination.total || 0} logs
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              className="btn-secondary text-xs disabled:opacity-40"
              onClick={() => changePage(-1)}
              disabled={(pagination.page || 1) <= 1 || loading}
            >
              Previous
            </button>
            <button
              type="button"
              className="btn-secondary text-xs disabled:opacity-40"
              onClick={() => changePage(1)}
              disabled={(pagination.page || 1) >= (pagination.pages || 1) || loading}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ActivityPage;
