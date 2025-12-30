import express from "express";
import { confirmTrip, cancelTrip, acceptTrip } from "../controllers/tripController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.post("/confirm", auth, confirmTrip);
router.post("/cancel", auth, cancelTrip);
router.post("/accept", auth, acceptTrip);

export default router;
