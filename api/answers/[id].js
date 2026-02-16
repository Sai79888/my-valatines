const connect = require('../../lib/mongoose');
const Response = require('../../models/Response');

module.exports = async function handler(req, res) {
  await connect();
  const { id } = req.query || {};
  if (!id) return res.status(400).json({ message: 'missing id' });

  if (req.method === 'GET') {
    try {
      const doc = await Response.findById(id);
      if (!doc) return res.status(404).json({ message: 'not found' });
      return res.json(doc);
    } catch (err) {
      return res.status(400).json({ message: 'invalid id' });
    }
  }

  if (req.method === 'PUT') {
    const update = {};
    if (typeof req.body.name !== 'undefined') update.name = String(req.body.name).slice(0, 100);
    if (typeof req.body.answer !== 'undefined') update.answer = req.body.answer;
    if (Object.keys(update).length === 0) return res.status(400).json({ message: 'nothing to update' });
    try {
      const doc = await Response.findByIdAndUpdate(id, update, { new: true, runValidators: true });
      if (!doc) return res.status(404).json({ message: 'not found' });
      return res.json({ message: 'updated', doc });
    } catch (err) {
      return res.status(400).json({ message: 'invalid request' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const doc = await Response.findByIdAndDelete(id);
      if (!doc) return res.status(404).json({ message: 'not found' });
      return res.json({ message: 'deleted' });
    } catch (err) {
      return res.status(400).json({ message: 'invalid id' });
    }
  }

  res.setHeader('Allow', 'GET, PUT, DELETE');
  res.status(405).end('Method Not Allowed');
};
