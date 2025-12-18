import cloudinary from "../config/cloudinary.js";
import User from "../models/User.js";

export const editProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    let avatarUrl;

    if ( req.body.avatar && req.body.avatar.startsWith("data:image")) {
      const upload = await cloudinary.v2.uploader.upload(
        req.body.avatar,
        { folder: "user_avatars" }
      );
      avatarUrl = upload.secure_url;
    }

    const updateData = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      gender: req.body.gender,
    };

    if (avatarUrl) updateData.avatar = avatarUrl;
    
    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    );

    return res.json({ success: true, user});
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Profile update failed",});
  }
};
