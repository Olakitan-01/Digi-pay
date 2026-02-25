const express = require('express');
const { protectAdmin } = require('../middleware/auth.middleware');
const { freezeAccount, manageKyc, getAllTransactions, getAllUsers } = require('../controllers/admin.controller');

const router = express.Router();

router.use(protectAdmin); // Protects all admin routes

router.post('/freeze-account', freezeAccount);
router.post('/manage-kyc', manageKyc);
router.get('/transactions', getAllTransactions);
router.get('/users', getAllUsers);

module.exports = router;