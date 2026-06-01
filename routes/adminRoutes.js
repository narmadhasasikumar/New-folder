import express from "express";
import {
  addLocation,
  editLocation,
  deleteLocation,
  generateQrCode,
} from "../controllers/adminController.js";

const router = express.Router();
router.post("/location", addLocation);
router.put("/location/:id", editLocation);
router.delete("/location/:id", deleteLocation);
router.post("/qr", generateQrCode);
export default router;
