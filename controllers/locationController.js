import Location from "../models/Location.js";
import QrLocation from "../models/QrLocation.js";

export const getLocations = async (req, res, next) => {
  try {
    const locations = await Location.find({});
    res.json(locations);
  } catch (error) {
    next(error);
  }
};

export const getLocationById = async (req, res, next) => {
  try {
    const location = await Location.findById(req.params.id);
    if (!location) {
      return res.status(404).json({ message: "Location not found" });
    }
    res.json(location);
  } catch (error) {
    next(error);
  }
};

export const getQrLocation = async (req, res, next) => {
  try {
    const qr = await QrLocation.findOne({ locationId: req.params.id });
    if (!qr || !qr.qrData) return res.status(404).json({ message: "QR location not found" });
    res.json(qr);
  } catch (error) {
    next(error);
  }
};

export const createLocation = async (req, res, next) => {
  try {
    const location = new Location(req.body);
    await location.save();
    res.status(201).json(location);
  } catch (error) {
    next(error);
  }
};

export const updateLocation = async (req, res, next) => {
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
