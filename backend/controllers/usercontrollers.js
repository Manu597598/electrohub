import nodemailer from "nodemailer";

import { User } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendVerificationEmail } from "../emailVerify/verifyEmail.js";

import Session from "../models/sessionModel.js";
import cloudinary from "../utils/cloudinary.js";

/* ================= REGISTER ================= */
export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields required"
      });
    }

    const exist = await User.findOne({ email });
    if (exist) {
      return res.status(400).json({
        success: false,
        message: "User already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      isVerified: false
    });

    const token = jwt.sign(
      { id: user._id },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );

    user.token = token;
    await user.save();

    await sendVerificationEmail(token, email);

    console.log("Verification token:", token);
console.log("User email:", email);
console.log("Verification link:", `${process.env.FRONTEND_URL}/verify/${token}`);
    return res.status(201).json({
      success: true,
      message: "Registered successfully. Check email for verification."
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/* ================= EMAIL VERIFY (LINK CLICK) ================= */
export const verifyEmail = async (req, res) => {
  try {
    const {token} = req.params;

    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "User already verified"
      });
    }

    user.isVerified = true;
    user.token = null;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Email verified successfully"
    });

  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Invalid or expired token"
    });
  }
};

/* ================= VERIFY (BODY TOKEN – OPTIONAL) ================= */
export const verify = async (req, res) => {
  try {
    const { token } = req.body;

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    user.isVerified = true;
    user.token = null;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "User verified successfully"
    });

  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Invalid or expired token"
    });
  }
};

/* ================= REVERIFY ================= */
export const reVerify = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "User already verified"
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.SECRET_KEY,
      { expiresIn: '1h' }
    );

    user.token = token;
    await user.save();

    await sendVerificationEmail(token, email);

    return res.status(200).json({
      success: true,
      message: "Verification email resent"
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/* ================= LOGIN ================= */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not exists"
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    if (!user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Verify your account before login"
      });
    }

    const accessToken = jwt.sign(
      { id: user._id },
      process.env.SECRET_KEY,
      { expiresIn: "10d" }
    );

    user.isLoggedIn = true;
    await user.save();

    await Session.deleteMany({ userId: user._id });
    await Session.create({ userId: user._id });

    return res.status(200).json({
      success: true,
      message: `Welcome back ${user.firstName}`,
      user,
      accessToken
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/* ================= LOGOUT ================= */
export const logout = async (req, res) => {
  try {
    const userId = req.id;

    await Session.deleteMany({ userId });
    await User.findByIdAndUpdate(userId, { isLoggedIn: false });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully"
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/* ================= FORGOT PASSWORD ================= */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully"
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/* ================= VERIFY OTP ================= */
export const verifyOTP = async (req, res) => {
  try {
    const { otp } = req.body;
    const { email } = req.params;

    const user = await User.findOne({ email });
    if (!user || user.otp !== otp || user.otpExpiry < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP"
      });
    }

    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "OTP verified"
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/* ================= CHANGE PASSWORD ================= */
export const changePassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const { email } = req.params;

    const user = await User.findOne({ email });
    const hashed = await bcrypt.hash(newPassword, 10);

    user.password = hashed;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully"
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/* ================= ALL USERS ================= */
export const allUser = async (req, res) => {
  const users = await User.find().select("-password");
  res.status(200).json({ success: true, users });
};

/* ================= GET USER BY ID ================= */
export const getUserById = async (req, res) => {
  const user = await User.findById(req.params.userId).select("-password");
  res.status(200).json({ success: true, user });
};
export const updateUser = async (req, res) => {
  try {
    const userIdToUpdate = req.params.id;
    const loggedInUser = req.user;

    const {
      firstName,
      lastName,
      address,
      city,
      ZipCode,
      phoneNo,
      role,
    } = req.body;

    if (
      loggedInUser._id.toString() !== userIdToUpdate &&
      loggedInUser.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to update this profile",
      });
    }

    let user = await User.findById(userIdToUpdate);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    let profilePicUrl = user.profilePic;
    let profilePicPublicId = user.profilePicPublicId;

    if (req.file) {
      if (profilePicPublicId) {
        await cloudinary.uploader.destroy(profilePicPublicId);
      }

      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "profiles" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });

      profilePicUrl = uploadResult.secure_url;
      profilePicPublicId = uploadResult.public_id;
    }

    // UPDATE FIELDS
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.address = address || user.address;
    user.city = city || user.city;
    user.ZipCode = ZipCode || user.ZipCode;
    user.phoneNo = phoneNo || user.phoneNo;
    user.role = role || user.role;
    user.profilePic = profilePicUrl;
    user.profilePicPublicId = profilePicPublicId;

    await user.save(); // ⭐ VERY IMPORTANT

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
