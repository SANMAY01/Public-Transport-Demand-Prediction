import {
  ArrowRight,
  BarChart3,
  BrainCircuit,
  BusFront,
  CheckCircle2,
  ChevronRight,
  CloudRain,
  Gauge,
  LockKeyhole,
  Route,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="min-h-screen overflow-hidden bg-slate-950 text-white">

      {/* ================= NAVBAR ================= */}
      <header className="relative z-20 border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">

          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-600/30">
              <BusFront size={23} />
            </div>

            <div>
              <div className="text-lg font-bold tracking-tight">
                Transit<span className="text-blue-400">Predict</span>
              </div>
              <div className="text-[10px] font-medium uppercase tracking-[0.22em] text-slate-500">
                Transport Intelligence
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="rounded-xl border border-white/15 px-5 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-blue-400/50 hover:bg-white/5"
            >
              Sign In
            </Link>

            <Link
              to="/register"
              className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold shadow-lg shadow-blue-600/25 transition hover:bg-blue-500 hover:shadow-blue-500/30"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* ================= HERO ================= */}
      <main>

        <section className="relative">
          {/* background glow */}
          <div className="pointer-events-none absolute left-1/2 top-20 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-600/15 blur-3xl" />
          <div className="pointer-events-none absolute right-0 top-40 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />

          <div className="relative mx-auto grid max-w-7xl gap-16 px-6 pb-20 pt-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-8 lg:pb-28 lg:pt-28">

            {/* LEFT */}
            <div>

              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-300">
                <Sparkles size={16} />
                AI-Powered Public Transport Analytics
              </div>

              <h1 className="max-w-4xl text-5xl font-black leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
                Predict demand.
                <br />
                <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-white bg-clip-text text-transparent">
                  Plan smarter.
                </span>
              </h1>

              <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-400">
                TransitPredict uses machine learning to forecast passenger
                demand using route, time, weather and historical transport
                patterns.
              </p>

              <div className="mt-9 flex flex-wrap gap-4">

                <Link
                  to="/register"
                  className="group inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-bold shadow-xl shadow-blue-600/25 transition hover:-translate-y-0.5 hover:bg-blue-500"
                >
                  Start Predicting
                  <ArrowRight
                    size={18}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>

                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-6 py-3.5 font-bold text-slate-200 transition hover:border-white/30 hover:bg-white/5"
                >
                  Explore Platform
                  <ChevronRight size={18} />
                </Link>

              </div>

              {/* trust indicators */}
              <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-sm text-slate-500">
                <span className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-400" />
                  Machine Learning
                </span>

                <span className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-400" />
                  Real-time Analytics
                </span>

                <span className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-400" />
                  Secure Access
                </span>
              </div>
            </div>

            {/* RIGHT — ANALYTICS PREVIEW */}
            <div className="relative">

              <div className="absolute -inset-5 rounded-[2rem] bg-blue-500/10 blur-2xl" />

              <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/90 shadow-2xl shadow-black/40">

                {/* dashboard header */}
                <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-blue-400">
                      Live Intelligence
                    </p>
                    <h2 className="mt-1 text-lg font-bold">
                      Demand Overview
                    </h2>
                  </div>

                  <div className="flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-400">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    AI Active
                  </div>
                </div>

                {/* KPI cards */}
                <div className="grid grid-cols-2 gap-3 p-5">

                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500">
                        Avg Demand
                      </span>
                      <TrendingUp size={17} className="text-blue-400" />
                    </div>

                    <div className="mt-3 text-2xl font-bold">
                      104.82
                    </div>

                    <div className="mt-1 text-xs text-emerald-400">
                      +8.4% forecast accuracy
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500">
                        Peak Hour
                      </span>
                      <Gauge size={17} className="text-cyan-400" />
                    </div>

                    <div className="mt-3 text-2xl font-bold">
                      08:00
                    </div>

                    <div className="mt-1 text-xs text-slate-500">
                      Highest demand period
                    </div>
                  </div>

                </div>

                {/* chart */}
                <div className="px-5 pb-5">

                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">

                    <div className="mb-5 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold">
                          Passenger Demand
                        </p>
                        <p className="text-xs text-slate-500">
                          Hourly prediction trend
                        </p>
                      </div>

                      <BarChart3 size={19} className="text-blue-400" />
                    </div>

                    <div className="flex h-40 items-end gap-2">

                      {[38, 47, 56, 73, 88, 67, 52, 79, 94, 72, 58, 46].map(
                        (height, index) => (
                          <div
                            key={index}
                            className="group flex h-full flex-1 items-end"
                          >
                            <div
                              className="w-full rounded-t-lg bg-gradient-to-t from-blue-700 to-cyan-300 opacity-80 transition group-hover:opacity-100"
                              style={{ height: `${height}%` }}
                            />
                          </div>
                        )
                      )}

                    </div>

                    <div className="mt-3 flex justify-between text-[10px] text-slate-600">
                      <span>06 AM</span>
                      <span>09 AM</span>
                      <span>12 PM</span>
                      <span>03 PM</span>
                      <span>06 PM</span>
                    </div>

                  </div>
                </div>

                {/* status */}
                <div className="border-t border-white/10 bg-blue-500/5 px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                      <BrainCircuit size={19} />
                    </div>

                    <div>
                      <p className="text-sm font-semibold">
                        Gradient Boosting Model
                      </p>
                      <p className="text-xs text-slate-500">
                        Selected best-performing model
                      </p>
                    </div>

                    <div className="ml-auto text-right">
                      <p className="text-sm font-bold text-emerald-400">
                        R² 0.9932
                      </p>
                      <p className="text-[10px] text-slate-600">
                        Model score
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* ================= STATS ================= */}
        <section className="border-y border-white/10 bg-white/[0.025]">
          <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-white/10 lg:grid-cols-4">

            <div className="px-6 py-8 text-center">
              <div className="text-3xl font-black text-white">6K+</div>
              <p className="mt-1 text-sm text-slate-500">Transport Records</p>
            </div>

            <div className="px-6 py-8 text-center">
              <div className="text-3xl font-black text-white">3</div>
              <p className="mt-1 text-sm text-slate-500">ML Models</p>
            </div>

            <div className="px-6 py-8 text-center">
              <div className="text-3xl font-black text-white">99.3%</div>
              <p className="mt-1 text-sm text-slate-500">Best R² Score</p>
            </div>

            <div className="px-6 py-8 text-center">
              <div className="text-3xl font-black text-white">24/7</div>
              <p className="mt-1 text-sm text-slate-500">Analytics Access</p>
            </div>

          </div>
        </section>

        {/* ================= FEATURES ================= */}
        <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">

          <div className="mx-auto max-w-2xl text-center">

            <div className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-400">
              <Zap size={17} />
              Everything in one platform
            </div>

            <h2 className="text-4xl font-black tracking-tight sm:text-5xl">
              From raw transport data
              <br />
              to actionable insights.
            </h2>

            <p className="mt-5 text-slate-400">
              A complete analytics platform for understanding passenger
              demand and supporting smarter transport planning.
            </p>

          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">

            <FeatureCard
              icon={<BrainCircuit />}
              title="AI Demand Prediction"
              text="Predict passenger demand using machine learning models trained on transport patterns."
            />

            <FeatureCard
              icon={<BarChart3 />}
              title="Interactive Analytics"
              text="Explore demand by route, hour and weather through clear visual analytics."
            />

            <FeatureCard
              icon={<Route />}
              title="Route Intelligence"
              text="Understand which transport routes experience higher or lower passenger demand."
            />

            <FeatureCard
              icon={<CloudRain />}
              title="Weather Impact"
              text="Analyze how different weather conditions influence public transport demand."
            />

            <FeatureCard
              icon={<Gauge />}
              title="Model Comparison"
              text="Compare Linear Regression, Random Forest and Gradient Boosting performance."
            />

            <FeatureCard
              icon={<LockKeyhole />}
              title="Secure Platform"
              text="JWT authentication and role-based access keep user and administrator features protected."
            />

          </div>
        </section>

        {/* ================= HOW IT WORKS ================= */}
        <section className="border-y border-white/10 bg-slate-900/50">

          <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">

            <div className="grid gap-16 lg:grid-cols-2 lg:items-center">

              <div>

                <div className="mb-4 text-sm font-semibold uppercase tracking-widest text-blue-400">
                  How it works
                </div>

                <h2 className="text-4xl font-black sm:text-5xl">
                  Turn transport conditions
                  <span className="text-blue-400"> into predictions.</span>
                </h2>

                <p className="mt-5 max-w-xl leading-7 text-slate-400">
                  TransitPredict connects user inputs, machine learning and
                  analytics into a simple prediction workflow.
                </p>

                <Link
                  to="/register"
                  className="mt-8 inline-flex items-center gap-2 font-semibold text-blue-400 transition hover:text-blue-300"
                >
                  Try the platform
                  <ArrowRight size={18} />
                </Link>

              </div>

              <div className="space-y-4">

                <Step
                  number="01"
                  icon={<Route size={20} />}
                  title="Enter transport conditions"
                  text="Select the route, date, hour, weather and other demand factors."
                />

                <Step
                  number="02"
                  icon={<BrainCircuit size={20} />}
                  title="AI analyzes the data"
                  text="The trained machine learning model processes the selected conditions."
                />

                <Step
                  number="03"
                  icon={<TrendingUp size={20} />}
                  title="Get the demand forecast"
                  text="Receive a passenger-demand estimate and save it to your prediction history."
                />

              </div>

            </div>
          </div>
        </section>

        {/* ================= SECURITY / ML ================= */}
        <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">

          <div className="grid gap-5 md:grid-cols-2">

            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-blue-500/10 to-transparent p-8 lg:p-10">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                <ShieldCheck size={25} />
              </div>

              <h3 className="mt-7 text-2xl font-bold">
                Built with security in mind
              </h3>

              <p className="mt-3 leading-7 text-slate-400">
                Role-based access separates normal users from administrators,
                while JWT authentication protects application resources.
              </p>

              <div className="mt-6 space-y-3 text-sm text-slate-300">

                <div className="flex items-center gap-3">
                  <CheckCircle2 size={17} className="text-emerald-400" />
                  JWT authentication
                </div>

                <div className="flex items-center gap-3">
                  <CheckCircle2 size={17} className="text-emerald-400" />
                  Password hashing
                </div>

                <div className="flex items-center gap-3">
                  <CheckCircle2 size={17} className="text-emerald-400" />
                  USER / ADMIN authorization
                </div>

              </div>

            </div>

            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-cyan-500/10 to-transparent p-8 lg:p-10">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
                <BrainCircuit size={25} />
              </div>

              <h3 className="mt-7 text-2xl font-bold">
                Powered by machine learning
              </h3>

              <p className="mt-3 leading-7 text-slate-400">
                Multiple regression and ensemble models are evaluated using
                standard predictive performance metrics.
              </p>

              <div className="mt-6 grid grid-cols-3 gap-3">

                <ModelBadge name="Linear Regression" />
                <ModelBadge name="Random Forest" />
                <ModelBadge name="Gradient Boosting" />

              </div>

            </div>

          </div>
        </section>

        {/* ================= CTA ================= */}
        <section className="px-6 pb-24 lg:px-8">

          <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-blue-400/20 bg-gradient-to-r from-blue-600/20 via-blue-500/10 to-cyan-500/10 px-6 py-16 text-center lg:px-10">

            <div className="mx-auto max-w-3xl">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/15 text-blue-400">
                <Sparkles size={27} />
              </div>

              <h2 className="mt-7 text-4xl font-black sm:text-5xl">
                Ready to predict smarter?
              </h2>

              <p className="mx-auto mt-5 max-w-2xl text-slate-400">
                Start exploring public transport demand with machine learning
                and turn transport data into meaningful insights.
              </p>

              <Link
                to="/register"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-7 py-3.5 font-bold shadow-xl shadow-blue-600/25 transition hover:bg-blue-500"
              >
                Create Your Account
                <ArrowRight size={18} />
              </Link>

            </div>

          </div>

        </section>

      </main>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-white/10">

        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between lg:px-8">

          <div className="flex items-center gap-2">
            <BusFront size={18} className="text-blue-400" />
            <span>
              © {new Date().getFullYear()} TransitPredict
            </span>
          </div>

          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5">
              <Users size={15} />
              Public Transport Analytics
            </span>

            <span className="flex items-center gap-1.5">
              <LockKeyhole size={15} />
              Secure Platform
            </span>
          </div>

        </div>

      </footer>

    </div>
  );
}


