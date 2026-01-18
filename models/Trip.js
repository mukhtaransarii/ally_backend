import mongoose from "mongoose";

const tripSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  companion: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  pickup: {
    lat: Number,
    lng: Number,
    humanAddress: Object
  },

  distance: String,
  duration: String,

  otp: String,
  otpVerified: { type: Boolean, default: false },

  status: {
    type: String,
    enum: ["pending", "accepted", "completed", "cancelled"],
    default: "pending"
  },
  
  // cancelled after trip accepted
  cancelledBy: {
    type: String,
    enum: ["user", "companion"],
  },
  cancelReason: String,
}, { timestamps: true });

export default mongoose.model("Trip", tripSchema);
