import { DateTime } from "luxon";
import UserModel from "../../../DB/Models/users.model.js";
import { emitter } from "../../../Services/sendEmail.service.js";
import emailTemplate from "../../../Utils/emailTemplet.utils.js";
import * as secure from "../../../Utils/crypto.utils.js";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import BlackListTokensModel from "../../../DB/Models/blackedListTokens.model.js";

// Signup service
export const signUpService = async (req, res) => {
  try {
    const { firstName, lastName, email, password, gender, DOB, phone, role } =
      req.body;

    const isEmailExist = await UserModel.findOne({ email });
    if (isEmailExist)
      return res.status(400).json({ message: "Email already exists" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await secure.hashing(otp, +process.env.SALT);
    const otpExpiration = DateTime.now().plus({ minutes: 10 }).toJSDate();

    emitter.emit("sendEmail", {
      subject: "Your OTP code",
      to: email,
      html: emailTemplate(firstName, otp, "Verify your account"),
    });

    const birthDay = DateTime.fromISO(DOB).toJSDate();
    const user = new UserModel({
      firstName,
      lastName,
      email,
      password: await secure.hashing(password, +process.env.SALT),
      phone,
      gender,
      role,
      DOB: birthDay,
      otp: [
        { code: hashedOtp, type: "confirmEmail", expiresIn: otpExpiration },
      ],
    });

    await user.save();
    res.status(201).json({ message: "Account created successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// Verify account service
export const verifyAccountService = async (req, res) => {
  try {
    const { otp, email } = req.body;
    const user = await UserModel.findOne({
      email,
      isConfirmed: false,
      "otp.type": "confirmEmail",
    });
    if (!user) return res.status(400).json({ message: "User not found" });

    const otpEntry = user.otp.find((entry) => entry.type === "confirmEmail");
    if (!otpEntry || DateTime.now() > otpEntry.expiresIn)
      return res.status(400).json({ message: "OTP has expired" });

    const isOtpValid = await secure.comparing(otp.toString(), otpEntry.code);
    if (!isOtpValid) return res.status(401).json({ message: "Invalid OTP" });

    await UserModel.findByIdAndUpdate(user._id, {
      isConfirmed: true,
      $pull: { otp: { type: "confirmEmail" } },
    });
    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// Login service
export const loginService = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user || user.bannedAt || user.deletedAt)
      return res.status(401).json({ message: "Invalid email or password" });

    const userPassword = await secure.comparing(password, user.password);
    if (!userPassword)
      return res.status(401).json({ message: "Invalid email or password" });

    const accessToken = jwt.sign(
      { _id: user._id, email: user.email },
      process.env.JWT_ACCESS_TOKEN,
      { expiresIn: "1h", jwtid: uuidv4() }
    );

    const refreshToken = jwt.sign(
      { _id: user._id, email: user.email },
      process.env.JWT_REFRESH_TOKEN,
      { expiresIn: "7d", jwtid: uuidv4() }
    );

    res
      .status(200)
      .json({ message: "Login successful", accessToken, refreshToken });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// Logout service
export const logoutService = async (req, res) => {
    try {
      // Normalize header key (case-insensitive)
      const refreshToken = req.headers["refresh-token"] || req.headers["refreshtoken"];
  
      if (!refreshToken) {
        return res.status(400).json({ message: "Refresh token is required" });
      }
  
      console.log("Received Refresh Token:", refreshToken);
  
      // Verify the refresh token
      let decoded;
      try {
        decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN);
      } catch (err) {
        console.error("JWT Verification Error:", err.message);
        return res.status(401).json({ message: "Invalid or expired refresh token" });
      }
  
      // Blacklist the token
      await BlackListTokensModel.insertMany([
        { tokenId: decoded.jti, expiryDate: new Date(decoded.exp * 1000) },
      ]);
  
      res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
      console.error("Logout Service Error:", error.message);
      res.status(500).json({ message: "Internal server error", error: error.message });
    }
  };

// Forgot password service
export const forgetPasswordService = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await secure.hashing(otp, +process.env.SALT);
    const otpExpiration = DateTime.now().plus({ minutes: 10 }).toJSDate();

    emitter.emit("sendEmail", {
      subject: "Your OTP code",
      to: email,
      html: emailTemplate(user.firstName, otp, "Reset your password"),
    });

    await UserModel.findByIdAndUpdate(user._id, {
      otp: [
        { code: hashedOtp, type: "forgetPassword", expiresIn: otpExpiration },
      ],
    });

    res
      .status(202)
      .json({ message: "OTP sent successfully. Check your email inbox." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// Reset password service
export const resetPasswordService = async (req, res) => {
  try {
    const { email, otp, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const otpEntry = user.otp.find((entry) => entry.type === "forgetPassword");
    if (!otpEntry || DateTime.now() > otpEntry.expiresIn)
      return res.status(400).json({ message: "OTP has expired" });

    const isOtpValid = await secure.comparing(otp.toString(), otpEntry.code);
    if (!isOtpValid) return res.status(401).json({ message: "Invalid OTP" });

    await UserModel.findByIdAndUpdate(user._id, {
      password: await secure.hashing(password, +process.env.SALT),
      $pull: { otp: { type: "forgetPassword" } },
    });
    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// Refresh token service
export const refreshTokenService = async (req, res) => {
  try {
    // Normalize header key (case-insensitive)
    const refreshToken =
      req.headers["refresh-token"] || req.headers["refreshtoken"];

    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token is required" });
    }

    console.log("Received Refresh Token:", refreshToken);

    // Verify the refresh token
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN);
    } catch (err) {
      console.error("JWT Verification Error:", err.message);
      return res
        .status(401)
        .json({ message: "Invalid or expired refresh token" });
    }

    // Find user in database
    const user = await UserModel.findById(decoded._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user changed credentials after token issuance
    const changeCredentialTime = user.changeCredentialTime
      ? Math.floor(user.changeCredentialTime.getTime() / 1000)
      : 0;

    if (changeCredentialTime > decoded.iat) {
      return res.status(401).json({
        message: "Refresh token is no longer valid. Please log in again.",
      });
    }

    // Generate new access token
    const newAccessToken = jwt.sign(
      { _id: user._id, email: user.email },
      process.env.JWT_ACCESS_TOKEN,
      { expiresIn: "1h", jwtid: uuidv4() }
    );

    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    console.error("Refresh Token Service Error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
