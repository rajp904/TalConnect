const mongoose = require("mongoose");
const User = require("./user.js");

const applicantSchema = new mongoose.Schema({
  developer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  resumeUrl: {
    type: String,
    required: function () {
      return this.developer != null;
    },
  },
  appliedAt: {
    type: Date,
    default: Date.now,
  },
});

const jobSchema = new mongoose.Schema({

  title:{
    type: String,
    required: true,
  },

  company:{
    type: String,
    required: true,
  },

  description:{
    type: String,
    required: true,
  },

  workType :{
    type: String,
    required: true,
  },

  requiredSkills: {
    type: [String],   // ✅ fix
    required: true
  },

  location:{
    type: String,
    required: true,
  },

  salary:{
    type: String,
    required: true,   // ✅ fix
  },

  recruiter:{
    type: mongoose.Schema.Types.ObjectId, // ✅ fix
    ref: "User",
    required: true,
  },

  applicants: {
    type: [applicantSchema],
    default: [],
  },

  postedAt:{
    type: Date,
    default: Date.now,
  }

});

module.exports = mongoose.model("Job", jobSchema);