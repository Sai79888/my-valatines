const connect = require('../lib/mongoose');
const Response = require('../models/Response');

module.exports = async function handler(req, res) {
  await connect();
  try {
    const total = await Response.countDocuments();
    const yes = await Response.countDocuments({ answer: 'yes' });
    const no = await Response.countDocuments({ answer: 'no' });
    res.json({ total, yes, no });
  } catch (err) {
    res.status(500).json({ message: 'server error' });
  }
};
