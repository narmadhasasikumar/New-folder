import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import QRCode from "qrcode";
import connectDB from "./config/db.js";
import locationRoutes from "./routes/locationRoutes.js";
import routeRoutes from "./routes/routeRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import mockLocations from "./data/mockLocations.js";
import { dijkstra } from "./algorithms/dijkstra.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const dbConnected = await connectDB();

if (dbConnected) {
  app.use("/api/locations", locationRoutes);
  app.use("/api/route", routeRoutes);
  app.use("/api/admin", adminRoutes);
} else {
  // Fallback mock endpoints when MongoDB is unavailable
  const mockQrLocations = [];

  app.get("/api/locations", (req, res) => {
    res.json(mockLocations);
  });

  app.get("/api/locations/qr/:id", (req, res) => {
    const id = req.params.id;
    const qrLocation = mockQrLocations.find((qr) => qr.locationId === id);
    if (!qrLocation || !qrLocation.qrData) {
      return res.status(404).json({ message: "QR location not found" });
    }
    res.json(qrLocation);
  });

  app.get("/api/locations/:id", (req, res) => {
    const id = req.params.id;
    const found = mockLocations.find((l) => l._id === id);
    if (!found) return res.status(404).json({ message: "Location not found" });
    res.json(found);
  });

  app.get("/api/route", (req, res) => {
    const { from, to } = req.query;
    if (!from || !to) return res.status(400).json({ message: "from and to are required" });

    const graph = {};
    mockLocations.forEach((loc) => {
      graph[loc._id] = {
        name: loc.name,
        landmark: loc.landmark,
        floor: loc.floor,
        image: loc.image || "",
        connections: loc.connections.map((c) => ({
          to: c.to,
          distance: c.distance,
          direction: c.direction,
          accessible: c.accessible !== undefined ? c.accessible : true,
          emergency: c.emergency !== undefined ? c.emergency : true,
        })),
      };
    });

    if (!graph[from] || !graph[to]) {
      return res.status(404).json({ message: "Start or destination location is not available in the current map." });
    }

    const result = dijkstra(graph, from, to);
    if (!result) return res.status(404).json({ message: "No route found" });

    const distance = result.totalDistance;
    const estimatedTime = Math.ceil(distance / 40);
    const path = result.path.map((id) => ({ id, name: graph[id]?.name || id, landmark: graph[id]?.landmark || "", floor: graph[id]?.floor || 0 }));
    const steps = result.steps.map((step, idx) => ({ step: idx + 1, from: graph[step.from]?.name || step.from, to: graph[step.to]?.name || step.to, direction: step.direction, landmark: graph[step.to]?.landmark || "", floor: graph[step.to]?.floor || 0 }));

    res.json({ path, distance: `${distance} meters`, time: `${estimatedTime} mins`, steps });
  });

  app.post("/api/admin/location", (req, res) => {
    const { _id, name, floor, landmark, description = "", image = "", type = "ward", connections = [] } = req.body;
    if (!_id || !name || floor === undefined || !landmark) {
      return res.status(400).json({ message: "_id, name, floor, and landmark are required" });
    }
    if (mockLocations.some((loc) => loc._id === _id)) {
      return res.status(409).json({ message: "Location already exists" });
    }
    const newLocation = { _id, name, floor, landmark, description, image, type, connections };
    mockLocations.push(newLocation);
    res.status(201).json(newLocation);
  });

  app.put("/api/admin/location/:id", (req, res) => {
    const id = req.params.id;
    const index = mockLocations.findIndex((loc) => loc._id === id);
    if (index === -1) {
      return res.status(404).json({ message: "Location not found" });
    }
    mockLocations[index] = { ...mockLocations[index], ...req.body };
    res.json(mockLocations[index]);
  });

  app.delete("/api/admin/location/:id", (req, res) => {
    const id = req.params.id;
    const index = mockLocations.findIndex((loc) => loc._id === id);
    if (index === -1) {
      return res.status(404).json({ message: "Location not found" });
    }
    mockLocations.splice(index, 1);
    // Remove connections in other mock locations that reference this id
    mockLocations.forEach((loc) => {
      if (Array.isArray(loc.connections)) {
        loc.connections = loc.connections.filter((c) => c && c.to !== id);
      }
    });
    res.json({ message: "Location removed successfully" });
  });

  app.post("/api/admin/qr", async (req, res) => {
    try {
      const { locationId, label } = req.body;
      if (!locationId) {
        return res.status(400).json({ message: "locationId is required" });
      }
      const location = mockLocations.find((loc) => loc._id === locationId);
      const qrPayload = {
        type: "ward",
        locationId,
        label: label || location?.name || locationId,
        generatedAt: new Date().toISOString(),
      };
      const qrData = await QRCode.toDataURL(JSON.stringify(qrPayload));
      const existingIndex = mockQrLocations.findIndex((qr) => qr.locationId === locationId);
      const qrLocation = { locationId, label: label || location?.name || locationId, qrData };
      if (existingIndex >= 0) {
        mockQrLocations[existingIndex] = qrLocation;
      } else {
        mockQrLocations.push(qrLocation);
      }
      res.json({ qrLocation, qrData });
    } catch (error) {
      res.status(500).json({ message: error.message || "Failed to generate QR code" });
    }
  });
}

app.get("/", (req, res) => {
  res.json({ message: "PSG Hospital Navigation API is online" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
