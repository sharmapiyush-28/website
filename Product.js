const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productId: { type: String, required: true, unique: true },
  price: Number,
  dimensions: String,
  category: String,
  description: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);
