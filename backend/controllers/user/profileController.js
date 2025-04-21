const User = require("../../models/userSchema");

const updateProfile = async (req, res) => {
  try {
    const {
      firstname,
      lastname,
      gender,
      profileImage,
      dateOfBirth,
      phone,
      avatar,
    } = req.body;

    // Get the authenticated user's ID (set by your auth middleware)
    const userId = req.user.id;

    const updateFields = {};
    if (firstname !== undefined) updateFields.firstname = firstname;
    if (lastname !== undefined) updateFields.lastname = lastname;
    if (gender !== undefined) updateFields.gender = gender;
    if (profileImage !== undefined) updateFields.profileImage = profileImage;
    if (dateOfBirth !== undefined) updateFields.dateOfBirth = dateOfBirth;
    if (phone !== undefined) updateFields.phone = phone;
    if (avatar !== undefined) updateFields.profileImage = avatar;

    const updatedUser = await User.findByIdAndUpdate(userId, updateFields, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update profile", error: error.message });
  }
};




module.exports = {
  updateProfile,
};
