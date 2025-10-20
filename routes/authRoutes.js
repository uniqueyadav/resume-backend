import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

// ✅ Mail transporter setup (Gmail SMTP)
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

router.post("/register", async(req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password)
            return res.status(400).json({ msg: "Missing fields" });

        const exists = await User.findOne({ email });
        if (exists) return res.status(400).json({ msg: "User already exists" });

        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = await User.create({ name, email, passwordHash });

        // ✅ Send Welcome Email
        try {
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: email,
                subject: "Welcome to Resume Builder 🎉",
                html: `
          <h2>Hi ${name},</h2>
          <p>🎊 Your registration on <b>Resume Builder</b> was successful!</p>
          <p>Your Password : ${password},</p>
          <p>Start creating professional resumes easily.</p>
          <br/>
          <p>Best regards,<br/>Resume Builder Team</p>
        `,
            });
            console.log("📧 Mail sent successfully to:", email);
        } catch (mailErr) {
            console.error("❌ Mail sending failed:", mailErr.message);
        }

        // ✅ Generate JWT Token
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        res.json({
            token,
            user: { id: newUser._id, name: newUser.name, email: newUser.email },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server error" });
    }
});

router.post("/login", async(req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        res.json({
            token,
            user: { id: user._id, name: user.name, email: user.email },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server error" });
    }
});

export default router;