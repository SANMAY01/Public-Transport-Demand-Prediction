import { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import {
  Activity,
  ArrowUpRight,
  BarChart3,
  Brain,
  CalendarDays,
  ChevronRight,
  CloudRain,
  RefreshCw,
  Route,
  Sparkles,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";

import api from "../services/api";

export default function Dashboard() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [routeFilter, setRouteFilter] = useState("All");
  const [weatherFilter, setWeatherFilter] = useState("All");

  async function loadDashboard(showRefresh = false) {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await api.get("/predictions/history");

      setHistory(response.data?.predictions || []);
    } catch (err) {
      console.error("Dashboard error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load dashboard data."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  const routes = useMemo(() => {
    return [
      "All",
      ...new Set(
        history
          .map((item) => item.route)
          .filter(Boolean)
      ),
    ];
  }, [history]);

  const weatherConditions = useMemo(() => {
    return [
      "All",
      ...new Set(
        history
          .map((item) => item.weather)
          .filter(Boolean)
      ),
    ];
  }, [history]);

  const filteredHistory = useMemo(() => {
    return history.filter((item) => {
      const routeMatch =
        routeFilter === "All" || item.route === routeFilter;

      const weatherMatch =
        weatherFilter === "All" ||
        item.weather === weatherFilter;

      return routeMatch && weatherMatch;
    });
  }, [history, routeFilter, weatherFilter]);

  const demandValues = filteredHistory
    .map((item) => Number(item.predicted_demand))
    .filter((value) => Number.isFinite(value));

  const totalPredictions = demandValues.length;

  const averageDemand =
    totalPredictions > 0
      ? demandValues.reduce((a, b) => a + b, 0) /
        totalPredictions
      : 0;

  const highestDemand =
    totalPredictions > 0
      ? Math.max(...demandValues)
      : 0;

  const lowestDemand =
    totalPredictions > 0
      ? Math.min(...demandValues)
      : 0;

  const demandRange =
    totalPredictions > 0
      ? highestDemand - lowestDemand
      : 0;

  const hourlyData = useMemo(() => {
    const grouped = {};

    filteredHistory.forEach((item) => {
      const hour = Number(item.hour);
      const demand = Number(item.predicted_demand);

      if (!Number.isFinite(hour) || !Number.isFinite(demand)) {
        return;
      }

      if (!grouped[hour]) {
        grouped[hour] = {
          hour,
          total: 0,
          count: 0,
        };
      }

      grouped[hour].total += demand;
      grouped[hour].count += 1;
    });

    return Object.values(grouped)
      .map((item) => ({
        hour: item.hour,
        demand: Number(
          (item.total / item.count).toFixed(2)
        ),
      }))
      .sort((a, b) => a.hour - b.hour);
  }, [filteredHistory]);

  const routeData = useMemo(() => {
    const grouped = {};

    filteredHistory.forEach((item) => {
      const route = item.route || "Unknown";
      const demand = Number(item.predicted_demand);

      if (!Number.isFinite(demand)) return;

      if (!grouped[route]) {
        grouped[route] = {
          route,
          total: 0,
          count: 0,
        };
      }

      grouped[route].total += demand;
      grouped[route].count += 1;
    });

    return Object.values(grouped)
      .map((item) => ({
        route: item.route,
        demand: Number(
          (item.total / item.count).toFixed(2)
        ),
      }))
      .sort((a, b) => b.demand - a.demand);
  }, [filteredHistory]);

  const weatherData = useMemo(() => {
    const grouped = {};

    filteredHistory.forEach((item) => {
      const weather = item.weather || "Unknown";
      const demand = Number(item.predicted_demand);

      if (!Number.isFinite(demand)) return;

      if (!grouped[weather]) {
        grouped[weather] = {
          weather,
          total: 0,
          count: 0,
        };
      }

      grouped[weather].total += demand;
      grouped[weather].count += 1;
    });

    return Object.values(grouped).map((item) => ({
      name: item.weather,
      value: Number(
        (item.total / item.count).toFixed(2)
      ),
    }));
  }, [filteredHistory]);

  const peakHour = useMemo(() => {
    if (!hourlyData.length) return null;

    return hourlyData.reduce((best, current) =>
      current.demand > best.demand ? current : best
    );
  }, [hourlyData]);

  const leadingRoute = useMemo(() => {
    if (!routeData.length) return null;

    return routeData[0];
  }, [routeData]);

  const bestWeather = useMemo(() => {
    if (!weatherData.length) return null;

    return weatherData.reduce((best, current) =>
      current.value > best.value ? current : best
    );
  }, [weatherData]);

  const recentPredictions = filteredHistory.slice(0, 6);

  const colors = [
    "#2563eb",
    "#06b6d4",
    "#8b5cf6",
    "#10b981",
    "#f59e0b",
  ];

  const formatHour = (hour) => {
    const h = Number(hour);

    if (h === 0) return "12 AM";
    if (h === 12) return "12 PM";

    return h < 12
      ? `${h} AM`
      : `${h - 12} PM`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-7xl">
          <div className="h-10 w-72 animate-pulse rounded-xl bg-slate-200" />

          <div className="mt-3 h-5 w-96 animate-pulse rounded bg-slate-200" />

          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-36 animate-pulse rounded-2xl bg-white shadow-sm"
              />
            ))}
          </div>

          <div className="mt-6 h-96 animate-pulse rounded-2xl bg-white shadow-sm" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-3xl rounded-2xl border border-red-200 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-bold text-red-600">
            Unable to load dashboard
          </h2>

          <p className="mt-2 text-slate-600">
            {error}
          </p>

          <button
            onClick={() => loadDashboard()}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            <RefreshCw size={17} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">

      {/* HERO */}
      <section className="relative overflow-hidden bg-slate-950 px-6 py-8 text-white">

        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-600/20 blur-3xl" />

        <div className="absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">

          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">

            <div>

              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-300">
                <Sparkles size={16} />
                AI Transport Intelligence
              </div>

              <h1 className="text-4xl font-black tracking-tight md:text-5xl">
                Demand Intelligence
              </h1>

              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-300">
                Monitor passenger demand, discover transport
                patterns and use machine-learning predictions
                to make smarter planning decisions.
              </p>

              <div className="mt-5 flex flex-wrap gap-5 text-sm text-slate-300">

                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  Prediction system active
                </span>

                <span className="flex items-center gap-2">
                  <Brain size={16} />
                  Machine learning enabled
                </span>

                <span className="flex items-center gap-2">
                  <Activity size={16} />
                  Live analytics
                </span>

              </div>

            </div>

            <button
              onClick={() => loadDashboard(true)}
              disabled={refreshing}
              className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 font-semibold backdrop-blur transition hover:bg-white/20 disabled:opacity-60"
            >
              <RefreshCw
                size={17}
                className={
                  refreshing
                    ? "animate-spin"
                    : ""
                }
              />

              {refreshing
                ? "Refreshing..."
                : "Refresh Data"}
            </button>

          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-6 py-7">

        {/* FILTERS */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Dashboard Filters
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Explore predictions by route and weather condition.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">

              <select
                value={routeFilter}
                onChange={(e) =>
                  setRouteFilter(e.target.value)
                }
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-blue-500"
              >
                {routes.map((route) => (
                  <option key={route} value={route}>
                    {route === "All"
                      ? "All Routes"
                      : route}
                  </option>
                ))}
              </select>

              <select
                value={weatherFilter}
                onChange={(e) =>
                  setWeatherFilter(e.target.value)
                }
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-blue-500"
              >
                {weatherConditions.map((weather) => (
                  <option key={weather} value={weather}>
                    {weather === "All"
                      ? "All Weather"
                      : weather}
                  </option>
                ))}
              </select>

            </div>

          </div>
        </div>

        {/* KPI CARDS */}
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

          <KpiCard
            icon={<BarChart3 size={22} />}
            label="Total Predictions"
            value={totalPredictions}
            description="Filtered forecasts"
            iconClass="bg-blue-50 text-blue-600"
          />

          <KpiCard
            icon={<TrendingUp size={22} />}
            label="Average Demand"
            value={averageDemand.toFixed(2)}
            description="Predicted passengers"
            iconClass="bg-cyan-50 text-cyan-600"
          />

          <KpiCard
            icon={<Zap size={22} />}
            label="Peak Demand"
            value={highestDemand.toFixed(2)}
            description="Highest forecast"
            iconClass="bg-violet-50 text-violet-600"
          />

          <KpiCard
            icon={<Users size={22} />}
            label="Demand Range"
            value={demandRange.toFixed(2)}
            description="Peak minus lowest"
            iconClass="bg-emerald-50 text-emerald-600"
          />

        </div>

        {/* INSIGHT CARDS */}
        <div className="mt-6 grid gap-5 lg:grid-cols-3">

          <InsightCard
            icon={<Activity size={20} />}
            title="Peak Demand Hour"
            value={
              peakHour
                ? formatHour(peakHour.hour)
                : "—"
            }
            text={
              peakHour
                ? `${peakHour.demand.toFixed(
                    2
                  )} average predicted passengers`
                : "Create predictions to discover the peak hour."
            }
          />

          <InsightCard
            icon={<Route size={20} />}
            title="Leading Route"
            value={
              leadingRoute
                ? leadingRoute.route
                : "—"
            }
            text={
              leadingRoute
                ? `${leadingRoute.demand.toFixed(
                    2
                  )} average predicted demand`
                : "Create predictions across routes."
            }
          />

          <InsightCard
            icon={<CloudRain size={20} />}
            title="Highest Demand Weather"
            value={
              bestWeather
                ? bestWeather.name
                : "—"
            }
            text={
              bestWeather
                ? `${bestWeather.value.toFixed(
                    2
                  )} average predicted passengers`
                : "Create predictions under different weather conditions."
            }
          />

        </div>

        {/* AI INSIGHT */}
        <div className="mt-6 overflow-hidden rounded-2xl bg-gradient-to-r from-slate-950 via-blue-950 to-cyan-950 p-6 text-white shadow-lg">

          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

            <div className="flex gap-4">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-500/20 text-blue-300">
                <Brain size={24} />
              </div>

              <div>

                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold uppercase tracking-wider text-blue-300">
                    AI Insight
                  </span>

                  <span className="rounded-full bg-emerald-500/20 px-2 py-1 text-xs text-emerald-300">
                    LIVE
                  </span>
                </div>

                <h2 className="mt-2 text-xl font-bold">
                  What the data says
                </h2>

                <p className="mt-2 max-w-3xl leading-6 text-slate-300">

                  {totalPredictions === 0
                    ? "Create predictions to generate intelligent demand insights."
                    : `The current filtered dataset contains ${totalPredictions} forecasts with an average predicted demand of ${averageDemand.toFixed(
                        2
                      )} passengers. ${
                        peakHour
                          ? `The strongest observed period is ${formatHour(
                              peakHour.hour
                            )}.`
                          : ""
                      } ${
                        leadingRoute
                          ? `The leading route is ${leadingRoute.route}.`
                          : ""
                      }`}

                </p>

              </div>
            </div>

            <a
              href="/analytics"
              className="inline-flex w-fit shrink-0 items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-blue-700 transition hover:bg-blue-50"
            >
              Explore Analytics
              <ChevronRight size={17} />
            </a>

          </div>
        </div>

        {/* CHART GRID */}
        <div className="mt-6 grid gap-6 xl:grid-cols-2">

          {/* HOURLY */}
          <ChartCard
            icon={<TrendingUp size={20} />}
            title="Demand by Hour"
            subtitle="Average predicted passengers across time"
          >

            {hourlyData.length === 0 ? (
              <EmptyChart />
            ) : (
              <div className="h-80">

                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >

                  <LineChart data={hourlyData}>

                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                    />

                    <XAxis
                      dataKey="hour"
                      tickFormatter={formatHour}
                    />

                    <YAxis />

                    <Tooltip
                      formatter={(value) => [
                        `${Number(value).toFixed(
                          2
                        )} passengers`,
                        "Demand",
                      ]}
                      labelFormatter={(label) =>
                        `Time: ${formatHour(label)}`
                      }
                    />

                    <Line
                      type="monotone"
                      dataKey="demand"
                      stroke="#2563eb"
                      strokeWidth={4}
                      dot={{
                        r: 5,
                        fill: "#2563eb",
                      }}
                      activeDot={{
                        r: 8,
                      }}
                    />

                  </LineChart>

                </ResponsiveContainer>

              </div>
            )}

          </ChartCard>

          {/* ROUTES */}
          <ChartCard
            icon={<Route size={20} />}
            title="Route Performance"
            subtitle="Average predicted demand by route"
          >

            {routeData.length === 0 ? (
              <EmptyChart />
            ) : (
              <div className="h-80">

                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >

                  <BarChart data={routeData}>

                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                    />

                    <XAxis dataKey="route" />

                    <YAxis />

                    <Tooltip
                      formatter={(value) => [
                        `${Number(value).toFixed(
                          2
                        )} passengers`,
                        "Average Demand",
                      ]}
                    />

                    <Bar
                      dataKey="demand"
                      radius={[8, 8, 0, 0]}
                      fill="#7c3aed"
                    />

                  </BarChart>

                </ResponsiveContainer>

              </div>
            )}

          </ChartCard>

        </div>

        {/* WEATHER + QUICK SUMMARY */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">

          {/* WEATHER */}
          <ChartCard
            icon={<CloudRain size={20} />}
            title="Weather Impact"
            subtitle="Average demand under each weather condition"
          >

            {weatherData.length === 0 ? (
              <EmptyChart />
            ) : (
              <div className="grid items-center gap-4 md:grid-cols-2">

                <div className="h-72">

                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >

                    <PieChart>

                      <Pie
                        data={weatherData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={65}
                        outerRadius={100}
                        paddingAngle={4}
                      >

                        {weatherData.map(
                          (_, index) => (
                            <Cell
                              key={index}
                              fill={
                                colors[
                                  index %
                                    colors.length
                                ]
                              }
                            />
                          )
                        )}

                      </Pie>

                      <Tooltip
                        formatter={(value) => [
                          `${Number(value).toFixed(
                            2
                          )} passengers`,
                          "Average Demand",
                        ]}
                      />

                    </PieChart>

                  </ResponsiveContainer>

                </div>

                <div className="space-y-3">

                  {weatherData.map(
                    (item, index) => (
                      <div
                        key={item.name}
                        className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
                      >

                        <div className="flex items-center gap-3">

                          <span
                            className="h-3 w-3 rounded-full"
                            style={{
                              background:
                                colors[
                                  index %
                                    colors.length
                                ],
                            }}
                          />

                          <span className="font-medium text-slate-700">
                            {item.name}
                          </span>

                        </div>

                        <strong className="text-slate-900">
                          {item.value.toFixed(2)}
                        </strong>

                      </div>
                    )
                  )}

                </div>

              </div>
            )}

          </ChartCard>

          {/* QUICK SUMMARY */}
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Activity size={21} />
              </div>

              <div>
                <h2 className="font-bold text-slate-900">
                  Demand Summary
                </h2>

                <p className="text-sm text-slate-500">
                  Current filtered view
                </p>
              </div>

            </div>

            <div className="mt-6 space-y-4">

              <SummaryRow
                icon={<CalendarDays size={18} />}
                label="Forecasts"
                value={totalPredictions}
              />

              <SummaryRow
                icon={<Users size={18} />}
                label="Average passengers"
                value={averageDemand.toFixed(2)}
              />

              <SummaryRow
                icon={<Zap size={18} />}
                label="Highest prediction"
                value={highestDemand.toFixed(2)}
              />

              <SummaryRow
                icon={<ArrowUpRight size={18} />}
                label="Lowest prediction"
                value={lowestDemand.toFixed(2)}
              />

              <SummaryRow
                icon={<Route size={18} />}
                label="Routes represented"
                value={routeData.length}
              />

              <SummaryRow
                icon={<CloudRain size={18} />}
                label="Weather conditions"
                value={weatherData.length}
              />

            </div>

            <a
              href="/predict"
              className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Create New Prediction
              <ChevronRight size={17} />
            </a>

          </div>

        </div>

        {/* RECENT PREDICTIONS */}
        <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">

          <div className="flex flex-col justify-between gap-3 border-b border-slate-100 p-6 sm:flex-row sm:items-center">

            <div>

              <h2 className="text-xl font-bold text-slate-900">
                Recent Predictions
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Latest machine-learning demand forecasts
              </p>

            </div>

            <a
              href="/history"
              className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              View all
              <ChevronRight size={16} />
            </a>

          </div>

          {recentPredictions.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              No predictions match the selected filters.
            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full min-w-[700px] text-left">

                <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">

                  <tr>

                    <th className="px-6 py-4">
                      Date
                    </th>

                    <th className="px-6 py-4">
                      Hour
                    </th>

                    <th className="px-6 py-4">
                      Route
                    </th>

                    <th className="px-6 py-4">
                      Weather
                    </th>

                    <th className="px-6 py-4 text-right">
                      Predicted Demand
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {recentPredictions.map(
                    (item, index) => (
                      <tr
                        key={item.id || index}
                        className="border-t border-slate-100 transition hover:bg-slate-50"
                      >

                        <td className="px-6 py-4 font-medium text-slate-700">
                          {item.date}
                        </td>

                        <td className="px-6 py-4 text-slate-600">
                          {formatHour(item.hour)}
                        </td>

                        <td className="px-6 py-4">

                          <span className="inline-flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-700">
                            <Route size={14} />
                            {item.route}
                          </span>

                        </td>

                        <td className="px-6 py-4 text-slate-600">
                          {item.weather}
                        </td>

                        <td className="px-6 py-4 text-right">

                          <span className="font-bold text-slate-900">
                            {Number(
                              item.predicted_demand
                            ).toFixed(2)}
                          </span>

                          <span className="ml-1 text-xs text-slate-400">
                            passengers
                          </span>

                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>

            </div>
          )}

        </div>

        {/* BOTTOM CTA */}
        <div className="mt-6 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 p-7 text-white shadow-lg">

          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">

            <div>

              <div className="flex items-center gap-2 text-blue-100">
                <Sparkles size={18} />
                Ready for another forecast?
              </div>

              <h2 className="mt-2 text-2xl font-black">
                Predict your next passenger demand.
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-blue-50">
                Enter route, time and environmental conditions
                to generate a new machine-learning prediction.
              </p>

            </div>

            <a
              href="/predict"
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-6 py-3 font-bold text-blue-700 transition hover:bg-blue-50"
            >
              Predict Demand
              <ChevronRight size={18} />
            </a>

          </div>

        </div>

      </main>
    </div>
  );
}


/* ---------------- COMPONENTS ---------------- */

function KpiCard({
  icon,
  label,
  value,
  description,
  iconClass,
}) {
  return (
    <div className="group rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 transition duration-300 hover:-translate-y-1 hover:shadow-lg">

      <div className="flex items-start justify-between">

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconClass}`}
        >
          {icon}
        </div>

        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600">
          LIVE
        </span>

      </div>

      <p className="mt-5 text-sm font-medium text-slate-500">
        {label}
      </p>

      <h2 className="mt-1 text-3xl font-black tracking-tight text-slate-900">
        {value}
      </h2>

      <p className="mt-2 text-xs text-slate-400">
        {description}
      </p>

    </div>
  );
}


function InsightCard({
  icon,
  title,
  value,
  text,
}) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 transition hover:shadow-md">

      <div className="flex items-center gap-3">

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
          {icon}
        </div>

        <p className="text-sm font-medium text-slate-500">
          {title}
        </p>

      </div>

      <h3 className="mt-4 text-2xl font-black text-slate-900">
        {value}
      </h3>

      <p className="mt-1 text-sm text-slate-500">
        {text}
      </p>

    </div>
  );
}


function ChartCard({
  icon,
  title,
  subtitle,
  children,
}) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">

      <div className="flex items-center gap-3">

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          {icon}
        </div>

        <div>
          <h2 className="font-bold text-slate-900">
            {title}
          </h2>

          <p className="text-sm text-slate-500">
            {subtitle}
          </p>
        </div>

      </div>

      <div className="mt-5">
        {children}
      </div>

    </div>
  );
}


function SummaryRow({
  icon,
  label,
  value,
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">

      <div className="flex items-center gap-3">

        <span className="text-slate-500">
          {icon}
        </span>

        <span className="text-sm text-slate-600">
          {label}
        </span>

      </div>

      <strong className="text-slate-900">
        {value}
      </strong>

    </div>
  );
}


function EmptyChart() {
  return (
    <div className="flex h-80 flex-col items-center justify-center rounded-xl border border-slate-700 bg-slate-900/70 text-center">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10">
        <span className="text-xl text-blue-400">📊</span>
      </div>

      <p className="font-medium text-slate-300">
        Not enough data
      </p>

      <p className="mt-1 text-sm text-slate-500">
        Make more predictions to populate this chart.
      </p>
    </div>
  );
}