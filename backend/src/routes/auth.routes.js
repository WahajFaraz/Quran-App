const express = require('express');
const { register, login, aalimRegister, aalimLogin, deleteAccount } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/aalim/register', aalimRegister);
router.post('/aalim/login', aalimLogin);
router.delete('/account', protect, deleteAccount);

module.exports = router;
