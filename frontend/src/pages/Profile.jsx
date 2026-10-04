import { useEffect, useMemo, useState } from "react";
import {
  User,
  Mail,
  ShieldCheck,
  CalendarDays,
  Hash,
  Activity,
  TrendingUp,
  Zap,
  Clock3,
  ArrowRight,
  CheckCircle2,
  LockKeyhole,
  BarChart3,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const [userResponse, historyResponse] = await Promise.all([
          api.get("/auth/me"),
          api.get("/predictions/history"),
        ]);

        setUser(userResponse.data.user || userResponse.data);
        setHistory(historyResponse.data.predictions || []);
      } catch (error) {
        console.error("Failed to load profile:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const statistics = useMemo(() => {
    const values = history
      .map((item) => Number(item.predicted_demand))
      .filter((value) => Number.isFinite(value));

    const average =
      values.length > 0
        ? values.reduce((sum, value) => sum + value, 0) / values.length
        : 0;

    const highest = values.length > 0 ? Math.max(...values) : 0;

    const routes = new Set(
      history.map((item) => item.route).filter(Boolean)
    ).size;

    return {
      total: history.length,
      average,
      highest,
      routes,
    };
  }, [history]);

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U";

  const createdDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "Account active";

  if (loading) {
    return (
      <div className="flex min-h-[600px] items-center justify-center">
        <div className="flex items-center gap-3 text-slate-500">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
          Loading profile...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">

      {/* HEADER */}
      <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-7 text-white shadow-xl md:p-9">

        <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute -bottom-24 left-1/3 h-60 w-60 rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="relative flex flex-col gap-7 md:flex-row md:items-center md:justify-between">

          <div className="flex items-center gap-5">

            {/* AVATAR */}
            <div className="relative">
              <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-500 to-cyan-400 text-3xl font-bold shadow-lg shadow-blue-900/40 ring-4 ring-white/10">
                {initials}
              </div>

              <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 ring-4 ring-slate-950">
                <CheckCircle2 size={16} />
              </div>
            </div>

            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-blue-400/30 bg-blue-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-300">
                  Account Center
                </span>

                <span className="flex items-center gap-1 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Active
                </span>
              </div>

              <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                {user?.name || "User"}
              </h1>

              <p className="mt-1 text-slate-300">
                Manage your TransitPredict account and forecasting activity.
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate("/predict")}
            className="flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-blue-700 shadow-lg transition hover:-translate-y-0.5 hover:bg-blue-50"
          >
            <Sparkles size={18} />
            New Prediction
            <ArrowRight size={17} />
          </button>
        </div>
      </section>

      {/* STATISTICS */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <StatCard
          icon={<BarChart3 size={21} />}
          label="Total Forecasts"
          value={statistics.total}
          description="Saved predictions"
          iconClass="bg-blue-50 text-blue-600"
        />

        <StatCard
          icon={<TrendingUp size={21} />}
          label="Average Demand"
          value={statistics.average.toFixed(2)}
          description="Average passengers"
          iconClass="bg-cyan-50 text-cyan-600"
        />

        <StatCard
          icon={<Zap size={21} />}
          label="Highest Forecast"
          value={statistics.highest.toFixed(2)}
          description="Peak predicted demand"
          iconClass="bg-violet-50 text-violet-600"
        />

        <StatCard
          icon={<Activity size={21} />}
          label="Routes Used"
          value={statistics.routes}
          description="Different routes"
          iconClass="bg-emerald-50 text-emerald-600"
        />

      </section>

      {/* MAIN CONTENT */}
      <section className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">

        {/* ACCOUNT INFORMATION */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-100 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <User size={20} />
              </div>

              <div>
                <h2 className="font-bold text-slate-900">
                  Account Information
                </h2>
                <p className="text-sm text-slate-500">
                  Your registered TransitPredict details.
                </p>
              </div>
            </div>
          </div>

          <div className="divide-y divide-slate-100">

            <InfoRow
              icon={<User size={19} />}
              label="Full Name"
              value={user?.name || "Not available"}
            />

            <InfoRow
              icon={<Mail size={19} />}
              label="Email Address"
              value={user?.email || "Not available"}
            />

            <InfoRow
              icon={<ShieldCheck size={19} />}
              label="Account Role"
              value={
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                    user?.role === "ADMIN"
                      ? "bg-violet-100 text-violet-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {user?.role || "USER"}
                </span>
              }
            />

            <InfoRow
              icon={<Hash size={19} />}
              label="User ID"
              value={user?.id ?? "—"}
            />

            <InfoRow
              icon={<CalendarDays size={19} />}
              label="Member Since"
              value={createdDate}
            />

          </div>
        </div>

        {/* SECURITY */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-100 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <LockKeyhole size={20} />
              </div>

              <div>
                <h2 className="font-bold text-slate-900">
                  Security Status
                </h2>
                <p className="text-sm text-slate-500">
                  Your account protection.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3 p-6">

            <SecurityItem
              title="JWT Authentication"
              description="Secure session enabled"
            />

            <SecurityItem
              title="Password Protected"
              description="Encrypted account credentials"
            />

            <SecurityItem
              title="Role-Based Access"
              description="Protected user permissions"
            />

            <SecurityItem
              title="Prediction Privacy"
              description="Your forecasts are linked to your account"
            />

          </div>

          <div className="mx-6 mb-6 rounded-xl bg-slate-50 p-4">
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-emerald-500" size={22} />

              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Account protected
                </p>
                <p className="text-xs text-slate-500">
                  TransitPredict security controls are active.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ACTIVITY */}
      <section className="grid gap-6 lg:grid-cols-2">

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-slate-900">
                Forecast Activity
              </h2>
              <p className="text-sm text-slate-500">
                Your prediction usage overview.
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Activity size={20} />
            </div>
          </div>

          <div className="space-y-5">

            <ProgressRow
              label="Prediction Activity"
              value={statistics.total}
              max={20}
            />

            <ProgressRow
              label="Route Coverage"
              value={statistics.routes}
              max={5}
            />

            <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-4">
              <div className="flex items-center gap-3">
                <Clock3 size={19} className="text-slate-500" />

                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Forecasts Available
                  </p>
                  <p className="text-xs text-slate-500">
                    Stored in prediction history
                  </p>
                </div>
              </div>

              <span className="font-bold text-blue-600">
                {statistics.total}
              </span>
            </div>

          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="mb-5">
            <h2 className="font-bold text-slate-900">
              Quick Actions
            </h2>

            <p className="text-sm text-slate-500">
              Quickly access your forecasting tools.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">

            <ActionButton
              icon={<Zap size={19} />}
              title="Predict Demand"
              description="Create forecast"
              onClick={() => navigate("/predict")}
            />

            <ActionButton
              icon={<BarChart3 size={19} />}
              title="Analytics"
              description="Explore patterns"
              onClick={() => navigate("/analytics")}
            />

            <ActionButton
              icon={<Clock3 size={19} />}
              title="History"
              description="View forecasts"
              onClick={() => navigate("/history")}
            />

            <ActionButton
              icon={<TrendingUp size={19} />}
              title="Dashboard"
              description="View overview"
              onClick={() => navigate("/dashboard")}
            />

          </div>
        </div>

      </section>

      {/* FOOTER INFO */}
      <section className="rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 p-6 text-white shadow-lg">

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15">
              <Sparkles size={22} />
            </div>

            <div>
              <h3 className="font-bold">
                Make smarter transport decisions
              </h3>

              <p className="mt-1 text-sm text-blue-50">
                Use machine-learning demand forecasts to understand
                passenger patterns and improve transport planning.
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate("/analytics")}
            className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-blue-700 transition hover:bg-blue-50"
          >
            Explore Analytics
            <ArrowRight size={17} />
          </button>

        </div>
      </section>

    </div>
  );
}


