const express = require('express');
const { register, login, getMe, forgotPassword, resetPassword, updateDetails, updatePassword } = require('../controller/auth');

const router = express.Router();
const { protect } = require('../middleware/auth');

router.post('/register', register).post('/login', login);
router.route('/me').get(protect, getMe);
router.put('/updatedetails', protect, updateDetails);
router.put('/updatepassword', protect, updatePassword);
router.route('/forgotpassword').post(forgotPassword);
router.route('/resetpassword/:resettoken').put(resetPassword);
module.exports = router;