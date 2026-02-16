const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
  name: { type: String, default: 'Anonymous' },
  answer: { type: String, enum: ['yes', 'no'], required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Response', responseSchema);
