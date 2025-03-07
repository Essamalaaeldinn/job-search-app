import UserModel from "../../../DB/Models/users.model.js";
import {
  comparing,
  hashing,
  encryption,
  decryption,
} from "../../../Utils/crypto.utils.js";

// ✅ Update user account
export const updateUserAccountService = async (req, res) => {
  try {
    const { phone, DOB, firstName, lastName, gender } = req.body;

    if (firstName) req.user.firstName = firstName;
    if (lastName) req.user.lastName = lastName;
    if (gender) req.user.gender = gender;
    if (DOB) req.user.DOB = DOB;

    if (phone) {
      const encryptedPhone = encryption(phone, process.env.SECRET_KEY);
      if (!encryptedPhone) {
        return res.status(500).json({ message: "Encryption failed" });
      }
      req.user.phone = encryptedPhone;
    }

    await req.user.save();
    res.status(200).json({ message: "Your Data updated successfully" });
  } catch (error) {
    console.error("❌ Error updating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Get user login data
export const userData = async (req, res) => {
  res.status(200).json({ message: "User data", user: req.user });
};

// ✅ Get profile data for another user
export const profileData = async (req, res) => {
  try {
    console.log("🔍 Fetching profile for userId:", req.params.userId);

    const { userId } = req.params;
    const user = await UserModel.findById(userId).select(
      "firstName lastName phone profilePic coverPic deletedAt"
    );

    if (!user || user.deletedAt) {
      console.log("❌ User not found");
      return res.status(404).json({ message: "User not found" });
    }

    console.log("✅ User found:", user);

    res.status(200).json({
      user: {
        userName: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
        mobileNumber: user.phone, // Use the already decrypted phone number
        profilePic: user.profilePic || {},
        coverPic: user.coverPic || {},
      },
    });
  } catch (error) {
    console.error("❌ Error fetching user profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Update password
export const updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const isMatched = await comparing(oldPassword, req.user.password);
    if (!isMatched) return res.status(400).json({ message: "Wrong password" });

    req.user.password = await hashing(newPassword);
    req.user.changeCredentialTime = new Date();

    await req.user.save();
    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("❌ Error updating password:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Soft delete account
export const deleteAccount = async (req, res) => {
  try {
    req.user.deletedAt = new Date();
    await req.user.save();
    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting account:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Upload profile picture
export const uploadProfilePic = async (req, res) => {
  try {
    req.user.profilePic = req.body.profilePic;
    await req.user.save();
    res.status(200).json({ message: "Profile picture updated successfully" });
  } catch (error) {
    console.error("❌ Error uploading profile picture:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Upload cover picture
export const uploadCoverPic = async (req, res) => {
  try {
    req.user.coverPic = req.body.coverPic;
    await req.user.save();
    res.status(200).json({ message: "Cover picture updated successfully" });
  } catch (error) {
    console.error("❌ Error uploading cover picture:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
