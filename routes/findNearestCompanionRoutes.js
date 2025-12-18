import express from "express";
import { findNearestCompanion } from "../controllers/findNearestCompanionController.js";
//import { auth } from "../middleware/auth.js";

const router = express.Router();

router.post("/nearest", findNearestCompanion);

export default router;
