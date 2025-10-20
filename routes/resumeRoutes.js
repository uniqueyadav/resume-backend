// routes/resumeRoutes.js
import express from "express";
import Resume from "../models/Resume.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// Get all resumes for logged-in user
router.get("/", auth, async(req, res) => {
    try {
        const resumes = await Resume.find({ user: req.userId }).sort({ updatedAt: -1 });
        res.json(resumes);
    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
});

// ✅ Get single resume (private)
router.get("/:id", auth, async(req, res) => {
    try {
        const resume = await Resume.findOne({ _id: req.params.id, user: req.userId });
        if (!resume) return res.status(404).json({ msg: "Resume not found or not yours" });
        res.json(resume);
    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
});

// Create new resume
router.post("/", auth, async(req, res) => {
    try {
        const payload = {...req.body, user: req.userId };
        const created = await Resume.create(payload);
        res.status(201).json(created);
    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
});

// Update resume
router.put("/:id", auth, async(req, res) => {
    try {
        const resume = await Resume.findOneAndUpdate({ _id: req.params.id, user: req.userId },
            req.body, { new: true }
        );
        if (!resume) return res.status(404).json({ msg: "Not found or not your resume" });
        res.json(resume);
    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
});

// Delete resume
router.delete("/:id", auth, async(req, res) => {
    try {
        const removed = await Resume.findOneAndDelete({ _id: req.params.id, user: req.userId });
        if (!removed) return res.status(404).json({ msg: "Not found or not your resume" });
        res.json({ msg: "Deleted" });
    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
});

// Public resume (for preview)
router.get("/public/:id", async(req, res) => {
    try {
        const resume = await Resume.findById(req.params.id).populate("user", "name email");
        if (!resume) return res.status(404).json({ msg: "Not found" });
        res.json(resume);
    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
});

export default router;