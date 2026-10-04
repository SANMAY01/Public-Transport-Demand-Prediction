import { useEffect, useState } from "react";
import api from "../services/api";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function ModelPerformance() {
  const [performance, setPerformance] = useState([]);
  const [features, setFeatures] = useState([]);
  const [bestModel, setBestModel] = useState("");
  const [datasetRecords, setDatasetRecords] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      setError("");

      const [performanceRes, featuresRes] = await Promise.all([
        api.get("/models/performance"),
        api.get("/models/features"),
      ]);

      console.log("Performance API:", performanceRes.data);
      console.log("Features API:", featuresRes.data);

      const performanceData = performanceRes.data;
      const featureData = featuresRes.data;

      // --------------------------------
      // BEST MODEL
      // --------------------------------

      setBestModel(
        performanceData.best_model ||
          performanceData.bestModel ||
          ""
      );

      // --------------------------------
      // DATASET RECORDS
      // --------------------------------

      setDatasetRecords(
        Number(
          performanceData.dataset_records ||
            performanceData.datasetRecords ||
            0
        )
      );

      // --------------------------------
      // MODEL METRICS
      // --------------------------------

      const metrics = performanceData.metrics || {};

      const modelNames = Object.keys(metrics);

      const formattedModels = modelNames.map((modelName) => {
        const values = metrics[modelName] || {};

        return {
          model: modelName,

          mae: Number(
            values.MAE ??
              values.mae ??
              values.mean_absolute_error ??
              0
          ),

          rmse: Number(
            values.RMSE ??
              values.rmse ??
              values.root_mean_squared_error ??
              0
          ),

          r2: Number(
            values.R2 ??
              values.r2 ??
              values["R²"] ??
              values.r_squared ??
              0
          ),
        };
      });

      setPerformance(formattedModels);

      // --------------------------------
      // FEATURE IMPORTANCE
      // --------------------------------

      let featureValues =
        featureData.feature_importance ||
        featureData.features ||
        featureData.data ||
        featureData;

      let formattedFeatures = [];

      if (Array.isArray(featureValues)) {
        formattedFeatures = featureValues.map((item) => ({
          feature:
            item.feature ||
            item.name ||
            item.Feature ||
            "Unknown",

          importance: Number(
            item.importance ??
              item.Importance ??
              item.value ??
              item.score ??
              0
          ),
        }));
      } else if (
        featureValues &&
        typeof featureValues === "object"
      ) {
        formattedFeatures = Object.entries(featureValues).map(
          ([feature, importance]) => ({
            feature,
            importance: Number(importance),
          })
        );
      }

      formattedFeatures = formattedFeatures
        .filter((item) => item.feature !== "Unknown")
        .sort((a, b) => b.importance - a.importance);

      setFeatures(formattedFeatures);
    } catch (err) {
      console.error("Model Performance Error:", err);

      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Unable to load model performance data."
      );
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Model Performance
        </h1>

        <p className="mt-1 text-slate-500">
          Compare machine learning models and understand which
          model performs best.
        </p>

        <div className="card mt-6 p-10 text-center">
          Loading model performance...
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Model Performance
        </h1>

        <p className="mt-1 text-slate-500">
          Compare machine learning models and understand which
          model performs best.
        </p>
      </div>

      {/* ERROR */}
      {error && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
          <p className="font-semibold">
            Model data could not be loaded
          </p>

          <p className="mt-1 text-sm">
            {error}
          </p>
        </div>
      )}

      {/* SUMMARY CARDS */}
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="card p-6">
          <p className="text-sm text-slate-500">
            Best Performing Model
          </p>

          <h2 className="mt-2 text-2xl font-bold text-blue-600">
            {bestModel || "Not available"}
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Selected based on the highest R² score.
          </p>
        </div>

        <div className="card p-6">
          <p className="text-sm text-slate-500">
            Dataset Records
          </p>

          <h2 className="mt-2 text-2xl font-bold text-slate-900">
            {datasetRecords.toLocaleString()}
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Records used for model training and evaluation.
          </p>
        </div>
      </div>

      {/* MODEL COMPARISON */}
      <div className="card mt-6 overflow-hidden">
        <div className="border-b px-6 py-5">
          <h2 className="text-xl font-bold text-slate-900">
            MAE, RMSE and R² Comparison
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Linear Regression vs Random Forest vs Gradient
            Boosting.
          </p>
        </div>

        {performance.length === 0 ? (
          <div className="p-10 text-center text-slate-400">
            No model performance data available.
          </div>
        ) : (
          <>
            <div className="h-96 p-6">
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <BarChart data={performance}>
                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey="model" />

                  <YAxis />

                  <Tooltip />

                  <Legend />

                  <Bar
                    dataKey="mae"
                    name="MAE"
                    fill="#2563eb"
                  />

                  <Bar
                    dataKey="rmse"
                    name="RMSE"
                    fill="#7c3aed"
                  />

                  <Bar
                    dataKey="r2"
                    name="R²"
                    fill="#16a34a"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* TABLE */}
            <div className="overflow-x-auto border-t">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 font-semibold">
                      Model
                    </th>

                    <th className="px-6 py-4 font-semibold">
                      MAE
                    </th>

                    <th className="px-6 py-4 font-semibold">
                      RMSE
                    </th>

                    <th className="px-6 py-4 font-semibold">
                      R²
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {performance.map((item) => (
                    <tr
                      key={item.model}
                      className="border-t"
                    >
                      <td className="px-6 py-4 font-medium">
                        {item.model}
                      </td>

                      <td className="px-6 py-4">
                        {item.mae.toFixed(4)}
                      </td>

                      <td className="px-6 py-4">
                        {item.rmse.toFixed(4)}
                      </td>

                      <td className="px-6 py-4 font-semibold">
                        {item.r2.toFixed(4)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* FEATURE IMPORTANCE */}
      <div className="card mt-6 overflow-hidden">
        <div className="border-b px-6 py-5">
          <h2 className="text-xl font-bold text-slate-900">
            Feature Importance
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Variables that influence passenger demand
            prediction.
          </p>
        </div>

        {features.length === 0 ? (
          <div className="p-10 text-center text-slate-400">
            No feature importance data available.
          </div>
        ) : (
          <div className="h-[500px] p-6">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <BarChart
                data={features}
                layout="vertical"
                margin={{
                  left: 30,
                  right: 30,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis
                  type="number"
                  domain={[0, "auto"]}
                />

                <YAxis
                  type="category"
                  dataKey="feature"
                  width={180}
                  tick={{ fontSize: 11 }}
                />

                <Tooltip />

                <Bar
                  dataKey="importance"
                  name="Importance"
                  fill="#2563eb"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* METRIC EXPLANATION */}
      <div className="card mt-6 p-6">
        <h2 className="text-xl font-bold text-slate-900">
          Understanding the Metrics
        </h2>

        <div className="mt-5 grid gap-6 md:grid-cols-3">
          <div>
            <h3 className="font-semibold">
              MAE
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Mean Absolute Error represents the average
              absolute difference between actual and predicted
              passenger demand. Lower values are better.
            </p>
          </div>

          <div>
            <h3 className="font-semibold">
              RMSE
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Root Mean Squared Error gives more weight to large
              prediction errors. Lower values are better.
            </p>
          </div>

          <div>
            <h3 className="font-semibold">
              R²
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              R² measures how well the model explains variation
              in passenger demand. Higher values are better.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}