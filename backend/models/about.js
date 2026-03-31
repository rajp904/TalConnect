const mongoose = require("mongoose");

const about = new mongoose.Schema({
    description: {
        type: String,
        required: true,
    },
    skillSet:{
        type: String,
        required: true,
    },
    experience:{
        type: String,
        required: true
    }
});

module.exports = mongoose.model("About",about);