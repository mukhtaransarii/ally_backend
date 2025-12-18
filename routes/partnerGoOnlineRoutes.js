import express from "express";
import { goOnline } from "../controllers/partnerGoOnlineController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.post("/go-online", auth, goOnline);

export default router;
