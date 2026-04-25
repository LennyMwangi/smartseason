const express = require('express');
const pool = require('../db');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth');

const router = express.Router();

router.post('/:fieldId', authenticateToken, authorizeRoles('agent'), async (req, res) => {
  try {
    const fieldId = req.params.fieldId;
    const { stage, notes } = req.body;

    if (!stage) {
      return res.status(400).json({ error: 'Stage is required' });
    }

    // check field exists and belongs to agent
    const fieldCheck = await pool.query(
      'SELECT * FROM fields WHERE id = $1 AND assigned_agent_id = $2',
      [fieldId, req.user.id]
    );

    if (fieldCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Not authorized for this field' });
    }

    // insert update
    await pool.query(
      `INSERT INTO field_updates (field_id, user_id, stage, notes)
       VALUES ($1, $2, $3, $4)`,
      [fieldId, req.user.id, stage, notes]
    );

    // update field current stage
    await pool.query(
      `UPDATE fields SET current_stage = $1 WHERE id = $2`,
      [stage, fieldId]
    );

    res.json({ message: 'Update added successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add update' });
  }
});

router.get('/test', (req, res) => {
  res.send('Updates route working');
});

router.get('/:fieldId', authenticateToken, async (req, res) => {
  try {
    const fieldId = req.params.fieldId;

    let result;

    if (req.user.role === 'admin') {
      // admin can see all updates
      result = await pool.query(
        'SELECT * FROM field_updates WHERE field_id = $1 ORDER BY created_at DESC',
        [fieldId]
      );
    } else {
      // agent can only see their updates
      result = await pool.query(
        `SELECT * FROM field_updates 
         WHERE field_id = $1 AND user_id = $2
         ORDER BY created_at DESC`,
        [fieldId, req.user.id]
      );
    }

    res.json(result.rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch updates' });
  }
});



module.exports = router;