/* ---------------- COMPONENTS ---------------- */

function StatCard({
  icon,
  label,
  value,
  description,
  iconClass,
}) {
  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">

      <div className="flex items-start justify-between">

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconClass}`}
        >
          {icon}
        </div>

        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-600">
          Live
        </span>

      </div>

      <p className="mt-5 text-sm font-medium text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-400">
        {description}
      </p>

    </div>
  );
}


function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 px-6 py-4">

      <div className="flex items-center gap-3">

        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
          {icon}
        </div>

        <span className="text-sm text-slate-500">
          {label}
        </span>

      </div>

      <div className="text-right text-sm font-semibold text-slate-900">
        {value}
      </div>

    </div>
  );
}


function SecurityItem({ title, description }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3">

      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
        <CheckCircle2 size={16} />
      </div>

      <div>
        <p className="text-sm font-semibold text-slate-800">
          {title}
        </p>

        <p className="text-xs text-slate-500">
          {description}
        </p>
      </div>

    </div>
  );
}


function ProgressRow({ label, value, max }) {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div>

      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-slate-600">
          {label}
        </span>

        <span className="text-sm font-bold text-slate-900">
          {value}
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-700"
          style={{ width: `${percentage}%` }}
        />
      </div>

    </div>
  );
}


function ActionButton({ icon, title, description, onClick }) {
  return (
    <button
      onClick={onClick}
      className="group flex items-center gap-3 rounded-xl border border-slate-200 p-4 text-left transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50/50 hover:shadow-sm"
    >

      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-slate-900">
          {title}
        </p>

        <p className="text-xs text-slate-500">
          {description}
        </p>
      </div>

      <ArrowRight
        size={16}
        className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-600"
      />

    </button>
  );
}