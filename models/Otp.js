import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    role: {type: String, required: true},
    otp: { type: String, required: true },
    expireAt: { type: Date, expires: 0 }
  },
  { timestamps: true }
);

export default mongoose.model("Otp", otpSchema);
