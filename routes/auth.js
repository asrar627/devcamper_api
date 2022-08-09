const express = require('express');
const { register, login, getMe } = require('../controller/auth');

const router = express.Router();
const { protect } = require('../middleware/auth');

router.post('/register', register).post('/login', login);
router.route('/me').get(protect, getMe);
module.exports = router;