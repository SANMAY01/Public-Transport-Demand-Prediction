import { useMemo, useState } from "react";
import {
  Activity,
  ArrowRight,
  Brain,
  CalendarDays,
  CheckCircle2,
  CloudRain,
  Gauge,
  RotateCcw,
  Sparkles,
  Thermometer,
  Users,
  Wind,
  Zap,
} from "lucide-react";
import api from "../services/api";

const initialForm = {
  date: new Date().toISOString().split("T")[0],
  hour: 8,
  route: "Route 1",
  weather: "Sunny",
  temperature: 28,
  humidity: 60,
  holiday: 0,
  weekend: 0,
  previous_demand: 100,
};

function InputLabel({ icon: Icon, children }) {
  return (
    <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
      <Icon size={16} className="text-blue-600" />
      {children}
    </label>
  );
}

function DemandLevel({ value }) {
  if (value === null || value === undefined) return null;

  let label = "Moderate Demand";
  let description = "Normal passenger demand is expected.";
  let badgeClass = "bg-amber-50 text-amber-700 border-amber-200";
  let iconClass = "text-amber-600";

  if (value >= 105) {
    label = "High Demand";
    description = "Higher passenger demand is expected.";
    badgeClass = "bg-emerald-50 text-emerald-700 border-emerald-200";
    iconClass = "text-emerald-600";
  } else if (value < 100) {
    label = "Low Demand";
    description = "Lower passenger demand is expected.";
    badgeClass = "bg-blue-50 text-blue-700 border-blue-200";
    iconClass = "text-blue-600";
  }

  return (
    <div className={`mt-5 rounded-2xl border p-4 ${badgeClass}`}>
      <div className="flex items-center gap-3">
        <Gauge size={22} className={iconClass} />
        <div>
          <p className="font-bold">{label}</p>
          <p className="mt-1 text-sm opacity-80">{description}</p>
        </div>
      </div>
    </div>
  );
}

