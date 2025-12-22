import cloudinary from "../config/cloudinary.js";
import User from "../models/User.js";

export const editProfile = async (req, res) => {
  try {
    const userId = req.user.id;
   
    const updateData = { ...req.body };

    // handle avatar upload if base64
    if (updateData.avatar?.startsWith("data:image")) {
      const upload = await cloudinary.v2.uploader.upload(
        updateData.avatar,
        { folder: "user_avatars" }
      );
      updateData.avatar = upload.secure_url;
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    res.json({ success: true, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Profile update failed"});
  }
};
