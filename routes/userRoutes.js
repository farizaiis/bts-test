const express = require('express');
const router = express.Router();
const user = require('../controllers/userController');
const { loginCheck } = require('../middlewares/authentication');

router.post('/signup', user.signup);
router.post('/signin', user.signin);
router.get('/', loginCheck, user.getAllUser);

module.exports = router;
