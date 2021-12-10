const express = require('express');
const router = express.Router();
const shopping = require('../controllers/shoppingController');
const { loginCheck } = require('../middlewares/authentication');

router.post('/', loginCheck, shopping.create);
router.get('/', loginCheck, shopping.getAllShopping);
router.get('/:id', loginCheck, shopping.getOneShopping);
router.put('/:id', loginCheck, shopping.updateShopping);
router.delete('/:id', loginCheck, shopping.deleteShopping);

module.exports = router;
