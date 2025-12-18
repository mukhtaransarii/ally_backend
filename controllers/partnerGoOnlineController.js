import User from "../models/User.js";

export const goOnline = async (req, res) => {
  try {
    const userId = req.user.id;
    const { lat, lng, active } = req.body;

    const updateData = { active };

    if (active) {
      // going online → save location
      updateData.lat = lat;
      updateData.lng = lng;
      updateData.location = { type: "Point", coordinates: [lng, lat] };
    } else {
      // going offline → clear location
      updateData.lat = null;
      updateData.lng = null;
      updateData.location = { type: "Point", coordinates: [0, 0] };
    }

    const user = await User.findByIdAndUpdate(userId, updateData, { new: true });

    return res.json({ success: true, active: user.active, lat: user.lat, lng: user.lng });
  } catch (e) {
    console.log("Toggle online error:", e);
    return res.status(500).json({ message: "Server error" });
  }
};
