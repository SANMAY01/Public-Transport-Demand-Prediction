# Phase 4 — React Frontend

## Requirements
- Node.js 18+ recommended
- Phase 3 Flask backend running on http://127.0.0.1:5000

## Setup
Open PowerShell in this `frontend` folder:
1. `npm install`
2. `npm run dev`
3. Open the Vite URL shown in the terminal (normally http://localhost:5173)

## Notes
- JWT is stored in localStorage for this academic/local project.
- Axios automatically sends the token to Flask.
- The UI uses live API data; dashboard/analytics are not hardcoded.
- Forgot Password is a UI page only because Phase 1/3 does not provide a reset-token/email backend endpoint yet.
