const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth.middleware');
const { getProfile, updateProfile } = require('../controllers/user.controller');
const { updateFcmToken } = require('../controllers/user.controller');


router.get('/profile', auth, getProfile);
router.put('/update', auth, updateProfile);
router.post('/update-fcm-token', auth, updateFcmToken);

module.exports = router;