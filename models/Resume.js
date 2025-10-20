// models/Resume.js
import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    // Basic Info
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String },
    address: { type: String },
    linkedin: { type: String },
    github: { type: String },

    // Headline & Summary
    headline: { type: String },
    summary: { type: String },

    // Skills
    skills: [{ type: String }],

    // Experiences
    experiences: [{
        title: { type: String },
        company: { type: String },
        from: { type: String },
        to: { type: String },
        description: { type: String }
    }],

    // Education
    education: [{
        degree: { type: String },
        institution: { type: String },
        year: { type: String },
        stream: { type: String },
        score: { type: String },
        note: { type: String }
    }],

    // Projects
    projects: [{
        title: { type: String },
        description: { type: String },
        tech: { type: String }
    }],

    // Certifications / Licenses
    certifications: [{
        name: { type: String },
        issuedBy: { type: String },
        year: { type: String }
    }],
    other: [{
        heading: { type: String },
        details1: { type: String },
        details2: { type: String },
        details3: { type: String }
    }],

    // Any extra metadata
    meta: { type: Object, default: {} }

}, { timestamps: true });

export default mongoose.model("Resume", resumeSchema);