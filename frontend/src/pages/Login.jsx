import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Bus,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  Brain,
  Activity,
  Eye,
  EyeOff,
} from "lucide-react";

import api from "../services/api";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/login", {
        email: email.trim(),
        password,
      });

      const data = response.data;

      console.log("LOGIN RESPONSE:", data);

      if (!data?.access_token) {
        throw new Error("Login successful, but access token was not received.");
      }

      /*
       * Store authentication information.
       * ProtectedRoute and API interceptor use these values.
       */
      localStorage.setItem("token", data.access_token);

      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      /*
       * Small delay allows localStorage to finish before
       * ProtectedRoute checks authentication.
       */
      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 100);

    } catch (err) {
      console.error("LOGIN ERROR:", err);

      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Invalid email or password.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080f1d] text-slate-200">

      {/* HEADER */}
      <header className="border-b border-slate-800 bg-[#0b1220]/95 backdrop-blur-xl">

        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5">

          <Link to="/" className="group flex items-center gap-3">

            <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 shadow-lg shadow-blue-500/20">

              <Bus className="text-white" size={23} />

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
            to="/register"
            className="hidden items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-blue-500/40 hover:bg-blue-500/10 hover:text-blue-400 sm:flex"
          >
            Create Account
            <ArrowRight size={16} />
          </Link>

        </div>

        <div className="h-[2px] bg-gradient-to-r from-blue-600 via-cyan-400 to-indigo-600" />

      </header>

      {/* MAIN */}
      <main className="relative flex min-h-[calc(100vh-82px)] items-center justify-center overflow-hidden px-5 py-12">

        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/10 blur-[120px]" />

        <div className="relative grid w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-800 bg-[#0d1626] shadow-2xl shadow-black/40 lg:grid-cols-2">

          {/* LEFT */}
          <div className="hidden flex-col justify-between bg-gradient-to-br from-[#0f1c38] via-[#101b36] to-[#071525] p-10 lg:flex">

            <div>

              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1.5 text-xs font-bold text-blue-400">
                <Brain size={14} />
                AI TRANSPORT INTELLIGENCE
              </div>

              <h1 className="max-w-md text-4xl font-black leading-tight text-white">
                Predict demand.
                <br />
                Plan smarter.
                <br />
                Move better.
              </h1>

              <p className="mt-5 max-w-md text-sm leading-7 text-slate-400">
                Use machine-learning powered passenger-demand forecasting
                to understand transport patterns and make better capacity
                planning decisions.
              </p>

            </div>

            <div className="space-y-3">

              <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-white/[0.03] p-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10">
                  <Activity size={17} className="text-blue-400" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-200">
                    Real-time analytics
                  </p>

                  <p className="text-xs text-slate-500">
                    Monitor demand patterns
                  </p>
                </div>

              </div>

              <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-white/[0.03] p-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10">
                  <ShieldCheck size={17} className="text-emerald-400" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-200">
                    Secure access
                  </p>

                  <p className="text-xs text-slate-500">
                    Protected JWT authentication
                  </p>
                </div>

              </div>

            </div>

          </div>

          {/* LOGIN */}
          <div className="flex items-center justify-center p-7 sm:p-10 lg:p-12">

            <div className="w-full max-w-md">

              <div className="mb-8">

                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-400">
                  <Lock size={12} />
                  Secure Login
                </div>

                <h2 className="text-3xl font-black tracking-tight text-white">
                  Welcome back
                </h2>

                <p className="mt-2 text-sm text-slate-400">
                  Sign in to your transport analytics dashboard.
                </p>

              </div>

              {error && (
                <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">

                {/* EMAIL */}
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

                {/* PASSWORD */}
                <div>

                  <div className="mb-2 flex items-center justify-between">

                    <label className="text-sm font-semibold text-slate-300">
                      Password
                    </label>

                    <Link
                      to="/forgot-password"
                      className="text-xs font-semibold text-blue-400 hover:text-blue-300"
                    >
                      Forgot password?
                    </Link>

                  </div>

                  <div className="relative">

                    <Lock
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                    />

                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      autoComplete="current-password"
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

                {/* SUBMIT */}
                <button
                  type="submit"
                  disabled={loading}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-sm font-bold text-white shadow-lg shadow-blue-900/30 transition hover:from-blue-500 hover:to-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
                >

                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight size={17} />
                    </>
                  )}

                </button>

              </form>

              <div className="mt-7 border-t border-slate-800 pt-6 text-center">

                <p className="text-sm text-slate-500">
                  Don't have an account?{" "}

                  <Link
                    to="/register"
                    className="font-bold text-blue-400 hover:text-blue-300"
                  >
                    Create account
                  </Link>

                </p>

              </div>

              <div className="mt-6 flex items-center justify-center gap-2 text-[10px] font-medium uppercase tracking-wider text-slate-600">

                <ShieldCheck
                  size={13}
                  className="text-emerald-500"
                />

                Secure JWT protected authentication

              </div>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}