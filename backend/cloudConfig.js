const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,//princesingh1736
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 🟢 Storage for profile photos (JobConnect_Assets)
const profilePhotoStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const originalName = file.originalname;
    const filename = originalName.substring(0, originalName.lastIndexOf(".")) || "photo";
    const extension = originalName.split(".").pop();

    return {
      folder: "JobConnect_Assets",
      resource_type: "image",
      public_id: `${filename}-${Date.now()}.${extension}`,
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
      transformation: [{ width: 500, height: 500, crop: "limit" }],
      type: "upload",
      //upload_preset: "resume_unsigned",
      access_mode: "public",
    };
  },
});

// 🟢 Storage for resumes (Resumes folder)
const resumeStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const originalName = file.originalname;
    const filename =
      originalName.substring(0, originalName.lastIndexOf(".")) || "resume";

    return {
      folder: "resumes",
      resource_type: "auto", // 🔥 CHANGE THIS
      public_id: `${filename}-${Date.now()}`,
      type: "upload",
    };
  },
});

const uploadProfilePhoto = multer({ storage: profilePhotoStorage });
const uploadResume = multer({ storage: resumeStorage });

module.exports = {
  uploadProfilePhoto,
  uploadResume,
};
