const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getPasses, createPass, deletePass, getPublicPass } = require('../controllers/passController');

router.get('/', auth, getPasses);
router.post('/', auth, createPass);
router.delete('/:id', auth, deletePass);
router.get('/public/:link', getPublicPass);

module.exports = router;