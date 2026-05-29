import mongoose from "mongoose";

const connectionSchema = new mongoose.Schema({
  to: { type: String, required: true },
  distance: { type: Number, required: true },
  direction: { type: String, default: "Walk towards the next landmark" },
  accessible: { type: Boolean, default: true },
  emergency: { type: Boolean, default: true },
});

const locationSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  floor: { type: Number, required: true },
  landmark: { type: String, required: true },
  description: { type: String, default: "" },
  image: { type: String, default: "" },
  type: { type: String, default: "ward" },
  connections: [connectionSchema],
});

const Location = mongoose.model("Location", locationSchema);
export default Location;
