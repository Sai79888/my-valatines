const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Response = require('./models/Response');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/valentines';

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// GET basic stats
app.get('/api/stats', async (req, res) => {
  try {
    const total = await Response.countDocuments();
    const yes = await Response.countDocuments({ answer: 'yes' });
    const no = await Response.countDocuments({ answer: 'no' });
    res.json({ total, yes, no });
  } catch (err) {
    res.status(500).json({ message: 'server error' });
  }
});

// Helpers / validation
const ALLOWED_ANSWERS = ['yes', 'no'];
function sanitizeName(name = '') {
  const s = String(name || '').trim();
  return s.length > 100 ? s.slice(0, 100) : s;
}

// GET answers (paginated + optional filter)
app.get('/api/answers', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(200, Math.max(1, parseInt(req.query.limit) || 50));
    const filter = {};
    if (req.query.answer && ALLOWED_ANSWERS.includes(req.query.answer)) {
      filter.answer = req.query.answer;
    }
    const total = await Response.countDocuments(filter);
    const docs = await Response.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    res.json({ total, page, limit, results: docs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'server error' });
  }
});

// GET single answer by id
app.get('/api/answers/:id', async (req, res) => {
  try {
    const doc = await Response.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: 'not found' });
    res.json(doc);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'invalid id' });
  }
});

// POST an answer (create)
app.post('/api/answers', async (req, res) => {
  const { name, answer } = req.body;
  if (!answer || !ALLOWED_ANSWERS.includes(answer)) {
    return res.status(400).json({ message: "answer must be 'yes' or 'no'" });
  }
  try {
    const doc = new Response({ name: sanitizeName(name) || 'Anonymous', answer });
    await doc.save();
    const yes = await Response.countDocuments({ answer: 'yes' });
    res.status(201).json({ message: 'saved', doc, stats: { yes } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'server error' });
  }
});

// PUT (update) an answer
app.put('/api/answers/:id', async (req, res) => {
  const { name, answer } = req.body;
  const update = {};
  if (typeof name !== 'undefined') update.name = sanitizeName(name);
  if (typeof answer !== 'undefined') {
    if (!ALLOWED_ANSWERS.includes(answer)) return res.status(400).json({ message: "answer must be 'yes' or 'no'" });
    update.answer = answer;
  }
  if (Object.keys(update).length === 0) return res.status(400).json({ message: 'nothing to update' });

  try {
    const doc = await Response.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!doc) return res.status(404).json({ message: 'not found' });
    res.json({ message: 'updated', doc });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'invalid request' });
  }
});

// DELETE an answer
app.delete('/api/answers/:id', async (req, res) => {
  try {
    const doc = await Response.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ message: 'not found' });
    res.json({ message: 'deleted' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'invalid id' });
  }
});

app.get('/', (req, res) => res.send('Valentines backend is running'));

app.listen(PORT, () => console.log(`🚀 Server listening on http://localhost:${PORT}`));
