import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Filter,
  RotateCcw,
  ArrowUpDown,
  CalendarDays,
  Clock3,
  Bus,
  CloudSun,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Activity,
} from "lucide-react";

import api from "../services/api";
import ExportCSVButton from "../components/ExportCSVButton";

export default function History() {
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");
  const [routeFilter, setRouteFilter] = useState("All Routes");
  const [weatherFilter, setWeatherFilter] = useState("All Weather");
  const [sortBy, setSortBy] = useState("newest");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/predictions/history")
      .then((r) => {
        setRows(r.data.predictions || []);
      })
      .catch((err) => {
        console.error("Failed to load prediction history:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // -----------------------------------
  // Unique filter options
  // -----------------------------------

  const routes = useMemo(() => {
    const values = rows
      .map((r) => r.route)
      .filter(Boolean);

    return ["All Routes", ...new Set(values)];
  }, [rows]);

  const weatherOptions = useMemo(() => {
    const values = rows
      .map((r) => r.weather)
      .filter(Boolean);

    return ["All Weather", ...new Set(values)];
  }, [rows]);

  // -----------------------------------
  // Filter + Search + Sort
  // -----------------------------------

  const filteredRows = useMemo(() => {
    let result = [...rows];

    // Search
    if (search.trim()) {
      const query = search.toLowerCase();

      result = result.filter((r) =>
        [
          r.date,
          r.hour,
          r.route,
          r.weather,
          r.predicted_demand,
        ]
          .join(" ")
          .toLowerCase()
          .includes(query)
      );
    }

    // Route
    if (routeFilter !== "All Routes") {
      result = result.filter(
        (r) => r.route === routeFilter
      );
    }

    // Weather
    if (weatherFilter !== "All Weather") {
      result = result.filter(
        (r) => r.weather === weatherFilter
      );
    }

    // Sorting
    result.sort((a, b) => {
      const demandA = Number(a.predicted_demand) || 0;
      const demandB = Number(b.predicted_demand) || 0;

      if (sortBy === "highest") {
        return demandB - demandA;
      }

      if (sortBy === "lowest") {
        return demandA - demandB;
      }

      if (sortBy === "oldest") {
        return (
          new Date(`${a.date} ${a.hour}:00`) -
          new Date(`${b.date} ${b.hour}:00`)
        );
      }

      // newest
      return (
        new Date(`${b.date} ${b.hour}:00`) -
        new Date(`${a.date} ${a.hour}:00`)
      );
    });

    return result;
  }, [
    rows,
    search,
    routeFilter,
    weatherFilter,
    sortBy,
  ]);

  // -----------------------------------
  // Statistics
  // -----------------------------------

  const demandValues = filteredRows
    .map((r) => Number(r.predicted_demand))
    .filter((value) => Number.isFinite(value));

  const totalPredictions = filteredRows.length;

  const averageDemand =
    demandValues.length > 0
      ? demandValues.reduce(
          (sum, value) => sum + value,
          0
        ) / demandValues.length
      : 0;

  const highestDemand =
    demandValues.length > 0
      ? Math.max(...demandValues)
      : 0;

  const lowestDemand =
    demandValues.length > 0
      ? Math.min(...demandValues)
      : 0;

  // -----------------------------------
  // Reset
  // -----------------------------------

  const resetFilters = () => {
    setSearch("");
    setRouteFilter("All Routes");
    setWeatherFilter("All Weather");
    setSortBy("newest");
  };

  // -----------------------------------
  // Demand badge
  // -----------------------------------

  const getDemandStatus = (value) => {
    const demand = Number(value) || 0;

    if (demand >= 110) {
      return {
        label: "High",
        className:
          "bg-emerald-50 text-emerald-700 border-emerald-200",
      };
    }

    if (demand >= 100) {
      return {
        label: "Normal",
        className:
          "bg-blue-50 text-blue-700 border-blue-200",
      };
    }

    return {
      label: "Low",
      className:
        "bg-orange-50 text-orange-700 border-orange-200",
    };
  };

  return (
    <div className="space-y-6 pb-10">

      {/* -------------------------------- */}
      {/* HEADER */}
      {/* -------------------------------- */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
            <Activity size={14} />
            DEMAND FORECAST CENTER
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Prediction History
          </h1>

          <p className="mt-1 text-slate-500">
            Search, filter and analyze your saved passenger-demand forecasts.
          </p>
        </div>

        <ExportCSVButton
          rows={filteredRows}
          filename="prediction-history.csv"
        />
      </div>

      {/* -------------------------------- */}
      {/* STAT CARDS */}
      {/* -------------------------------- */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {/* Total */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Predictions
              </p>

              <h2 className="mt-2 text-3xl font-bold text-slate-900">
                {totalPredictions}
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Filtered forecasts
              </p>
            </div>

            <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
              <BarChart3 size={22} />
            </div>
          </div>
        </div>

        {/* Average */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Average Demand
              </p>

              <h2 className="mt-2 text-3xl font-bold text-slate-900">
                {averageDemand.toFixed(2)}
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Average passengers
              </p>
            </div>

            <div className="rounded-xl bg-cyan-50 p-3 text-cyan-600">
              <TrendingUp size={22} />
            </div>
          </div>
        </div>

        {/* Highest */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Peak Demand
              </p>

              <h2 className="mt-2 text-3xl font-bold text-slate-900">
                {highestDemand.toFixed(2)}
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Highest prediction
              </p>
            </div>

            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
              <TrendingUp size={22} />
            </div>
          </div>
        </div>

        {/* Lowest */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Lowest Demand
              </p>

              <h2 className="mt-2 text-3xl font-bold text-slate-900">
                {lowestDemand.toFixed(2)}
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Lowest prediction
              </p>
            </div>

            <div className="rounded-xl bg-orange-50 p-3 text-orange-600">
              <TrendingDown size={22} />
            </div>
          </div>
        </div>
      </div>

      {/* -------------------------------- */}
      {/* FILTER PANEL */}
      {/* -------------------------------- */}

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-blue-600" />

              <h2 className="font-semibold text-slate-900">
                Search & Filters
              </h2>
            </div>

            <p className="mt-1 text-xs text-slate-500">
              Narrow down your prediction history.
            </p>
          </div>

          <button
            onClick={resetFilters}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
          >
            <RotateCcw size={15} />
            Reset Filters
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">

          {/* Search */}
          <div className="relative xl:col-span-2">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search route, weather, date..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Route */}
          <select
            value={routeFilter}
            onChange={(e) =>
              setRouteFilter(e.target.value)
            }
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
          >
            {routes.map((route) => (
              <option key={route} value={route}>
                {route}
              </option>
            ))}
          </select>

          {/* Weather */}
          <select
            value={weatherFilter}
            onChange={(e) =>
              setWeatherFilter(e.target.value)
            }
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
          >
            {weatherOptions.map((weather) => (
              <option
                key={weather}
                value={weather}
              >
                {weather}
              </option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <ArrowUpDown size={16} />
            Sort by
          </div>

          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value)
            }
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          >
            <option value="newest">
              Newest First
            </option>

            <option value="oldest">
              Oldest First
            </option>

            <option value="highest">
              Highest Demand
            </option>

            <option value="lowest">
              Lowest Demand
            </option>
          </select>

          <span className="text-xs text-slate-400">
            Showing {filteredRows.length} of{" "}
            {rows.length} predictions
          </span>
        </div>
      </div>

      {/* -------------------------------- */}
      {/* TABLE */}
      {/* -------------------------------- */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="flex flex-col gap-2 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold text-slate-900">
              Forecast Records
            </h2>

            <p className="text-xs text-slate-500">
              Saved machine-learning predictions
            </p>
          </div>

          <div className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
            {filteredRows.length} records
          </div>
        </div>

        <div className="overflow-x-auto">

          {loading ? (
            <div className="flex min-h-[300px] items-center justify-center">
              <div className="text-center">
                <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
                <p className="text-sm text-slate-500">
                  Loading prediction history...
                </p>
              </div>
            </div>
          ) : (
            <table className="w-full min-w-[850px] text-left text-sm">

              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-5 py-4 font-semibold text-slate-600">
                    Date
                  </th>

                  <th className="px-5 py-4 font-semibold text-slate-600">
                    Time
                  </th>

                  <th className="px-5 py-4 font-semibold text-slate-600">
                    Route
                  </th>

                  <th className="px-5 py-4 font-semibold text-slate-600">
                    Weather
                  </th>

                  <th className="px-5 py-4 font-semibold text-slate-600">
                    Demand
                  </th>

                  <th className="px-5 py-4 font-semibold text-slate-600">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredRows.map((r, i) => {
                  const status = getDemandStatus(
                    r.predicted_demand
                  );

                  return (
                    <tr
                      key={r.id || i}
                      className="border-b border-slate-100 transition last:border-0 hover:bg-blue-50/40"
                    >
                      {/* Date */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <CalendarDays
                            size={16}
                            className="text-blue-500"
                          />

                          <span className="font-medium text-slate-700">
                            {r.date}
                          </span>
                        </div>
                      </td>

                      {/* Time */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Clock3
                            size={16}
                            className="text-slate-400"
                          />

                          {r.hour}
                        </div>
                      </td>

                      {/* Route */}
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-1.5 font-medium text-blue-700">
                          <Bus size={15} />
                          {r.route}
                        </span>
                      </td>

                      {/* Weather */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 text-slate-600">
                          <CloudSun
                            size={17}
                            className="text-cyan-500"
                          />

                          {r.weather}
                        </div>
                      </td>

                      {/* Demand */}
                      <td className="px-5 py-4">
                        <div className="flex items-baseline gap-1">
                          <span className="text-base font-bold text-slate-900">
                            {Number(
                              r.predicted_demand
                            ).toFixed(2)}
                          </span>

                          <span className="text-xs text-slate-400">
                            passengers
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${status.className}`}
                        >
                          {status.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}

                {!filteredRows.length && (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-5 py-16 text-center"
                    >
                      <div className="mx-auto flex max-w-sm flex-col items-center">
                        <div className="mb-4 rounded-2xl bg-slate-100 p-4 text-slate-400">
                          <Search size={28} />
                        </div>

                        <h3 className="font-semibold text-slate-700">
                          No predictions found
                        </h3>

                        <p className="mt-1 text-sm text-slate-400">
                          Try changing your search or filters.
                        </p>

                        <button
                          onClick={resetFilters}
                          className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                        >
                          Clear Filters
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* -------------------------------- */}
      {/* BOTTOM INFO */}
      {/* -------------------------------- */}

      <div className="rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-600 to-cyan-500 p-6 text-white shadow-lg">

        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-blue-100">
              <Activity size={17} />
              Prediction Analytics
            </div>

            <h3 className="text-xl font-bold">
              Your forecasts are ready for analysis.
            </h3>

            <p className="mt-1 max-w-2xl text-sm text-blue-100">
              Use filters to compare routes, weather conditions
              and passenger-demand predictions. Export the current
              filtered view whenever you need the data.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-3 rounded-xl bg-white/10 px-5 py-4 backdrop-blur-sm">
            <div className="rounded-lg bg-white/15 p-2">
              <TrendingUp size={20} />
            </div>

            <div>
              <p className="text-xs text-blue-100">
                Current average
              </p>

              <p className="text-xl font-bold">
                {averageDemand.toFixed(2)}
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}