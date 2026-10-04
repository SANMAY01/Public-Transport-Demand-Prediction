import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import {
  Shield,
  Users,
  UserCog,
  Activity,
  TrendingUp,
  Database,
  RefreshCw,
  Trash2,
  ArrowUpRight,
  BarChart3,
  Brain,
  CheckCircle2,
  AlertCircle,
  Crown,
  UserRound,
} from "lucide-react";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [preds, setPreds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setError("");

      const [usersResponse, predictionsResponse] = await Promise.all([
        api.get("/admin/users"),
        api.get("/admin/predictions"),
      ]);

      setUsers(usersResponse.data.users || []);
      setPreds(predictionsResponse.data.predictions || []);
    } catch (err) {
      console.error("Admin dashboard loading error:", err);
      setError(
        err?.response?.data?.message ||
          "Unable to load administrator data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const toggleRole = async (id, currentRole) => {
    try {
      await api.put(`/admin/users/${id}/role`, {
        role: currentRole === "ADMIN" ? "USER" : "ADMIN",
      });

      load();
    } catch (err) {
      alert(
        err?.response?.data?.message ||
          "Unable to change the user's role."
      );
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user? This action cannot be undone.")) {
      return;
    }

    try {
      await api.delete(`/admin/users/${id}`);
      load();
    } catch (err) {
      alert(
        err?.response?.data?.message ||
          "Unable to delete this user."
      );
    }
  };

  const stats = useMemo(() => {
    const admins = users.filter((u) => u.role === "ADMIN").length;
    const normalUsers = users.filter((u) => u.role !== "ADMIN").length;

    const values = preds
      .map((p) => Number(p.predicted_demand))
      .filter((v) => Number.isFinite(v));

    const average =
      values.length > 0
        ? values.reduce((sum, value) => sum + value, 0) /
          values.length
        : 0;

    const highest = values.length > 0 ? Math.max(...values) : 0;

    const routes = new Set(
      preds.map((p) => p.route).filter(Boolean)
    );

    return {
      totalUsers: users.length,
      admins,
      normalUsers,
      predictions: preds.length,
      average,
      highest,
      routes: routes.size,
    };
  }, [users, preds]);

  const recentPredictions = preds.slice(0, 8);

  return (
    <div className="space-y-6 pb-10">

      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#050b25] via-[#0b1742] to-[#123c65] px-7 py-8 text-white shadow-xl sm:px-9">
        <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-300/30 bg-white/10 px-4 py-2 text-sm font-medium text-blue-200 backdrop-blur">
              <Shield size={16} />
              ADMIN CONTROL CENTER
            </div>

            <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
              Transport Operations
            </h1>

            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              Manage platform users, monitor prediction activity and
              oversee the machine-learning demand forecasting system.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-2.5 text-sm">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
                System Operational
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-2.5 text-sm">
                <Brain size={16} />
                Gradient Boosting
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-2.5 text-sm">
                <Activity size={16} />
                Live Analytics
              </div>
            </div>
          </div>

          <button
            onClick={load}
            disabled={loading}
            className="flex shrink-0 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 font-semibold backdrop-blur transition hover:bg-white/20 disabled:opacity-60"
          >
            <RefreshCw
              size={18}
              className={loading ? "animate-spin" : ""}
            />
            Refresh Data
          </button>
        </div>
      </section>

      {/* ================= ERROR ================= */}
      {error && (
        <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* ================= KPI CARDS ================= */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <StatCard
          icon={Users}
          title="Total Users"
          value={stats.totalUsers}
          subtitle={`${stats.normalUsers} standard users`}
          iconClass="bg-blue-50 text-blue-600"
        />

        <StatCard
          icon={Crown}
          title="Administrators"
          value={stats.admins}
          subtitle="Privileged accounts"
          iconClass="bg-violet-50 text-violet-600"
        />

        <StatCard
          icon={Database}
          title="Total Predictions"
          value={stats.predictions}
          subtitle="Saved forecasts"
          iconClass="bg-cyan-50 text-cyan-600"
        />

        <StatCard
          icon={TrendingUp}
          title="Average Demand"
          value={stats.average.toFixed(2)}
          subtitle={`${stats.routes} routes represented`}
          iconClass="bg-emerald-50 text-emerald-600"
        />
      </section>

      {/* ================= SYSTEM OVERVIEW ================= */}
      <section className="grid gap-6 lg:grid-cols-3">

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="rounded-xl bg-blue-50 p-2 text-blue-600">
                  <BarChart3 size={20} />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Platform Overview
                  </h2>

                  <p className="text-sm text-slate-500">
                    Current system activity
                  </p>
                </div>
              </div>
            </div>

            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600">
              LIVE
            </span>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">

            <OverviewItem
              label="User Accounts"
              value={stats.totalUsers}
              icon={Users}
            />

            <OverviewItem
              label="Predictions"
              value={stats.predictions}
              icon={Activity}
            />

            <OverviewItem
              label="Routes Covered"
              value={stats.routes}
              icon={ArrowUpRight}
            />
          </div>

          <div className="mt-6 rounded-2xl bg-slate-50 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-700">
                  Highest Predicted Demand
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Maximum forecast currently recorded
                </p>
              </div>

              <div className="text-right">
                <p className="text-3xl font-black text-slate-900">
                  {stats.highest.toFixed(2)}
                </p>

                <p className="text-xs font-medium text-blue-600">
                  passengers
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ML MODEL CARD */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#091334] to-[#142b63] p-6 text-white shadow-lg">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-blue-500/20 blur-3xl" />

          <div className="relative">
            <div className="flex items-center justify-between">
              <div className="rounded-xl bg-blue-500/20 p-3 text-blue-300">
                <Brain size={23} />
              </div>

              <span className="flex items-center gap-2 rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                ACTIVE
              </span>
            </div>

            <p className="mt-7 text-xs font-bold uppercase tracking-widest text-blue-300">
              AI ENGINE
            </p>

            <h2 className="mt-2 text-2xl font-black">
              Gradient Boosting
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-300">
              The selected machine-learning model powers passenger
              demand forecasting across transport routes.
            </p>

            <div className="mt-6 space-y-3">
              <ModelRow label="Prediction Engine" value="Online" />
              <ModelRow label="Data Pipeline" value="Connected" />
              <ModelRow label="Analytics" value="Active" />
            </div>
          </div>
        </div>
      </section>

      {/* ================= USER MANAGEMENT ================= */}
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

        <div className="flex flex-col gap-4 border-b border-slate-100 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
              <UserCog size={21} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900">
                User Management
              </h2>

              <p className="text-sm text-slate-500">
                Manage accounts and access permissions
              </p>
            </div>
          </div>

          <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600">
            {users.length} accounts
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Account</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-t border-slate-100 transition hover:bg-slate-50/70"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 font-bold text-white">
                        {(user.name || "U")
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div>
                        <p className="font-semibold text-slate-900">
                          {user.name}
                        </p>

                        <p className="text-xs text-slate-400">
                          User ID #{user.id}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-600">
                    {user.email}
                  </td>

                  <td className="px-6 py-4">
                    {user.role === "ADMIN" ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-50 px-3 py-1.5 text-xs font-bold text-violet-700">
                        <Crown size={13} />
                        ADMIN
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">
                        <UserRound size={13} />
                        USER
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600">
                      <CheckCircle2 size={16} />
                      Active
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() =>
                          toggleRole(user.id, user.role)
                        }
                        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                      >
                        Change Role
                      </button>

                      <button
                        onClick={() => deleteUser(user.id)}
                        className="flex items-center gap-1.5 rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {!users.length && !loading && (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-12 text-center text-slate-400"
                  >
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* ================= PREDICTIONS ================= */}
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

        <div className="flex flex-col gap-4 border-b border-slate-100 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-cyan-50 p-3 text-cyan-600">
              <Activity size={21} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Prediction Activity
              </h2>

              <p className="text-sm text-slate-500">
                Latest machine-learning forecasts across the platform
              </p>
            </div>
          </div>

          <div className="rounded-full bg-cyan-50 px-4 py-2 text-sm font-semibold text-cyan-700">
            {preds.length} forecasts
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Route</th>
                <th className="px-6 py-4">Weather</th>
                <th className="px-6 py-4">Demand</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>

            <tbody>
              {recentPredictions.map((prediction, index) => {
                const demand = Number(
                  prediction.predicted_demand
                );

                const isHigh = demand >= 110;

                return (
                  <tr
                    key={prediction.id || index}
                    className="border-t border-slate-100 transition hover:bg-slate-50/70"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-600">
                          #{prediction.user_id}
                        </div>

                        <span className="text-sm font-semibold text-slate-700">
                          User {prediction.user_id}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {prediction.date}
                    </td>

                    <td className="px-6 py-4">
                      <span className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">
                        {prediction.route}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {prediction.weather || "—"}
                    </td>

                    <td className="px-6 py-4">
                      <span className="font-bold text-slate-900">
                        {Number.isFinite(demand)
                          ? demand.toFixed(2)
                          : prediction.predicted_demand}
                      </span>

                      <span className="ml-1 text-xs text-slate-400">
                        passengers
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                          isHigh
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-blue-50 text-blue-700"
                        }`}
                      >
                        {isHigh ? "High Demand" : "Normal"}
                      </span>
                    </td>
                  </tr>
                );
              })}

              {!recentPredictions.length && !loading && (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-12 text-center text-slate-400"
                  >
                    No prediction activity found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {preds.length > 8 && (
          <div className="border-t border-slate-100 bg-slate-50 px-6 py-4 text-center text-sm text-slate-500">
            Showing the latest 8 predictions
          </div>
        )}
      </section>

      {/* ================= BOTTOM CTA ================= */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 p-7 text-white shadow-lg">
        <div className="absolute -right-10 -top-20 h-56 w-56 rounded-full bg-white/10 blur-3xl" />

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-blue-100">
              <Brain size={17} />
              MACHINE-LEARNING DEMAND PLATFORM
            </div>

            <h2 className="text-2xl font-black">
              Keep transport operations data-driven.
            </h2>

            <p className="mt-2 max-w-2xl text-sm text-blue-100">
              Monitor users, forecasts and route demand from one
              centralized administration center.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-white/15 px-5 py-3 text-sm font-bold backdrop-blur">
            <CheckCircle2 size={18} />
            Platform Healthy
          </div>
        </div>
      </section>
    </div>
  );
}


/* =========================================================
   SMALL REUSABLE COMPONENTS
========================================================= */

function StatCard({
  icon: Icon,
  title,
  value,
  subtitle,
  iconClass,
}) {
  return (
    <div className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-start justify-between">
        <div className={`rounded-2xl p-3 ${iconClass}`}>
          <Icon size={21} />
        </div>

        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-600">
          Live
        </span>
      </div>

      <p className="mt-5 text-sm font-medium text-slate-500">
        {title}
      </p>

      <p className="mt-1 text-3xl font-black tracking-tight text-slate-900">
        {value}
      </p>

      <p className="mt-2 text-xs text-slate-400">
        {subtitle}
      </p>
    </div>
  );
}


function OverviewItem({ label, value, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
      <div className="flex items-center justify-between">
        <div className="rounded-lg bg-white p-2 text-blue-600 shadow-sm">
          <Icon size={17} />
        </div>

        <span className="text-2xl font-black text-slate-900">
          {value}
        </span>
      </div>

      <p className="mt-4 text-sm font-medium text-slate-500">
        {label}
      </p>
    </div>
  );
}


function ModelRow({ label, value }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">
      <span className="text-sm text-slate-300">
        {label}
      </span>

      <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-300">
        <CheckCircle2 size={14} />
        {value}
      </span>
    </div>
  );
}