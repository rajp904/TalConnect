const express = require("express");
const httpStatus = require("http-status");
const User = require("../models/user");
const bcrypt = require('bcryptjs');
const { uploadProfilePhoto } = require("../cloudConfig.js"); 
const router = express.Router();
const About = require("../models/about");

// ------------------- LOGIN -------------------
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email or Password Missing" });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User doesn't exist" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid Credentials" });
        }

        const userData = {
            _id: user._id,
            name: user.name,
            username: user.username,
            email: user.email,
            role: user.role,
            profilePhoto: user.profilePhoto,
        };

        req.session.user = userData;

        // ✅ FIX: session save
        req.session.save((err) => {
            if (err) {
                console.error("Session save error:", err);
                return res.status(500).json({ message: "Session error" });
            }

            return res.status(200).json({
                message: "Logged in successfully",
                user: userData,
            });
        });

    } catch (e) {
        console.error("Login Error:", e);
        return res.status(500).json({ message: "Something went wrong", error: e.message });
    }
});

// ------------------- REGISTER -------------------
router.post("/register", uploadProfilePhoto.single("profilePhoto"), async (req, res) => {
    const { name, username, email, password, role } = req.body;

    if (!username || !name || !email || !password || !role) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "User Already Exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            name,
            email,
            password: hashedPassword,
            role,
            profilePhoto: req.file
                ? { url: req.file.path, filename: req.file.filename }
                : {},
        });

        await newUser.save();

        const userData = {
            _id: newUser._id,
            name: newUser.name,
            username: newUser.username,
            email: newUser.email,
            role: newUser.role,
            profilePhoto: newUser.profilePhoto,
        };

        return res.status(201).json({
            message: "User Registered Successfully",
            user: userData,
        });
    } catch (e) {
        console.error("Registration Error:", e);
        return res.status(500).json({ message: "Something went wrong", error: e.message });
    }
});

// ------------------- SESSION USER -------------------
router.get("/me", async (req, res) => {
    if (req.session && req.session.user) {
        try {
            const user = await User.findById(req.session.user._id).populate("about");
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            const userData = {
                _id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
                role: user.role,
                profilePhoto: user.profilePhoto,
                about: user.about,
            };
            return res.status(200).json({ user: userData });
        } catch (err) {
            console.error("Session fetch error:", err);
            return res.status(500).json({ message: "Error fetching user" });
        }
    } else {
        return res.status(401).json({ message: "No active session" });
    }
});


// ------------------- LOGOUT -------------------
router.post("/logout", (req, res) => {
    req.session.destroy(() => {
        res.json({ message: "Logged out" });
    });
});

module.exports = router;
//done