export default function Prediction() {
  const [form, setForm] = useState(initialForm);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setPrediction(null);
    setError("");
  };

  const hourLabel = useMemo(() => {
    const hour = Number(form.hour);

    if (hour === 0) return "12 AM";
    if (hour < 12) return `${hour} AM`;
    if (hour === 12) return "12 PM";
    return `${hour - 12} PM`;
  }, [form.hour]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setError("");
    setPrediction(null);

    try {
      const payload = {
        date: form.date,
        hour: Number(form.hour),
        route: form.route,
        weather: form.weather,
        temperature: Number(form.temperature),
        humidity: Number(form.humidity),
        holiday: Number(form.holiday),
        weekend: Number(form.weekend),
        previous_demand: Number(form.previous_demand),
      };

      const response = await api.post("/predictions/predict", payload);

      const data = response.data || {};

      const predictedValue =
        data.predicted_demand ??
        data.prediction?.predicted_demand ??
        data.prediction ??
        data.predictedDemand;

      if (predictedValue === undefined || predictedValue === null) {
        throw new Error("Prediction value was not returned by the server.");
      }

      setPrediction({
        value: Number(predictedValue),
        model:
          data.model ||
          data.model_name ||
          data.prediction?.model ||
          "Gradient Boosting",
      });
    } catch (err) {
      console.error(err);

      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Unable to generate prediction. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-7 pb-10">
      {/* Header */}
      <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-blue-950 to-blue-900 p-7 text-white shadow-xl">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-400/10 px-4 py-2 text-sm font-medium text-blue-200">
              <Sparkles size={16} />
              AI Transport Intelligence
            </div>

            <h1 className="text-3xl font-black tracking-tight md:text-4xl">
              Demand Prediction
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-100/80 md:text-base">
              Enter route, time and environmental conditions to generate an
              AI-powered passenger demand forecast.
            </p>
          </div>

          <div className="hidden rounded-2xl border border-white/10 bg-white/5 p-5 lg:block">
            <div className="flex items-center gap-3">
              <Brain className="text-cyan-300" size={28} />
              <div>
                <p className="text-xs uppercase tracking-wider text-blue-200">
                  ML Engine
                </p>
                <p className="font-bold">Gradient Boosting</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main grid */}
      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        {/* Form */}
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-7">
          <div className="mb-7 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                  <Activity size={22} />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Prediction Inputs
                  </h2>
                  <p className="text-sm text-slate-500">
                    Configure the travel conditions
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={resetForm}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              <RotateCcw size={16} />
              Reset
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              {/* Date */}
              <div>
                <InputLabel icon={CalendarDays}>Date</InputLabel>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => updateField("date", e.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />
              </div>

              {/* Hour */}
              <div>
                <InputLabel icon={Activity}>Hour</InputLabel>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="23"
                    value={form.hour}
                    onChange={(e) => updateField("hour", e.target.value)}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-20 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                    {hourLabel}
                  </span>
                </div>
              </div>

              {/* Route */}
              <div>
                <InputLabel icon={Wind}>Transport Route</InputLabel>
                <select
                  value={form.route}
                  onChange={(e) => updateField("route", e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                >
                  <option>Route 1</option>
                  <option>Route 2</option>
                  <option>Route 3</option>
                  <option>Route 4</option>
                  <option>Route 5</option>
                </select>
              </div>

              {/* Weather */}
              <div>
                <InputLabel icon={CloudRain}>Weather Condition</InputLabel>
                <select
                  value={form.weather}
                  onChange={(e) => updateField("weather", e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                >
                  <option>Sunny</option>
                  <option>Cloudy</option>
                  <option>Rainy</option>
                </select>
              </div>

              {/* Temperature */}
              <div>
                <InputLabel icon={Thermometer}>Temperature (°C)</InputLabel>
                <input
                  type="number"
                  value={form.temperature}
                  onChange={(e) =>
                    updateField("temperature", e.target.value)
                  }
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />
              </div>

              {/* Humidity */}
              <div>
                <InputLabel icon={Wind}>Humidity (%)</InputLabel>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={form.humidity}
                  onChange={(e) => updateField("humidity", e.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />
              </div>

              {/* Holiday */}
              <div>
                <InputLabel icon={CalendarDays}>Holiday</InputLabel>
                <select
                  value={form.holiday}
                  onChange={(e) => updateField("holiday", e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                >
                  <option value="0">No Holiday</option>
                  <option value="1">Holiday</option>
                </select>
              </div>

              {/* Weekend */}
              <div>
                <InputLabel icon={CalendarDays}>Weekend</InputLabel>
                <select
                  value={form.weekend}
                  onChange={(e) => updateField("weekend", e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                >
                  <option value="0">Weekday</option>
                  <option value="1">Weekend</option>
                </select>
              </div>
            </div>

            {/* Previous demand */}
            <div>
              <InputLabel icon={Users}>Previous Passenger Demand</InputLabel>
              <input
                type="number"
                min="0"
                value={form.previous_demand}
                onChange={(e) =>
                  updateField("previous_demand", e.target.value)
                }
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
              <p className="mt-2 text-xs text-slate-400">
                Historical demand used as an important ML feature.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-3.5 font-bold text-white shadow-lg shadow-blue-200 transition hover:scale-[1.01] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Analyzing Demand...
                </>
              ) : (
                <>
                  <Zap size={19} />
                  Generate AI Prediction
                  <ArrowRight size={19} />
                </>
              )}
            </button>
          </form>
        </section>

        {/* Result */}
        <section className="rounded-3xl bg-slate-950 p-6 text-white shadow-xl md:p-7">
          {!prediction ? (
            <div className="flex min-h-[560px] flex-col items-center justify-center text-center">
              <div className="mb-6 rounded-3xl bg-blue-500/10 p-6">
                <Brain size={54} className="text-blue-400" />
              </div>

              <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
                AI Prediction
              </p>

              <h2 className="mt-3 text-3xl font-black">
                Ready to forecast
              </h2>

              <p className="mt-4 max-w-sm text-sm leading-6 text-slate-400">
                Enter your travel conditions and let the trained machine
                learning model estimate passenger demand.
              </p>

              <div className="mt-8 grid w-full max-w-sm grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-left">
                  <Brain size={18} className="text-cyan-400" />
                  <p className="mt-3 text-xs text-slate-400">Model</p>
                  <p className="mt-1 font-bold">Gradient Boosting</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-left">
                  <Gauge size={18} className="text-blue-400" />
                  <p className="mt-3 text-xs text-slate-400">Output</p>
                  <p className="mt-1 font-bold">Passengers</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="min-h-[560px]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-widest text-cyan-400">
                    Prediction Result
                  </p>
                  <h2 className="mt-2 text-2xl font-black">
                    AI demand forecast
                  </h2>
                </div>

                <div className="rounded-full bg-emerald-400/10 p-3 text-emerald-400">
                  <CheckCircle2 size={24} />
                </div>
              </div>

              <div className="mt-8 rounded-3xl border border-white/10 bg-gradient-to-br from-blue-500/20 to-cyan-400/10 p-7 text-center">
                <p className="text-sm text-slate-400">
                  Predicted passenger demand
                </p>

                <div className="mt-4 flex items-end justify-center gap-3">
                  <span className="text-6xl font-black tracking-tight text-white">
                    {prediction.value.toFixed(2)}
                  </span>
                </div>

                <p className="mt-2 font-medium text-cyan-300">passengers</p>
              </div>

              <DemandLevel value={prediction.value} />

              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
                  <span className="text-sm text-slate-400">Route</span>
                  <span className="font-bold">{form.route}</span>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
                  <span className="text-sm text-slate-400">Time</span>
                  <span className="font-bold">{hourLabel}</span>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
                  <span className="text-sm text-slate-400">Weather</span>
                  <span className="font-bold">{form.weather}</span>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
                  <span className="text-sm text-slate-400">ML Model</span>
                  <span className="font-bold">{prediction.model}</span>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-blue-400/20 bg-blue-400/10 p-4">
                <div className="flex gap-3">
                  <Sparkles
                    size={20}
                    className="mt-0.5 shrink-0 text-cyan-300"
                  />
                  <div>
                    <p className="font-bold text-cyan-200">
                      Prediction generated successfully
                    </p>
                    <p className="mt-1 text-sm leading-5 text-slate-400">
                      This forecast has been saved to your prediction history.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Information cards */}
      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <Brain className="text-blue-600" size={22} />
          <h3 className="mt-4 font-bold text-slate-900">
            Machine Learning
          </h3>
          <p className="mt-2 text-sm leading-5 text-slate-500">
            Uses the trained demand prediction model to estimate passenger
            volume.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <Activity className="text-cyan-600" size={22} />
          <h3 className="mt-4 font-bold text-slate-900">
            Multiple Features
          </h3>
          <p className="mt-2 text-sm leading-5 text-slate-500">
            Route, time, weather, temperature, humidity and historical demand
            influence the forecast.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <CheckCircle2 className="text-emerald-600" size={22} />
          <h3 className="mt-4 font-bold text-slate-900">
            Saved Automatically
          </h3>
          <p className="mt-2 text-sm leading-5 text-slate-500">
            Every successful prediction is stored and can be reviewed from
            Prediction History.
          </p>
        </div>
      </section>
    </div>
  );
}