import express from "express";
import { sendOtp, verifyOtp, getUser } from "../controllers/userController.js";
import { editProfile } from '../controllers/editProfileController.js'
import { auth } from '../middleware/auth.js'

const router = express.Router();

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.get("/me", auth, getUser);
router.post("/edit-profile", auth, editProfile)

export default router;
