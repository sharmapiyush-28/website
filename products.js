const express = require("express");
const multer = require("multer");
const cloudinary = require("../cloudinary");
const Product = require("../models/Product");
const Image = require("../models/Image");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/add", upload.fields([{ name: "mainImage" }, { name: "extraImages" }]), async (req, res) => {
  const { productId, price, dimensions, category, description } = req.body;

  try {
    await Product.create({ productId, price, dimensions, category, description });

    const uploadedImages = [];

    const uploadToCloudinary = (file) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({ folder: "carpentry" }, (err, result) => {
          if (err) reject(err);
          else resolve(result.secure_url);
        });
        stream.end(file.buffer);
      });
    };

    if (req.files.mainImage) {
      const url = await uploadToCloudinary(req.files.mainImage[0]);
      uploadedImages.push({ productId, imageUrl: url });
    }

    if (req.files.extraImages) {
      for (const file of req.files.extraImages) {
        const url = await uploadToCloudinary(file);
        uploadedImages.push({ productId, imageUrl: url });
      }
    }

    await Image.insertMany(uploadedImages);

    res.status(200).json({ message: "Product and images uploaded successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Upload failed." });
  }
});

module.exports = router;
