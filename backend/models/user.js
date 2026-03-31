const mongoose = require("mongoose");
const JobPosting = require("./jobDescription");

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["recruiter", "developer"],
        required: true,
    },
    profilePhoto:{
        url:String,
        filename: String,
    },
    jobPosted:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: "Job",
        }
    ],
    about: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "About", 
    },
},{
    timestamps: true
});

const User = mongoose.model("User", UserSchema);
module.exports = User;