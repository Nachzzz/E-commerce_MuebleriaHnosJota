# Backend for Mueblería Jota Hnos

This is a minimal Express backend used by the frontend during development.

Endpoints
- GET /api/productos -> returns the array of products
- GET /api/productos/:id -> returns product by id (404 if not found)

Middleware
- A simple logger middleware prints method and URL for each request.
- express.json() is enabled for future POST usage.

Run locally
1. Open a terminal and `cd backend`
2. Install dependencies:

```bash
npm install
```

3. Start the server (dev with nodemon recommended):

```bash
npm run dev
```

The server listens on port 4000 by default.

Notes
- The frontend code attempts to fetch `/api/productos` first and falls back to the static `client/public/data/productos.json` if the backend is not running. If you run the backend, both the frontend (Vite) and backend can run concurrently.
- If you serve the frontend from a different origin, consider enabling CORS in the backend (`npm install cors` and `app.use(cors())`).
