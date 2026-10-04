import {
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  BarChart3,
  Bus,
  History,
  Home,
  LogOut,
  Shield,
  User,
  Zap,
  Bell,
  ChevronDown,
  Activity,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const links = [
    ["/dashboard", "Dashboard", Home],
    ["/predict", "Predict Demand", Zap],
    ["/history", "History", History],
    ["/analytics", "Analytics", BarChart3],
    ["/profile", "Profile", User],
  ];

  if (user?.role === "ADMIN") {
    links.push(["/admin", "Admin", Shield]);
  }

  const currentPage =
    links.find(([path]) => location.pathname.startsWith(path))?.[1] ||
    "Dashboard";

  const initials =
    user?.name
      ?.split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#080f1d] text-slate-200">

      {/* =====================================================
          TOP HEADER
      ====================================================== */}
      <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-[#0b1220]/95 text-white shadow-2xl shadow-black/20 backdrop-blur-xl">

        <div className="mx-auto flex h-[78px] max-w-7xl items-center justify-between px-5 lg:px-6">

          {/* BRAND + WORKSPACE */}
          <div className="flex items-center gap-7">

            {/* LOGO */}
            <button
              onClick={() => navigate("/dashboard")}
              className="group flex items-center gap-3"
            >
              <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 shadow-lg shadow-blue-500/20 transition-transform duration-200 group-hover:scale-105">

                <Bus
                  size={23}
                  strokeWidth={2.3}
                  className="text-white"
                />

                {/* ONLINE DOT */}
                <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-[#0b1220] bg-emerald-400 shadow-sm shadow-emerald-400/40" />
              </div>

              <div className="hidden text-left sm:block">

                <div className="flex items-center gap-2">

                  <span className="text-[18px] font-extrabold tracking-tight text-white">
                    TransitPredict
                  </span>

                  <span className="rounded-full border border-blue-400/20 bg-blue-500/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-blue-400">
                    AI
                  </span>

                </div>

                <div className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.16em] text-slate-500">
                  Smart Mobility Platform
                </div>

              </div>
            </button>

            {/* DIVIDER */}
            <div className="hidden h-9 w-px bg-slate-800 lg:block" />

            {/* CURRENT WORKSPACE */}
            <div className="hidden items-center gap-3 lg:flex">

              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10">
                <Activity
                  size={17}
                  className="text-blue-400"
                />
              </div>

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  Workspace
                </p>

                <p className="text-sm font-bold text-slate-200">
                  {currentPage}
                </p>
              </div>

            </div>
          </div>

          {/* =================================================
              RIGHT HEADER AREA
          ================================================= */}
          <div className="flex items-center gap-3">

            {/* SYSTEM STATUS */}
            <div className="hidden items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-2 md:flex">

              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />

                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
              </span>

              <span className="text-[11px] font-bold uppercase tracking-wide text-emerald-400">
                System Operational
              </span>

            </div>

            {/* NOTIFICATION */}
            <button
              className="hidden h-10 w-10 items-center justify-center rounded-xl border border-slate-700 bg-slate-900 text-slate-400 transition hover:border-blue-500/40 hover:bg-blue-500/10 hover:text-blue-400 sm:flex"
              title="Notifications"
            >
              <Bell size={18} />
            </button>

            {/* USER AREA */}
            <div className="flex items-center gap-3 rounded-2xl border border-slate-700 bg-slate-900/80 px-2 py-1.5 shadow-sm">

              {/* AVATAR */}
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-xs font-extrabold text-white shadow-lg shadow-blue-900/30">
                {initials}
              </div>

              {/* USER DETAILS */}
              <div className="hidden text-left sm:block">

                <p className="max-w-[140px] truncate text-sm font-bold text-slate-200">
                  {user?.name || "User"}
                </p>

                <div className="flex items-center gap-1.5">

                  <span
                    className={`text-[9px] font-extrabold uppercase tracking-wider ${
                      user?.role === "ADMIN"
                        ? "text-purple-400"
                        : "text-blue-400"
                    }`}
                  >
                    {user?.role || "USER"}
                  </span>

                  <span className="h-1 w-1 rounded-full bg-slate-600" />

                  <span className="text-[9px] font-medium text-emerald-400">
                    Active
                  </span>

                </div>
              </div>

              <ChevronDown
                size={15}
                className="hidden text-slate-500 sm:block"
              />
            </div>

            {/* LOGOUT */}
            <button
              onClick={handleLogout}
              className="group flex h-10 items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-3.5 text-sm font-semibold text-slate-400 shadow-sm transition-all duration-200 hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400 hover:shadow-lg md:px-4"
              title="Logout"
            >
              <LogOut
                size={17}
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              />

              <span className="hidden md:inline">
                Logout
              </span>
            </button>

          </div>
        </div>

        {/* HEADER ACCENT LINE */}
        <div className="h-[2px] bg-gradient-to-r from-blue-600 via-cyan-400 to-indigo-600 opacity-90" />

      </header>

      {/* =====================================================
          MAIN APPLICATION
      ====================================================== */}
      <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-7xl gap-6 bg-[#080f1d] px-5 py-6 lg:px-6">

        {/* ===================================================
            SIDEBAR
        ==================================================== */}
        <aside className="hidden w-52 shrink-0 md:block">

          <nav className="sticky top-[102px] overflow-hidden rounded-2xl border border-slate-800 bg-[#0d1626] p-2.5 shadow-xl shadow-black/20">

            {/* SIDEBAR HEADER */}
            <div className="mb-2 px-3 py-2">

              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                Navigation
              </p>

            </div>

            {/* NAVIGATION LINKS */}
            {links.map(([to, label, Icon]) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `group mb-1 flex items-center justify-between rounded-xl px-3 py-3 text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "border border-blue-500/20 bg-gradient-to-r from-blue-500/15 to-indigo-500/10 text-blue-400 shadow-lg shadow-blue-950/20"
                      : "border border-transparent text-slate-400 hover:border-slate-700 hover:bg-slate-800/70 hover:text-slate-200"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span className="flex items-center gap-3">

                      <span
                        className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${
                          isActive
                            ? "border border-blue-500/20 bg-blue-500/10 text-blue-400"
                            : "bg-transparent text-slate-500 group-hover:text-blue-400"
                        }`}
                      >
                        <Icon size={17} />
                      </span>

                      {label}

                    </span>

                    {isActive && (
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-400 shadow-sm shadow-blue-400" />
                    )}
                  </>
                )}
              </NavLink>
            ))}

            {/* =================================================
                AI ENGINE
            ================================================== */}
            <div className="mt-4 border-t border-slate-800 pt-3">

              <div className="rounded-xl border border-blue-500/10 bg-gradient-to-br from-slate-900 via-blue-950/70 to-slate-900 p-3.5 text-white shadow-lg">

                <div className="mb-2 flex items-center justify-between">

                  <span className="text-[9px] font-bold uppercase tracking-wider text-blue-300">
                    AI Engine
                  </span>

                  <span className="flex h-2 w-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" />

                </div>

                <p className="text-xs font-semibold">
                  Gradient Boosting
                </p>

                <p className="mt-1 text-[9px] leading-relaxed text-slate-500">
                  Demand prediction model active
                </p>

                <div className="mt-3 flex items-center gap-2 text-[9px] text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Model Online
                </div>

              </div>

            </div>

          </nav>

        </aside>

        {/* ===================================================
            PAGE CONTENT
        ==================================================== */}
        <main className="app-dark min-w-0 flex-1">
          <Outlet />
        </main>

      </div>

    </div>
  );
}