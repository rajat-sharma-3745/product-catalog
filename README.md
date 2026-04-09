# Product Catalog (MERN)

This project is a barcode-based product catalog flow built with a React frontend and an Express + MongoDB backend.
Users can scan or enter a barcode, fetch product details, perform a mock payment, and store successful purchases in a catalog view.

## Tech Stack

- Frontend: React (Vite), React Router, Tailwind CSS, `html5-qrcode`
- Backend: Node.js, Express, Mongoose
- Database: MongoDB

## Project Structure

- `frontend/` - UI, scanner/manual/file upload flow, payment + catalog pages
- `backend/` - API routes for scan, payments, catalog, validation, and error handling

## Run Locally

### 1) Backend

Create `backend/.env`:

```env
MONGODB_URI=<your_mongodb_connection_string>
PORT=3000
CLIENT_URL=http://localhost:5173
```

Start backend:

```bash
cd backend
npm install
npm run dev
```

### 2) Frontend

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:3000
```

Start frontend:

```bash
cd frontend
npm install
npm run dev
```

Build frontend:

```bash
cd frontend
npm run build
```

## Brief Explanation

### Approach

- Followed a modular MERN structure with clear separation between API, validation, and UI layers.
- Implemented one common barcode pipeline for camera scan, file upload, and manual input to keep behavior consistent.
- Kept the user flow simple and linear: scan/lookup -> product details -> mock payment -> add to catalog.
- Focused on mobile-first layout, fallback paths (upload/manual), and practical UX polish.

### Key Decisions

- Used `barcode` as the primary lookup key and normalized input to remove spaces/dashes.
- Kept payment and catalog as separate API steps for clearer backend responsibilities.
- Added client and server validation with consistent error response format (`{ message, errors? }`).
- Added loading guards and disabled states to prevent duplicate submissions.
- Added accessibility basics (labels, focus-visible styles, modal semantics, Escape to close).

### Challenges Faced

- Camera behavior varies by device/browser permissions and requires HTTPS in many mobile contexts.
- Managing duplicate triggers from scanner callbacks required in-flight guards and scanner stop logic.
- Handling mixed API response shapes (populated refs vs direct fields) required normalization on catalog rendering.
- Balancing small-screen usability with desktop behavior required responsive adjustments around input/button layout.

## Deployment Notes

- Use HTTPS for reliable camera access on mobile browsers.
- Set frontend `VITE_API_URL` to deployed backend URL.
- Configure backend `CLIENT_URL` to allow the deployed frontend origin via CORS.
