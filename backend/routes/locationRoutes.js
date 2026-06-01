import express from "express";
import {
  getLocations,
  getLocationById,
  getQrLocation,
  createLocation,
  updateLocation,
} from "../controllers/locationController.js";

const router = express.Router();

router.get("/", getLocations);
router.get("/qr/:id", getQrLocation);
router.get("/:id", getLocationById);
router.post("/", createLocation);
router.put("/:id", updateLocation);

export default router;
