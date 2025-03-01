import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import multer from "multer";
import cookieParser from "cookie-parser";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import fs from 'fs';
import path from 'path';

import User from "./models/User.js";
import Video from "./models/Video.js";

const app = express();


app.use(cors({ 
  origin: "http://localhost:5173", 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log("Created uploads directory");
}

app.use('/uploads', express.static('uploads'));

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Error:", err));


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Check if uploads directory exists again just to be sure
    if (!fs.existsSync(uploadsDir)){
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ 
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, 
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only video files are allowed'), false);
    }
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ email: profile.emails[0].value });

        if (!user) {
          user = await User.create({
            name: profile.displayName,
            username: profile.emails[0].value.split("@")[0],
            email: profile.emails[0].value,
            password: await bcrypt.hash("google_auth_" + Math.random().toString(36).slice(-8), 10),
            profilePic: profile.photos[0]?.value || "",
            isVerified: true,
          });
        }

        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "24h" });
        return done(null, { user, token });
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

app.get("/auth/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const token = req.user.token;

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax", 
      maxAge: 24 * 60 * 60 * 1000, 
    });
    res.cookie("token", token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000, 
    });

    res.redirect("http://localhost:5173/");
  }
);

app.get("/profile", async (req, res) => {
  const token = req.cookies.auth_token;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" });

    try {
      const user = await User.findById(decoded.id).select("-password");
      if (!user) return res.status(404).json({ message: "User not found" });
      res.json({ user });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
});

// Improved upload endpoint with better error handling
app.post("/api/upload", upload.single("video"), async (req, res) => {
  try {
    // Log the request for debugging
    console.log("Upload request received");
    console.log("Files:", req.file ? req.file.filename : "No file uploaded");
    console.log("Body:", req.body);

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: "No video file provided" });
    }

    // Check token from cookies
    const token = req.cookies.auth_token;
    console.log("Token:", token ? "Present" : "Missing");
    
    if (!token) {
      if (req.file && req.file.path) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      
      if (!user) {
        // No user found, delete the uploaded file
        if (req.file && req.file.path) {
          fs.unlinkSync(req.file.path);
        }
        return res.status(404).json({ message: "User not found" });
      }

      // Get title and description
      const { title, description } = req.body;
      if (!title) {
        if (req.file && req.file.path) {
          fs.unlinkSync(req.file.path);
        }
        return res.status(400).json({ message: "Title is required" });
      }

      // Create the video document
      const videoUrl = `/uploads/${req.file.filename}`;
      const newVideo = new Video({ 
        title, 
        description, 
        videoUrl, 
        user: user._id 
      });

      await newVideo.save();
      res.status(201).json({ message: "Video uploaded successfully!", video: newVideo });
    } catch (tokenError) {
      if (req.file && req.file.path) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(403).json({ message: "Invalid token" });
    }
  } catch (error) {
    console.error("Upload error:", error);
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (deleteError) {
        console.error("Error deleting file:", deleteError);
      }
    }
    res.status(500).json({ error: error.message || "Server error" });
  }
});

app.get("/history", (req, res) => {
  res.json({ message: "User history feature coming soon" });
});

app.get("/api/videos", async (req, res) => {
  try {
    const videos = await Video.find()
      .populate('user', 'name username profilePic')
      .sort({ createdAt: -1 });
    res.json({ videos });
  } catch (error) {
    console.error("Error fetching videos:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/yourvideos", async (req, res) => {
  try {
    const token = req.cookies.auth_token;
    if (!token) return res.status(401).json({ message: "Unauthorized" });
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const videos = await Video.find({ user: decoded.id });
    res.json({ videos });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is running" });
});

app.get("/api/feed", async (req, res) => {
  try {
    // Fetch videos from the database and populate the user details
    const videos = await Video.find()
      .populate('user', 'name username profilePic') // Populate user details
      .sort({ createdAt: -1 }) // Sort by latest videos first
      .select('title videoUrl createdAt user'); // Select only necessary fields

    // Map the videos to include user_name, title, and date
    const feedData = videos.map(video => ({
      title: video.title,
      videoUrl: video.videoUrl,
      date: video.createdAt,
      user_name: video.user.name, // Include the user's name
    }));

    res.status(200).json({ videos: feedData });
  } catch (error) {
    console.error("Error fetching feed:", error);
    res.status(500).json({ message: "Server error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
