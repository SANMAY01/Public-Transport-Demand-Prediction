import { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import {
  Activity,
  BarChart3,
  CloudRain,
  Route as RouteIcon,
  TrendingUp,
  Users,
  RefreshCw,
  Brain,
  CalendarDays,
  Zap,
} from "lucide-react";

const API_URL = "http://127.0.0.1:5000/api";

const PIE_COLORS = ["#3b82f6", "#06b6d4", "#8b5cf6", "#10b981"];

function formatHour(hour) {
  const h = Number(hour);

  if (Number.isNaN(h)) return hour;

  if (h === 0) return "12 AM";
  if (h === 12) return "12 PM";
  if (h < 12) return `${h} AM`;

  return `${h - 12} PM`;
}

function StatCard({ icon: Icon, title, value, subtitle }) {
  return (
    <div className="rounded-2xl border border-slate-700 bg-gradient-to-br from-slate-900 to-slate-800 p-5 shadow-lg transition duration-200 hover:-translate-y-1 hover:border-blue-500/40 hover:shadow-blue-950/30">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-400">
            {title}
          </p>

          <p className="mt-2 text-3xl font-bold text-white">
            {value}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            {subtitle}
          </p>
        </div>

        <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-3">
          <Icon className="h-6 w-6 text-blue-400" />
        </div>
      </div>
    </div>
  );
}

function EmptyChart({ message = "No data available." }) {
  return (
    <div className="flex h-80 flex-col items-center justify-center rounded-xl border border-slate-700 bg-slate-900/70 text-center">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10">
        <BarChart3 className="h-6 w-6 text-blue-400" />
      </div>

      <p className="font-medium text-slate-300">
        {message}
      </p>

      <p className="mt-1 text-sm text-slate-500">
        Make more predictions to populate this chart.
      </p>
    </div>
  );
}

export default function Analytics() {
  const [data, setData] = useState({
    hourly: [],
    route: [],
    weather: [],
  });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadAnalytics = async () => {
    try {
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please login again.");
      }

      const response = await fetch(`${API_URL}/analytics`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(
          `Analytics request failed: ${response.status}`
        );
      }

      const result = await response.json();

      setData({
        hourly: Array.isArray(result.hourly)
          ? result.hourly
          : [],
        route: Array.isArray(result.route)
          ? result.route
          : [],
        weather: Array.isArray(result.weather)
          ? result.weather
          : [],
      });
    } catch (err) {
      console.error("Analytics error:", err);
      setError(err.message || "Unable to load analytics.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  const refreshData = () => {
    setRefreshing(true);
    loadAnalytics();
  };

  const statistics = useMemo(() => {
    const allValues = [
      ...data.hourly,
      ...data.route,
      ...data.weather,
    ]
      .map((item) => Number(item.average_demand))
      .filter((value) => Number.isFinite(value));

    const routeValues = data.route
      .map((item) => ({
        route: item.route,
        demand: Number(item.average_demand),
      }))
      .filter((item) => Number.isFinite(item.demand));

    const hourlyValues = data.hourly
      .map((item) => ({
        hour: Number(item.hour),
        demand: Number(item.average_demand),
      }))
      .filter(
        (item) =>
          Number.isFinite(item.hour) &&
          Number.isFinite(item.demand)
      );

    const totalForecasts = data.route.reduce(
      (sum, item) => sum + Number(item.count || 0),
      0
    );

    const averageDemand =
      routeValues.length > 0
        ? routeValues.reduce(
            (sum, item) => sum + item.demand,
            0
          ) / routeValues.length
        : 0;

    const peakDemand =
      allValues.length > 0
        ? Math.max(...allValues)
        : 0;

    const leadingRoute =
      routeValues.length > 0
        ? routeValues.reduce((best, current) =>
            current.demand > best.demand
              ? current
              : best
          )
        : null;

    const peakHour =
      hourlyValues.length > 0
        ? hourlyValues.reduce((best, current) =>
            current.demand > best.demand
              ? current
              : best
          )
        : null;

    return {
      totalForecasts,
      averageDemand,
      peakDemand,
      leadingRoute,
      peakHour,
    };
  }, [data]);

  const hourlyChartData = useMemo(() => {
    return data.hourly
      .map((item) => ({
        ...item,
        hourLabel: formatHour(item.hour),
        average_demand: Number(item.average_demand),
      }))
      .sort(
        (a, b) => Number(a.hour) - Number(b.hour)
      );
  }, [data.hourly]);

  const routeChartData = useMemo(() => {
    return data.route.map((item) => ({
      ...item,
      average_demand: Number(item.average_demand),
      count: Number(item.count || 0),
    }));
  }, [data.route]);

  const weatherChartData = useMemo(() => {
    return data.weather.map((item) => ({
      ...item,
      average_demand: Number(item.average_demand),
    }));
  }, [data.weather]);

  const aiInsight = useMemo(() => {
    if (
      !statistics.leadingRoute ||
      !statistics.peakHour
    ) {
      return "Make more predictions to generate meaningful demand insights.";
    }

    const routeName = statistics.leadingRoute.route;
    const routeDemand = statistics.leadingRoute.demand;
    const hour = formatHour(statistics.peakHour.hour);

    return `The strongest predicted demand is ${routeDemand.toFixed(
      2
    )} passengers on ${routeName}. The busiest observed prediction period is around ${hour}. These patterns can help transport planners allocate vehicles and capacity more effectively.`;
  }, [statistics]);

  if (loading) {
    return (
      <div className="dashboard-dark space-y-6">
        <div>
          <div className="h-8 w-48 animate-pulse rounded bg-slate-800" />
          <div className="mt-2 h-4 w-80 animate-pulse rounded bg-slate-800" />
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-32 animate-pulse rounded-2xl border border-slate-800 bg-slate-900"
            />
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="h-96 animate-pulse rounded-2xl border border-slate-800 bg-slate-900" />
          <div className="h-96 animate-pulse rounded-2xl border border-slate-800 bg-slate-900" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-dark space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Analytics
          </h1>

          <p className="mt-1 text-slate-400">
            Analyze passenger-demand prediction patterns.
          </p>
        </div>

        <div className="rounded-2xl border border-red-900/60 bg-red-950/30 p-6">
          <h2 className="font-semibold text-red-400">
            Unable to load analytics
          </h2>

          <p className="mt-2 text-sm text-red-300">
            {error}
          </p>

          <button
            onClick={refreshData}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-500"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const hasData =
    data.hourly.length > 0 ||
    data.route.length > 0 ||
    data.weather.length > 0;

  return (
    <div className="dashboard-dark space-y-6 pb-10">
      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400">
            <Activity className="h-4 w-4" />
            DEMAND ANALYTICS CENTER
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-white">
            Transport Analytics
          </h1>

          <p className="mt-1 text-slate-400">
            Explore passenger-demand patterns from your
            machine-learning forecasts.
          </p>
        </div>

        <button
          onClick={refreshData}
          disabled={refreshing}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-semibold text-slate-300 shadow-lg transition hover:border-blue-500/40 hover:bg-slate-800 disabled:opacity-60"
        >
          <RefreshCw
            className={`h-4 w-4 ${
              refreshing ? "animate-spin" : ""
            }`}
          />

          {refreshing ? "Refreshing..." : "Refresh Data"}
        </button>
      </div>

      {!hasData ? (
        <div className="rounded-2xl border border-slate-700 bg-slate-900 p-12 text-center shadow-lg">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10">
            <BarChart3 className="h-8 w-8 text-blue-400" />
          </div>

          <h2 className="mt-5 text-xl font-semibold text-white">
            No analytics data yet
          </h2>

          <p className="mx-auto mt-2 max-w-md text-slate-400">
            Create some passenger-demand predictions first.
            Your route, hourly and weather analytics will
            appear here automatically.
          </p>
        </div>
      ) : (
        <>
          {/* KPI CARDS */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              icon={CalendarDays}
              title="Total Forecasts"
              value={statistics.totalForecasts}
              subtitle="Saved prediction records"
            />

            <StatCard
              icon={Users}
              title="Average Demand"
              value={statistics.averageDemand.toFixed(2)}
              subtitle="Average predicted passengers"
            />

            <StatCard
              icon={TrendingUp}
              title="Peak Demand"
              value={statistics.peakDemand.toFixed(2)}
              subtitle="Highest observed forecast"
            />

            <StatCard
              icon={RouteIcon}
              title="Routes Analyzed"
              value={data.route.length}
              subtitle="Transport routes represented"
            />
          </div>

          {/* AI INSIGHT */}
          <div className="overflow-hidden rounded-2xl border border-blue-900/50 bg-gradient-to-r from-slate-950 via-blue-950 to-cyan-950 p-6 text-white shadow-xl">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-cyan-400/20 bg-white/10">
                  <Brain className="h-6 w-6 text-cyan-300" />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold tracking-widest text-cyan-300">
                      AI INSIGHT
                    </p>

                    <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                      LIVE
                    </span>
                  </div>

                  <h2 className="mt-1 text-xl font-bold">
                    What the data says
                  </h2>

                  <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-300">
                    {aiInsight}
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-3 rounded-xl border border-white/10 bg-white/10 px-4 py-3">
                <Zap className="h-5 w-5 text-cyan-300" />

                <div>
                  <p className="text-xs text-slate-400">
                    Peak period
                  </p>

                  <p className="font-bold">
                    {statistics.peakHour
                      ? formatHour(statistics.peakHour.hour)
                      : "—"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* HOUR + ROUTE */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* HOURLY */}
            <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-lg">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="rounded-lg border border-blue-500/20 bg-blue-500/10 p-2">
                      <TrendingUp className="h-5 w-5 text-blue-400" />
                    </div>

                    <h2 className="text-lg font-bold text-white">
                      Demand by Hour
                    </h2>
                  </div>

                  <p className="mt-2 text-sm text-slate-400">
                    Average predicted passengers across time.
                  </p>
                </div>
              </div>

              <div className="mt-6 h-80">
                {hourlyChartData.length > 0 ? (
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    <LineChart data={hourlyChartData}>
                      <CartesianGrid
                        stroke="#26334a"
                        strokeDasharray="3 3"
                        vertical={false}
                      />

                      <XAxis
                        dataKey="hourLabel"
                        tick={{
                          fontSize: 12,
                          fill: "#94a3b8",
                        }}
                        axisLine={{
                          stroke: "#334155",
                        }}
                        tickLine={false}
                      />

                      <YAxis
                        tick={{
                          fontSize: 12,
                          fill: "#94a3b8",
                        }}
                        axisLine={false}
                        tickLine={false}
                      />

                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#111827",
                          border: "1px solid #334155",
                          borderRadius: "12px",
                          color: "#f8fafc",
                        }}
                        labelStyle={{
                          color: "#cbd5e1",
                        }}
                        formatter={(value) => [
                          Number(value).toFixed(2),
                          "Passengers",
                        ]}
                      />

                      <Line
                        type="monotone"
                        dataKey="average_demand"
                        stroke="#60a5fa"
                        strokeWidth={3}
                        dot={{
                          r: 5,
                          fill: "#60a5fa",
                        }}
                        activeDot={{
                          r: 7,
                          fill: "#38bdf8",
                        }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <EmptyChart message="No hourly data available." />
                )}
              </div>
            </div>

            {/* ROUTE */}
            <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-lg">
              <div>
                <div className="flex items-center gap-2">
                  <div className="rounded-lg border border-violet-500/20 bg-violet-500/10 p-2">
                    <RouteIcon className="h-5 w-5 text-violet-400" />
                  </div>

                  <h2 className="text-lg font-bold text-white">
                    Route Performance
                  </h2>
                </div>

                <p className="mt-2 text-sm text-slate-400">
                  Average predicted demand by transport route.
                </p>
              </div>

              <div className="mt-6 h-80">
                {routeChartData.length > 0 ? (
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    <BarChart data={routeChartData}>
                      <CartesianGrid
                        stroke="#26334a"
                        strokeDasharray="3 3"
                        vertical={false}
                      />

                      <XAxis
                        dataKey="route"
                        tick={{
                          fontSize: 12,
                          fill: "#94a3b8",
                        }}
                        axisLine={{
                          stroke: "#334155",
                        }}
                        tickLine={false}
                      />

                      <YAxis
                        tick={{
                          fontSize: 12,
                          fill: "#94a3b8",
                        }}
                        axisLine={false}
                        tickLine={false}
                      />

                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#111827",
                          border: "1px solid #334155",
                          borderRadius: "12px",
                          color: "#f8fafc",
                        }}
                        formatter={(value) => [
                          Number(value).toFixed(2),
                          "Average Demand",
                        ]}
                      />

                      <Bar
                        dataKey="average_demand"
                        name="Average Demand"
                        fill="#8b5cf6"
                        radius={[7, 7, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <EmptyChart message="No route data available." />
                )}
              </div>
            </div>
          </div>

          {/* WEATHER + SUMMARY */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* WEATHER */}
            <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-lg">
              <div>
                <div className="flex items-center gap-2">
                  <div className="rounded-lg border border-cyan-500/20 bg-cyan-500/10 p-2">
                    <CloudRain className="h-5 w-5 text-cyan-400" />
                  </div>

                  <h2 className="text-lg font-bold text-white">
                    Weather Impact
                  </h2>
                </div>

                <p className="mt-2 text-sm text-slate-400">
                  Average passenger demand under different
                  weather conditions.
                </p>
              </div>

              <div className="mt-6 h-80">
                {weatherChartData.length > 0 ? (
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    <PieChart>
                      <Pie
                        data={weatherChartData}
                        dataKey="average_demand"
                        nameKey="weather"
                        cx="50%"
                        cy="50%"
                        innerRadius={65}
                        outerRadius={105}
                        paddingAngle={3}
                        label
                      >
                        {weatherChartData.map(
                          (_, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={
                                PIE_COLORS[
                                  index %
                                    PIE_COLORS.length
                                ]
                              }
                            />
                          )
                        )}
                      </Pie>

                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#111827",
                          border: "1px solid #334155",
                          borderRadius: "12px",
                          color: "#f8fafc",
                        }}
                        formatter={(value) => [
                          Number(value).toFixed(2),
                          "Average Demand",
                        ]}
                      />

                      <Legend
                        wrapperStyle={{
                          color: "#cbd5e1",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <EmptyChart message="No weather data available." />
                )}
              </div>
            </div>

            {/* SUMMARY */}
            <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-lg">
              <div className="flex items-center gap-2">
                <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-2">
                  <Activity className="h-5 w-5 text-emerald-400" />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-white">
                    Demand Summary
                  </h2>

                  <p className="text-sm text-slate-400">
                    Current prediction analytics.
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {[
                  [
                    "Forecasts",
                    statistics.totalForecasts,
                    "text-white",
                  ],
                  [
                    "Average passengers",
                    statistics.averageDemand.toFixed(2),
                    "text-white",
                  ],
                  [
                    "Highest prediction",
                    statistics.peakDemand.toFixed(2),
                    "text-white",
                  ],
                  [
                    "Leading route",
                    statistics.leadingRoute
                      ? statistics.leadingRoute.route
                      : "—",
                    "text-blue-400",
                  ],
                  [
                    "Peak hour",
                    statistics.peakHour
                      ? formatHour(
                          statistics.peakHour.hour
                        )
                      : "—",
                    "text-white",
                  ],
                  [
                    "Weather conditions",
                    data.weather.length,
                    "text-white",
                  ],
                ].map(([label, value, valueClass]) => (
                  <div
                    key={label}
                    className="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-800/70 p-4"
                  >
                    <span className="text-sm text-slate-400">
                      {label}
                    </span>

                    <span
                      className={`font-bold ${valueClass}`}
                    >
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ROUTE TABLE */}
          {routeChartData.length > 0 && (
            <div className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-lg">
              <div className="border-b border-slate-700 p-6">
                <div className="flex items-center gap-2">
                  <RouteIcon className="h-5 w-5 text-blue-400" />

                  <h2 className="text-lg font-bold text-white">
                    Route Demand Summary
                  </h2>
                </div>

                <p className="mt-1 text-sm text-slate-400">
                  Comparison of predicted passenger demand
                  across routes.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-800">
                    <tr>
                      <th className="px-6 py-4 text-sm font-semibold text-slate-300">
                        Route
                      </th>

                      <th className="px-6 py-4 text-sm font-semibold text-slate-300">
                        Predictions
                      </th>

                      <th className="px-6 py-4 text-sm font-semibold text-slate-300">
                        Average Demand
                      </th>

                      <th className="px-6 py-4 text-sm font-semibold text-slate-300">
                        Performance
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {routeChartData.map((item) => {
                      const isLeading =
                        statistics.leadingRoute &&
                        item.route ===
                          statistics.leadingRoute.route;

                      return (
                        <tr
                          key={item.route}
                          className="border-t border-slate-700 transition hover:bg-slate-800/70"
                        >
                          <td className="px-6 py-4 font-semibold text-white">
                            {item.route}
                          </td>

                          <td className="px-6 py-4 text-slate-400">
                            {item.count}
                          </td>

                          <td className="px-6 py-4 font-bold text-slate-200">
                            {item.average_demand.toFixed(2)}
                          </td>

                          <td className="px-6 py-4">
                            {isLeading ? (
                              <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-400">
                                Leading
                              </span>
                            ) : (
                              <span className="rounded-full border border-slate-600 bg-slate-800 px-3 py-1 text-xs font-medium text-slate-400">
                                Normal
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* FOOTER CTA */}
          <div className="rounded-2xl border border-blue-500/20 bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-600 p-6 text-white shadow-xl">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-medium text-blue-100">
                  MACHINE-LEARNING DEMAND ANALYSIS
                </p>

                <h2 className="mt-1 text-xl font-bold">
                  Use these insights to plan transport capacity.
                </h2>

                <p className="mt-1 text-sm text-blue-100">
                  Compare routes, time periods and weather
                  conditions before making operational decisions.
                </p>
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-3">
                <Brain className="h-5 w-5" />

                <span className="text-sm font-semibold">
                  ML Powered
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}