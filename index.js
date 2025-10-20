// index.js
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";

dotenv.config();
const app = express();

app.use((req, res, next) => {
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, private");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    next();
});


app.use(cors());
app.use(express.json());

// Routes
app.use((req, res, next) => {
    if (!isConnected) {
        connectToMongoDB();
    }
    next();
})
app.use("/api/auth", authRoutes);
app.use("/api/resumes", resumeRoutes);

app.get("/", (req, res) => res.send("Resume System API running"));

//const PORT = process.env.PORT || 5000;
// mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => app.listen(PORT, () => console.log(`Server started on ${PORT}`)))
//     .catch(err => {
//         console.error("MongoDB connection error:", err);
//         process.exit(1);
//     });

let isConnected = false;
async function connectToMongoDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        isConnected = true;
        console.log("Connected To MongoDB")
    } catch (error) {
        console.error("Error Connecting to MongoDB :", error)
    }
}
module.exports = app