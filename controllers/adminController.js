import Location from "../models/Location.js";
import QrLocation from "../models/QrLocation.js";
import QRCode from "qrcode";

export const addLocation = async (req, res, next) => {
  try {
    const location = new Location(req.body);
    await location.save();
    res.status(201).json(location);
  } catch (error) {
    next(error);
  }
};

export const editLocation = async (req, res, next) => {
  try {
    const updated = await Location.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      return res.status(404).json({ message: "Location not found" });
    }
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

export const deleteLocation = async (req, res, next) => {
  try {
    const deleted = await Location.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Location not found" });
    }

    // Remove any connections in other locations that point to the deleted location
    try {
      await Location.updateMany(
        { "connections.to": req.params.id },
        { $pull: { connections: { to: req.params.id } } }
      );
    } catch (pullErr) {
      // Log and continue; deletion succeeded but cleaning references failed
      console.warn("Failed to remove connections to deleted location:", pullErr.message || pullErr);
    }

    res.json({ message: "Location removed successfully" });
  } catch (error) {
    next(error);
  }
};

export const generateQrCode = async (req, res, next) => {
  try {
    const { locationId, label } = req.body;
    if (!locationId) {
      return res.status(400).json({ message: "locationId is required" });
    }

    const qrPayload = {
      type: "ward",
      locationId,
      label: label || locationId,
      generatedAt: new Date().toISOString(),
    };
    const qrData = await QRCode.toDataURL(JSON.stringify(qrPayload));
    const qrLocation = await QrLocation.findOneAndUpdate(
      { locationId },
      { locationId, label: label || locationId, qrData, active: true },
      { upsert: true, new: true }
    );

    res.json({ qrLocation, qrData });
  } catch (error) {
    next(error);
  }
};
