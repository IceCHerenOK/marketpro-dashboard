import express from 'express';
import authenticateToken from '../middleware/auth';
import { db } from '../database/init';

const knowledgeRouter = express.Router();

knowledgeRouter.get('/', authenticateToken, (req: any, res) => {
  db.all(
    `SELECT id, title, category, marketplace, tags, created_at, updated_at
     FROM knowledge_items
     WHERE user_id = ?
     ORDER BY updated_at DESC`,
    [req.user.id],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to load knowledge base' });
      }
      res.json({ items: rows || [] });
    }
  );
});

knowledgeRouter.get('/:id', authenticateToken, (req: any, res) => {
  db.get(
    `SELECT id, title, category, marketplace, tags, content_html, created_at, updated_at
     FROM knowledge_items
     WHERE user_id = ? AND id = ?`,
    [req.user.id, req.params.id],
    (err, row) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to load entry' });
      }
      if (!row) {
        return res.status(404).json({ error: 'Entry not found' });
      }
      res.json({ item: row });
    }
  );
});

knowledgeRouter.post('/', authenticateToken, (req: any, res) => {
  const { title, category, marketplace, contentHtml, tags } = req.body || {};
  if (!title || !contentHtml) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  db.run(
    `INSERT INTO knowledge_items (user_id, title, category, marketplace, content_html, tags)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [req.user.id, title, category || null, marketplace || null, contentHtml, tags || null],
    function (err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to create entry' });
      }
      res.status(201).json({ id: (this as any).lastID });
    }
  );
});

knowledgeRouter.put('/:id', authenticateToken, (req: any, res) => {
  const { title, category, marketplace, contentHtml, tags } = req.body || {};
  if (!title || !contentHtml) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  db.run(
    `UPDATE knowledge_items
     SET title = ?, category = ?, marketplace = ?, content_html = ?, tags = ?, updated_at = CURRENT_TIMESTAMP
     WHERE user_id = ? AND id = ?`,
    [title, category || null, marketplace || null, contentHtml, tags || null, req.user.id, req.params.id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to update entry' });
      }
      if ((this as any).changes === 0) {
        return res.status(404).json({ error: 'Entry not found' });
      }
      res.json({ success: true });
    }
  );
});

knowledgeRouter.delete('/:id', authenticateToken, (req: any, res) => {
  db.run(
    `DELETE FROM knowledge_items WHERE user_id = ? AND id = ?`,
    [req.user.id, req.params.id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to delete entry' });
      }
      if ((this as any).changes === 0) {
        return res.status(404).json({ error: 'Entry not found' });
      }
      res.json({ success: true });
    }
  );
});

export default knowledgeRouter;