/* ================= SMALL COMPONENTS ================= */

function FeatureCard({ icon, title, text }) {
  return (
    <div className="group rounded-3xl border border-white/10 bg-white/[0.035] p-7 transition duration-300 hover:-translate-y-1 hover:border-blue-400/30 hover:bg-white/[0.055]">

      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 transition group-hover:bg-blue-500/15">
        {icon}
      </div>

      <h3 className="mt-6 text-xl font-bold">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-slate-400">
        {text}
      </p>

      <div className="mt-5 flex items-center gap-1 text-xs font-semibold text-blue-400 opacity-0 transition group-hover:opacity-100">
        Explore feature
        <ChevronRight size={14} />
      </div>

    </div>
  );
}


function Step({ number, icon, title, text }) {
  return (
    <div className="flex gap-5 rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-blue-400/25 hover:bg-white/[0.05]">

      <div className="flex shrink-0 flex-col items-center gap-2">

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
          {icon}
        </div>

        <span className="text-[10px] font-bold tracking-widest text-slate-600">
          {number}
        </span>

      </div>

      <div>
        <h3 className="font-bold">
          {title}
        </h3>

        <p className="mt-1 text-sm leading-6 text-slate-400">
          {text}
        </p>
      </div>

    </div>
  );
}


function ModelBadge({ name }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/10 p-3 text-center text-xs font-medium text-slate-300">
      {name}
    </div>
  );
}