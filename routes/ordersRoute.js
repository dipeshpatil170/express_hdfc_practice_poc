var express = require('express');
const { createOrder } = require('../controllers/ordersController');
const { checkAuth } = require('../middlewares/checkAuth');
var router = express.Router();

router.post('/', checkAuth, createOrder);

module.exports = router;
