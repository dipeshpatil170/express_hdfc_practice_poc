var express = require('express');
const { createProduct, getProducts, singleProduct } = require('../controllers/productsController');
var router = express.Router();
const { checkAuth } = require('../middlewares/checkAuth');

router.get('/', checkAuth, getProducts);
router.post('/', checkAuth, createProduct);
router.get('/:id', checkAuth, singleProduct);

module.exports = router;
