const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();

app.use(cors()); // ✅ ADD THIS
app.use(express.json());

// ✅ ALL ROUTES HERE (ONLY ONCE EACH)
const authRoutes = require('./routes/auth');
const testRoutes = require('./routes/test');
const fieldRoutes = require('./routes/fields');
const updateRoutes = require('./routes/updates');

app.use('/auth', authRoutes);
app.use('/test', testRoutes);
app.use('/fields', fieldRoutes);
app.use('/updates', updateRoutes);

// test route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// test DB
app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({
      message: 'Database connected!',
      time: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({ error: 'Database connection failed' });
  }
});

// ✅ listen ALWAYS LAST
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});