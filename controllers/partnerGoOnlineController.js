import User from "../models/User.js";

export const goOnline = async (req, res) => {
  try {
    const { id } = req.user;
    const { active, lat, lng } = req.body;

    const updateData = active
      ? { active, lat, lng, location: { type: "Point", coordinates: [lng, lat] } }
      : { active, lat: null, lng: null, location: { type: "Point", coordinates: [0, 0] } };

    const user = await User.findByIdAndUpdate(id, updateData, { new: true });

    res.json({
      success: true,
      active: user.active,
      lat: user.lat,
      lng: user.lng
    });
  } catch (e) {
    console.log("Toggle online error:", e);
    res.status(500).json({ message: "Server error" });
  }
};
