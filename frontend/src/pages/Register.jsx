import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Bus,
  User,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  Brain,
  Activity,
  Eye,
  EyeOff,
  CheckCircle2,
} from "lucide-react";

import api from "../services/api";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/register", {
        name: name.trim(),
        email: email.trim(),
        password,
      });

      setSuccess("Account created successfully. Redirecting to login...");

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (err) {
      console.error("Registration error:", err);

      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Unable to create your account."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080f1d] text-slate-200">

      {/* =====================================================
          TOP BAR
          ===================================================== */}
      <header className="border-b border-slate-800 bg-[#0b1220]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5">

          <Link
            to="/"
            className="group flex items-center gap-3"
          >
            <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 shadow-lg shadow-blue-500/20 transition group-hover:scale-105">

              <Bus
                size={23}
                className="text-white"
              />

              <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-[#0b1220] bg-emerald-400" />

            </div>

            <div>
              <div className="flex items-center gap-2">

                <span className="text-lg font-extrabold tracking-tight text-white">
                  TransitPredict
                </span>

                <span className="rounded-full border border-blue-400/20 bg-blue-500/10 px-2 py-0.5 text-[9px] font-bold text-blue-400">
                  AI
                </span>

              </div>

              <p className="text-[9px] font-medium uppercase tracking-[0.16em] text-slate-500">
                Smart Mobility Platform
              </p>
            </div>

          </Link>

          <Link
            to="/login"
            className="hidden items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-blue-500/40 hover:bg-blue-500/10 hover:text-blue-400 sm:flex"
          >
            Sign In
            <ArrowRight size={16} />
          </Link>

        </div>

        <div className="h-[2px] bg-gradient-to-r from-blue-600 via-cyan-400 to-indigo-600" />
      </header>

      {/* =====================================================
          MAIN
          ===================================================== */}
      <main className="relative flex min-h-[calc(100vh-82px)] items-center justify-center overflow-hidden px-5 py-10">

        {/* Background glow */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[650px] w-[650px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/10 blur-[130px]" />

        <div className="relative grid w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-800 bg-[#0d1626] shadow-2xl shadow-black/40 lg:grid-cols-2">

          {/* =================================================
              LEFT PANEL
              ================================================= */}
          <div className="hidden flex-col justify-between bg-gradient-to-br from-[#0f1c38] via-[#101b36] to-[#071525] p-10 lg:flex">

            <div>

              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1.5 text-xs font-bold text-cyan-400">
                <Brain size={14} />
                SMART MOBILITY PLATFORM
              </div>

              <h1 className="max-w-md text-4xl font-black leading-tight text-white">
                Build smarter
                <br />
                transport
                <br />
                decisions.
              </h1>

              <p className="mt-5 max-w-md text-sm leading-7 text-slate-400">
                Create your TransitPredict account and use machine-learning
                powered passenger-demand forecasting to analyze routes,
                weather and travel patterns.
              </p>

            </div>

            {/* Features */}
            <div className="space-y-3">

              <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-white/[0.03] p-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10">
                  <Activity
                    size={17}
                    className="text-blue-400"
                  />
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-200">
                    Demand Analytics
                  </p>

                  <p className="text-xs text-slate-500">
                    Explore passenger patterns
                  </p>
                </div>

                <CheckCircle2
                  size={16}
                  className="ml-auto text-emerald-400"
                />

              </div>

              <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-white/[0.03] p-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/10">
                  <Brain
                    size={17}
                    className="text-violet-400"
                  />
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-200">
                    ML Predictions
                  </p>

                  <p className="text-xs text-slate-500">
                    Gradient Boosting engine
                  </p>
                </div>

                <CheckCircle2
                  size={16}
                  className="ml-auto text-emerald-400"
                />

              </div>

              <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-white/[0.03] p-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10">
                  <ShieldCheck
                    size={17}
                    className="text-emerald-400"
                  />
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-200">
                    Secure Account
                  </p>

                  <p className="text-xs text-slate-500">
                    Protected authentication
                  </p>
                </div>

                <CheckCircle2
                  size={16}
                  className="ml-auto text-emerald-400"
                />

              </div>

            </div>

          </div>

          {/* =================================================
              REGISTER FORM
              ================================================= */}
          <div className="flex items-center justify-center p-7 sm:p-10 lg:p-12">

            <div className="w-full max-w-md">

              {/* Mobile brand */}
              <div className="mb-7 text-center lg:hidden">

                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 shadow-lg shadow-blue-500/20">

                  <Bus
                    size={27}
                    className="text-white"
                  />

                </div>

                <h1 className="text-2xl font-extrabold text-white">
                  TransitPredict
                </h1>

              </div>

              {/* Heading */}
              <div className="mb-7">

                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-400">

                  <User size={12} />

                  Create Account

                </div>

                <h2 className="text-3xl font-black tracking-tight text-white">
                  Join TransitPredict
                </h2>

                <p className="mt-2 text-sm text-slate-400">
                  Create your account to access transport demand analytics.
                </p>

              </div>

              {/* Error */}
              {error && (
                <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
                  {error}
                </div>
              )}

              {/* Success */}
              {success && (
                <div className="mb-5 flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-300">

                  <CheckCircle2 size={18} />

                  {success}

                </div>
              )}

              {/* Form */}
              <form
                onSubmit={handleSubmit}
                className="space-y-4"
              >

                {/* Name */}
                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-300">
                    Full Name
                  </label>

                  <div className="relative">

                    <User
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                    />

                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                      autoComplete="name"
                      className="h-12 w-full rounded-xl border border-slate-700 bg-slate-900 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    />

                  </div>

                </div>

                {/* Email */}
                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-300">
                    Email Address
                  </label>

                  <div className="relative">

                    <Mail
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                    />

                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      autoComplete="email"
                      className="h-12 w-full rounded-xl border border-slate-700 bg-slate-900 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    />

                  </div>

                </div>

                {/* Password */}
                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-300">
                    Password
                  </label>

                  <div className="relative">

                    <Lock
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                    />

                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a password"
                      autoComplete="new-password"
                      className="h-12 w-full rounded-xl border border-slate-700 bg-slate-900 pl-11 pr-12 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-800 hover:text-slate-300"
                    >
                      {showPassword ? (
                        <EyeOff size={17} />
                      ) : (
                        <Eye size={17} />
                      )}
                    </button>

                  </div>

                </div>

                {/* Confirm password */}
                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-300">
                    Confirm Password
                  </label>

                  <div className="relative">

                    <Lock
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                    />

                    <input
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      value={confirmPassword}
                      onChange={(e) =>
                        setConfirmPassword(e.target.value)
                      }
                      placeholder="Re-enter your password"
                      autoComplete="new-password"
                      className="h-12 w-full rounded-xl border border-slate-700 bg-slate-900 pl-11 pr-12 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(
                          (value) => !value
                        )
                      }
                      className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-800 hover:text-slate-300"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={17} />
                      ) : (
                        <Eye size={17} />
                      )}
                    </button>

                  </div>

                </div>

                {/* Password hint */}
                <p className="text-xs text-slate-600">
                  Use at least 6 characters for your password.
                </p>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-sm font-bold text-white shadow-lg shadow-blue-900/30 transition hover:from-blue-500 hover:to-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Creating account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight size={17} />
                    </>
                  )}
                </button>

              </form>

              {/* Login */}
              <div className="mt-7 border-t border-slate-800 pt-6 text-center">

                <p className="text-sm text-slate-500">
                  Already have an account?{" "}

                  <Link
                    to="/login"
                    className="font-bold text-blue-400 transition hover:text-blue-300"
                  >
                    Sign in
                  </Link>

                </p>

              </div>

              {/* Security */}
              <div className="mt-5 flex items-center justify-center gap-2 text-[10px] font-medium uppercase tracking-wider text-slate-600">

                <ShieldCheck
                  size={13}
                  className="text-emerald-500"
                />

                Secure JWT protected account

              </div>

            </div>

          </div>

        </div>

      </main>
    </div>
  );
}