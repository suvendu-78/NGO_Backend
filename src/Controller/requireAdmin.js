import { Admin } from "../Module/Admin.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// 🔐 REGISTER ADMIN
export const registerAdmin = async (req, res) => {
  try {
    const { fullName, email, password, adminCode } = req.body;

    // check admin secret code
    if (adminCode !== process.env.ADMIN_SECRET_CODE) {
      return res.status(403).json({
        message: "Invalid Admin Secret Code",
      });
    }

    const exist = await Admin.findOne({ email });
    if (exist) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      fullName,
      email,
      password: hashed,
    });

    res.status(201).json({
      message: "Admin Registered Successfully",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔐 LOGIN ADMIN
export const loginAdmin = async (req, res) => {
  try {
    const { email, password, adminCode } = req.body;

    // verify secret code
    if (adminCode !== process.env.ADMIN_SECRET_CODE) {
      return res.status(403).json({
        message: "Invalid Admin Code",
      });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const match = await bcrypt.compare(password, admin.password);
    if (!match) {
      return res.status(400).json({ message: "Wrong password" });
    }

    // generate JWT
    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY },
    );

    res.json({
      message: "Admin Login Success",
      token,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const adminVerifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const admin = await User.findOne({ Email: email });

    if (!admin || admin.resetOtp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (admin.otpExpire < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    res.json({ message: "OTP verified" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const adminForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const admin = await User.findOne({ Email: email, role: "admin" });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    admin.resetOtp = otp;
    admin.otpExpire = Date.now() + 10 * 60 * 1000; // 10 min

    await admin.save();

    await SendMail({
      to: email,
      subject: "Admin Password Reset OTP",
      html: `<h2>Your OTP is: ${otp}</h2>`,
    });

    res.json({ message: "OTP sent to email" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const adminResetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await User.findOne({ Email: email });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    admin.Password = hashedPassword;
    admin.resetOtp = null;
    admin.otpExpire = null;

    await admin.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};