import Otp from "../models/Otp.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken"

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// SEND OTP
export const sendOtp = async (req, res) => {
  try {
    const { email, role } = req.body;
    console.log("role from back sendotp", role)
    
    if (!email && !role) return res.json({ success: false, message: "Email amd role is required" });
    
    const exists = await User.findOne({ email, role });

    const otp = generateOtp();

    await Otp.deleteMany({ email, role });
    await Otp.create({
      email,
      role,
      otp,
      expireAt: Date.now() + 5 * 60 * 1000,
    });

    console.log(`OTP for ${email} for ${role}: ${otp}`);

    res.json({ success: true, message: "OTP sent", exists: exists ? true : false });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// VERIFY OTP
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp, role } = req.body;
   
    const record = await Otp.findOne({ email, role });
    if (!record) return res.json({ success: false, message: "OTP expired" });
    if (record.otp !== otp) return res.json({ success: false, message: "Invalid OTP" });
   
    let user = await User.findOne({ email, role });
    if (!user) user = await User.create({ email, role });
    await Otp.deleteMany({ email, role });
    
    // Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" } // token valid for 7 days
    );
   
    res.json({ success: true, message: "OTP verified", user, token,});
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};


export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    return res.json({ success: true, user });
  } catch (err) {
    return res.json({ success: false, message: "Server error" });
  }
};


