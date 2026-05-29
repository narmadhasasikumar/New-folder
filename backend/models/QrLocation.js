import mongoose from "mongoose";

const qrLocationSchema = new mongoose.Schema({
  locationId: { type: String, required: true, unique: true },
  label: { type: String, required: true },
  active: { type: Boolean, default: true },
});

const QrLocation = mongoose.model("QrLocation", qrLocationSchema);
export default QrLocation;
