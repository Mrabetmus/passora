const pool = require('../db');
const { v4: uuidv4 } = require('uuid');
const QRCode = require('qrcode');

const getPasses = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM passes WHERE business_id = $1 ORDER BY created_at DESC',
      [req.businessId]
    );
    res.json({ passes: result.rows });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

const createPass = async (req, res) => {
  const { name, type, description, background_color, text_color } = req.body;
  try {
    const unique_link = uuidv4().split('-')[0];
    const passUrl = `http://localhost:5000/pass/${unique_link}`;
    const qrCodeData = await QRCode.toDataURL(passUrl);

    const result = await pool.query(
      `INSERT INTO passes (business_id, name, type, description, background_color, text_color, unique_link, qr_code_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [req.businessId, name, type, description, background_color, text_color, unique_link, qrCodeData]
    );
    res.status(201).json({ message: 'Pass créé', pass: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

const deletePass = async (req, res) => {
  try {
    await pool.query(
      'DELETE FROM passes WHERE id = $1 AND business_id = $2',
      [req.params.id, req.businessId]
    );
    res.json({ message: 'Pass supprimé' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

const getPublicPass = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*, b.name as business_name FROM passes p
       JOIN businesses b ON p.business_id = b.id
       WHERE p.unique_link = $1`,
      [req.params.link]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Pass introuvable' });
    }
    await pool.query(
      'INSERT INTO scans (pass_id) VALUES ($1)',
      [result.rows[0].id]
    );
    res.json({ pass: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

module.exports = { getPasses, createPass, deletePass, getPublicPass };