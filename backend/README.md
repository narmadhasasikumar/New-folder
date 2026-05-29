# PSG Hospital Navigation Backend

This backend provides APIs for hospital locations, QR code management, and shortest path routing using Dijkstra's algorithm.

## Setup

1. Copy `.env.example` to `.env`.
2. Update `MONGODB_URI` with your MongoDB connection string.
3. Install dependencies:
   ```bash
   cd backend
   npm install
   ```
4. Seed sample data:
   ```bash
   npm run seed
   ```
5. Start server:
   ```bash
   npm run dev
   ```

## APIs

- `GET /api/locations`
- `GET /api/locations/:id`
- `GET /api/locations/qr/:id`
- `GET /api/route?from=A&to=B&wheelchair=false&emergency=true`
- `POST /api/admin/location`
- `PUT /api/admin/location/:id`
- `POST /api/admin/qr`
