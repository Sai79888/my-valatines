const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const answersHandler = require('./api/answers/index');
const answerIdHandler = require('./api/answers/[id]');
const statsHandler = require('./api/stats');

const app = express();
app.use(bodyParser.json());

// Serve frontend static files
app.use(express.static(path.join(__dirname, 'frontend')));

// API routes — reuse the serverless handlers
app.get('/api/stats', (req, res) => statsHandler(req, res));
app.get('/api/answers', (req, res) => answersHandler(req, res));
app.post('/api/answers', (req, res) => answersHandler(req, res));

// id routes: adapt req.query.id for handler
app.get('/api/answers/:id', (req, res) => {
  req.query = req.query || {};
  req.query.id = req.params.id;
  answerIdHandler(req, res);
});
app.put('/api/answers/:id', (req, res) => {
  req.query = req.query || {};
  req.query.id = req.params.id;
  answerIdHandler(req, res);
});
app.delete('/api/answers/:id', (req, res) => {
  req.query = req.query || {};
  req.query.id = req.params.id;
  answerIdHandler(req, res);
});

// fallback to index.html for SPA
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'frontend', 'index.html')));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Dev server running: http://localhost:${PORT}`));
