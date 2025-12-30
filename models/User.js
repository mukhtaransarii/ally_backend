import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  role: { type: String, enum: ["user", "partner", "admin"], default: "user" },
  isProfileComplete: { type: Boolean, default: false },

  // Basic profile
  avatar: { type: String, default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQpULH7XQOEGAcUk6r_1LKgO2QF4f11_wc8i7iBRXLeyeZsU8LZGEoOtY&s=10" },
  name: String,
  email: { type: String, required: true },
  gender: { type: String, enum: ["male", "female", "other"] },
  username: { type: String, unique: true, lowercase: true, trim: true, match: /^[a-z0-9_.]{3,20}$/, default: () => "user" + Math.floor(Date.now() / 1000) },
  phone: String,
  bio: String,
  skills: { type: [String]},
  dob: {type: Date},
  
  status: {type: String, enum: ["available", "on_trip"], default: "available"},
  active: { type: Boolean, default: false },
  verified: { type: Boolean, default: false },

  // Required for geospatial query ($near)
  location: {
    type: { type: String, default: "Point" },
    coordinates: { type: [Number], default: [0, 0] },
  },
  
  // (Optional but use full)
  lat: Number,
  lng: Number,
  
}, { timestamps: true });

// Indexes
userSchema.index({ email: 1, role: 1 }, { unique: true });
userSchema.index({ location: "2dsphere" }); // REQUIRED for $near queries

export default mongoose.model("User", userSchema);
