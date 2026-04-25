const express = require('express');
const pool = require('../db');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth');
const { getFieldStatus } = require('../utils/status');

const router = express.Router();

// CREATE FIELD
router.post('/', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { name, crop_type, planting_date, current_stage } = req.body;

    if (!name || !crop_type || !planting_date) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await pool.query(
      `INSERT INTO fields (name, crop_type, planting_date, current_stage)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name, crop_type, planting_date, current_stage || 'Planted']
    );

    res.status(201).json(result.rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create field' });
  }
});


// GET FIELDS (WITH SAFE JOIN)
router.get('/', authenticateToken, async (req, res) => {
  try {
    let result;

    if (req.user.role === 'admin') {
      result = await pool.query(`
        SELECT f.*, u.name AS agent_name
        FROM fields f
        LEFT JOIN users u ON f.assigned_agent_id = u.id
        ORDER BY f.id DESC
      `);
    } else {
      result = await pool.query(`
        SELECT f.*, u.name AS agent_name
        FROM fields f
        LEFT JOIN users u ON f.assigned_agent_id = u.id
        WHERE f.assigned_agent_id = $1
        ORDER BY f.id DESC
      `, [req.user.id]);
    }

    const fieldsWithStatus = await Promise.all(
      result.rows.map(async (field) => {
        const lastUpdate = await pool.query(
          `SELECT * FROM field_updates
           WHERE field_id = $1
           ORDER BY created_at DESC
           LIMIT 1`,
          [field.id]
        );

        const status = getFieldStatus(field, lastUpdate.rows[0]);

        return {
          ...field,
          status
        };
      })
    );

    res.json(fieldsWithStatus);

  } catch (error) {
    console.error('GET /fields error:', error.message);
    res.status(500).json({ error: 'Failed to fetch fields' });
  }
});


// ASSIGN FIELD
router.put('/:id/assign', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const fieldId = req.params.id;
    const { agent_id } = req.body;

    const userCheck = await pool.query(
      'SELECT * FROM users WHERE id = $1 AND role = $2',
      [agent_id, 'agent']
    );

    if (userCheck.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid agent' });
    }

    const result = await pool.query(
      `UPDATE fields
       SET assigned_agent_id = $1
       WHERE id = $2
       RETURNING *`,
      [agent_id, fieldId]
    );

    res.json(result.rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Assignment failed' });
  }
});

module.exports = router;