const express = require('express');
const router = express.Router();
const usersRouter = require('./userRoutes');
const shoppingRouter = require('./shoppingRoutes');

router.use('/shopping', shoppingRouter);
router.use('/users', usersRouter);

module.exports = router;
