const connect = require('../../lib/mongoose');
const Response = require('../../models/Response');

module.exports = async function handler(req, res) {
  await connect();
  const ALLOWED = ['yes', 'no'];

  if (req.method === 'GET') {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(200, Math.max(1, parseInt(req.query.limit) || 50));
    const filter = {};
    if (req.query.answer && ALLOWED.includes(req.query.answer)) filter.answer = req.query.answer;
    const total = await Response.countDocuments(filter);
    const results = await Response.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit);
    return res.status(200).json({ total, page, limit, results });
  }

  if (req.method === 'POST') {
    const { name, answer } = req.body || {};
    if (!answer || !ALLOWED.includes(answer)) return res.status(400).json({ message: "answer must be 'yes' or 'no'" });
    const doc = new Response({ name: (name || 'Anonymous').toString().slice(0, 100), answer });
    await doc.save();
    const yes = await Response.countDocuments({ answer: 'yes' });
    return res.status(201).json({ message: 'saved', doc, stats: { yes } });
  }

  res.setHeader('Allow', 'GET, POST');
  res.status(405).end('Method Not Allowed');
};
