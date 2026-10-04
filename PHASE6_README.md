# Phase 6 — Advanced Analytics & Model Insights

## What this phase adds
- Working Model Performance page
- MAE, RMSE and R² comparison
- Best-model summary
- Feature-importance visualization
- CSV export component for prediction history

## Copy these files
1. `frontend/src/pages/ModelPerformance.jsx` -> your `frontend/src/pages/`
2. `frontend/src/components/ExportCSVButton.jsx` -> your `frontend/src/components/`
3. Append `frontend/src/phase6.css` to the bottom of your existing `frontend/src/index.css`

## Add Model Performance route
In `frontend/src/App.jsx` add:
`import ModelPerformance from "./pages/ModelPerformance.jsx";`

Add this route beside your existing routes:
`<Route path="/model-performance" element={<ModelPerformance />} />`

Add a sidebar/navigation link to `/model-performance` named `Model Performance`.

## Important
Do NOT replace `main.jsx`, `vite.config.js`, or your whole App.jsx.

The page uses the Phase 3 backend endpoints:
- GET `/api/models/performance`
- GET `/api/models/features`

Keep Flask running on port 5000 and Vite on port 5173.
Then open:
`http://localhost:5173/model-performance`
