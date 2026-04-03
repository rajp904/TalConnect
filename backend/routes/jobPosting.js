const express = require("express");
const router = express.Router();
const fs = require("fs");
const Job = require("../models/jobDescription.js");
const User = require("../models/user.js");
const { uploadResume } = require("../cloudConfig.js");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const axios = require("axios");          // ✅ ADDED
const FormData = require("form-data");   // ✅ ADDED

dotenv.config();

// ------------------- POST JOB -------------------
router.post("/post-job", async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ message: "Please login" });
    }

    // ✅ role fix
    if (req.session.user.role !== "recruiter") {
      return res.status(403).json({ message: "Only recruiter can post jobs" });
    }

    const {
      title,
      company,
      description,
      workType,
      requiredSkills,
      location,
      salary,
    } = req.body;

    const recruiterUser = await User.findById(req.session.user._id);

    const job = new Job({
      title,
      company,
      description,
      workType,
      requiredSkills: Array.isArray(requiredSkills)
        ? requiredSkills
        : requiredSkills.split(",").map(s => s.trim()),
      location,
      salary,
      recruiter: recruiterUser._id,
    });

    await job.save();

    recruiterUser.jobPosted.push(job._id);
    await recruiterUser.save();

    res.status(201).json({ message: "Job posted successfully", job });

  } catch (error) {
    console.error("Error posting job:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// ------------------- MY JOBS -------------------
router.get("/my-jobs", async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ message: "Please login" });
    }

    const jobs = await Job.find({ recruiter: req.session.user._id });

    res.status(200).json({ jobs });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching jobs" });
  }
});

// ------------------- SEARCH -------------------
router.get("/search", async (req, res) => {
  try {
    const { title, workType } = req.query;

    const query = {};
    if (title) query.title = { $regex: title, $options: "i" };
    if (workType) query.workType = { $regex: workType, $options: "i" };

    const jobs = await Job.find(query);
    res.json(jobs);

  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// ------------------- ALL JOBS -------------------
router.get("/all-jobs", async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.status(200).json({ jobs });
  } catch (error) {
    res.status(500).json({ message: "Error fetching jobs" });
  }
});

// ------------------- APPLY -------------------
router.post("/apply/:jobId", uploadResume.single("resume"), async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ message: "Login required" });
    }

    // ✅ role fix
    if (req.session.user.role !== "developer") {
      return res.status(403).json({ message: "Only developer can apply" });
    }

    const { jobId } = req.params;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const user = await User.findById(req.session.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!req.file || !req.file.path) {
      return res.status(400).json({ message: "Resume upload failed" });
    }

    const alreadyApplied = job.applicants.find(
      (app) => app.developer.toString() === user._id.toString()
    );

    if (alreadyApplied) {
      return res.status(400).json({ message: "Already applied to this job" });
    }

    // 🔥 PYTHON SCORE CALL
    let score = 0;

    try {
      const formData = new FormData();
      
      formData.append("resume", req.file.secure_url);
      formData.append("job_description", job.description);
      formData.append("userName", user.name);
      formData.append("userEmail", user.email);

      const response = await axios.post(
        "https://talconnect1.onrender.com/analyze", // ⚠️ apna python URL
        formData,
        { headers: formData.getHeaders() }
      );

      score = response.data.matching_percent || 0;

    } catch (err) {
      console.error("Python API error:", err.message);
    }

    job.applicants.push({
      developer: user._id,
      name: user.name,
      email: user.email,
      resumeUrl: req.file?.secure_url || req.file?.path,
      score: score, // ✅ ADDED
      appliedAt: new Date(),
    });

    await job.save();

    res.json({ message: "Applied successfully", score });

  } catch (error) {
    console.error("Apply error:", error);
    res.status(500).json({ message: "Apply failed" });
  }
});

// ------------------- DELETE -------------------
router.delete("/:jobId", async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.jobId);
    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ message: "Delete error" });
  }
});

// ------------------- GET SINGLE JOB -------------------
router.get("/:jobId", async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId)
      .populate("applicants.developer", "name email");

    res.json(job);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching job" });
  }
});

// ------------------- SEND BULK EMAILS -------------------
router.post("/sendBulkEmails", async (req, res) => {
  try {
    const { candidates } = req.body;

    if (!candidates || candidates.length === 0) {
      return res.status(400).json({ message: "No candidates provided" });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, 
      },
    });

    for (let candidate of candidates) {
      if (!candidate.email || candidate.email === "N/A") continue;

      const score = candidate.score || 0;

      const isSelected = score >= 60;

      const subject = isSelected
        ? "🎉 Congratulations! You are shortlisted"
        : "Job Application Update";

      const htmlContent = isSelected
        ? `
          <div style="font-family: Arial; padding: 10px;">
            <h2 style="color: green;">🎉 Congratulations ${candidate.name || "Candidate"}!</h2>
            <p>Your application has been <b>shortlisted</b>.</p>
            <p><strong>Match Score:</strong> ${score}%</p>
            <p>We will contact you for the next round soon.</p>
            ${
              candidate.resumeLink
                ? `<p><a href="${candidate.resumeLink}">View Your Resume</a></p>`
                : ""
            }
            <br/>
            <p>Regards,<br/>TalConnect Team</p>
          </div>
        `
        : `
          <div style="font-family: Arial; padding: 10px;">
            <h3>Hello ${candidate.name || "Candidate"},</h3>
            <p>Thank you for applying.</p>
            <p><strong>Match Score:</strong> ${score}%</p>
            <p>Currently, we will not be moving forward with your application.</p>
            <p>We encourage you to apply again in future.</p>
            <br/>
            <p>Regards,<br/>TalConnect Team</p>
          </div>
        `;

      try {
        await transporter.sendMail({
          from: `"TalConnect" <${process.env.EMAIL_USER}>`,
          to: candidate.email,
          subject: subject,
          html: htmlContent,
        });

        console.log(`✅ Email sent to ${candidate.email}`);
      } catch (mailError) {
        console.error(`❌ Failed for ${candidate.email}`, mailError.message);
      }
    }

    res.json({ message: "Emails sent successfully" });

  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({ message: "Email sending failed" });
  }
});

module.exports = router;