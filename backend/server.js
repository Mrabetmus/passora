const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const pool = require('./db');

app.use(cors());
app.use(express.json());

// Servir le frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Routes API
const authRoutes = require('./routes/authRoutes');
const passRoutes = require('./routes/passRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/passes', passRoutes);

// Route pass public
app.get('/pass/:link', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pass.html'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur Passora démarré sur le port ${PORT}`);
});