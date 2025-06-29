const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  imageUrl: String,
  uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Image', imageSchema);
