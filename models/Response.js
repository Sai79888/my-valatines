const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
  name: { type: String, default: 'Anonymous', maxlength: 100 },
  answer: { type: String, enum: ['yes', 'no'], required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Response || mongoose.model('Response', responseSchema);
