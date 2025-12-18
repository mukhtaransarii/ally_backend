import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  role: { type: String, enum: ["user", "partner", "admin"], default: "user" },
  isProfileComplete: { type: Boolean, default: false },

  // Basic profile
  name: String,
  email: { type: String, required: true },
  phone: String,
  bio: String,
  avatar: String,
  gender: { type: String, enum: ["male", "female", "other"] },

  // Permanent Address
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
  },

  // Previous fields you already had
  lat: Number,
  lng: Number,
  active: { type: Boolean, default: false },
  verified: { type: Boolean, default: false },

  // Required for geospatial query ($near)
  location: {
    type: { type: String, default: "Point" },
    coordinates: { type: [Number], default: [0, 0] },
  },

  // Emergency Contact
  emergencyContact: {
    name: String,
    phone: String,
    relation: String,
  },

  deviceToken: [String],
}, { timestamps: true });

// Indexes
userSchema.index({ email: 1, role: 1 }, { unique: true });
userSchema.index({ location: "2dsphere" }); // REQUIRED for $near queries

export default mongoose.model("User", userSchema);
