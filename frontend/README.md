# Product Catalog Frontend

## Environment

Create a `.env` file in `frontend/`:

```bash
VITE_API_URL=http://localhost:3000
```

For deployed environments, set `VITE_API_URL` to your backend HTTPS URL.

## Build

Build production assets:

```bash
npm run build
```

## Camera and Deployment Notes

- Mobile browsers typically require **HTTPS** for camera access.
- If camera scanning is unavailable (permissions/device/HTTP), users can still use image upload and manual barcode entry.
- Backend CORS must allow the deployed frontend origin (`CLIENT_URL` in backend environment).
