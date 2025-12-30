import User from "../models/User.js";

export const findNearestCompanion = async (req, res) => {
  try {
    const { lat, lng } = req.body;
    if (lat == null || lng == null)
      return res.status(400).json({
        success: false,
        companions: [],
        message: "Location required",
      });

    const partners = await User.find({
      role: "partner",
      active: true,
      status: "available",
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [lng, lat] },
          $maxDistance: 100000,
        },
      },
    });

    if (!partners.length)
      return res.json({
        success: true,
        companions: [],
        message: "No companions nearby, wait a bit.",
      });

    const result = partners.map(p => ({
      ...p.toObject(),
      ratePerHour: 299,
    }));

    return res.json({
      success: true,
      companions: result,
      message: "Success companions found",
    });

  } catch (error) {
    console.log("Nearest companion error:", error);
    return res.status(500).json({ success: false, companions: [],  message: "Server error" });
  }
};
