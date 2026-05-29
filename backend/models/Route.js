import mongoose from "mongoose";

const routeSchema = new mongoose.Schema({
  from: { type: String, required: true },
  to: { type: String, required: true },
  distance: { type: Number, required: true },
  timeMinutes: { type: Number, required: true },
  accessible: { type: Boolean, default: true },
  path: { type: [String], default: [] },
});

const Route = mongoose.model("Route", routeSchema);
export default Route;
