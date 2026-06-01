import mongoose from "mongoose";

const wardSchema = new mongoose.Schema({
  name: { type: String, required: true },
  floor: { type: Number, required: true },
  description: { type: String, default: "" },
  category: { type: String, default: "General" },
  locationId: { type: String, required: true },
});

const Ward = mongoose.model("Ward", wardSchema);
export default Ward;
