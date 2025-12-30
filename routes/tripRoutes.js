import express from "express";
import { confirmTrip, cancelTrip } from "../controllers/tripController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.post("/confirm", auth, confirmTrip);
router.post("/cancel", auth, cancelTrip);

export default router;
