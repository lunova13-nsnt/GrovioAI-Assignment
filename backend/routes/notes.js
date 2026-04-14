const express  = require('express');
const router   = express.Router();
const db       = require('../db');
const authMiddleware = require('../middleware/auth');

// Protect all routes
router.use(authMiddleware);

// GET all notes for logged in user
router.get('/', (req, res) => {
  db.all(
    'SELECT * FROM notes WHERE user_id = ? ORDER BY updated_at DESC',
    [req.user.id],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

// GET single note
router.get('/:id', (req, res) => {
  db.get(
    'SELECT * FROM notes WHERE id = ? AND user_id = ?',
    [req.params.id, req.user.id],
    (err, row) => {
      if (err)  return res.status(500).json({ error: err.message });
      if (!row) return res.status(404).json({ error: 'Note not found.' });
      res.json(row);
    }
  );
});

// POST create note
router.post('/', (req, res) => {
  const { title = 'Untitled', content = '' } = req.body;
  db.run(
    'INSERT INTO notes (user_id, title, content) VALUES (?, ?, ?)',
    [req.user.id, title, content],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID, title, content });
    }
  );
});

// PUT update note
router.put('/:id', (req, res) => {
  const { title, content } = req.body;
  db.run(
    `UPDATE notes SET title = ?, content = ?, updated_at = datetime('now')
     WHERE id = ? AND user_id = ?`,
    [title, content, req.params.id, req.user.id],
    function (err) {
      if (err)             return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: 'Note not found.' });
      res.json({ id: req.params.id, title, content });
    }
  );
});

// DELETE note
router.delete('/:id', (req, res) => {
  db.run(
    'DELETE FROM notes WHERE id = ? AND user_id = ?',
    [req.params.id, req.user.id],
    function (err) {
      if (err)             return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: 'Note not found.' });
      res.status(204).send();
    }
  );
});

module.exports = router;