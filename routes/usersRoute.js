var express = require('express');
const { getUsers, registerUser, userLogin, userPasswordReset, getOrdersOfUsers, getLoggedInUserDetails } = require('../controllers/usersController');
const { checkAuth } = require('../middlewares/checkAuth');
var router = express.Router();

router.get('/', checkAuth, getUsers);
router.post('/', registerUser);
router.post('/login', userLogin);
router.post('/reset-password', checkAuth, userPasswordReset);
router.get('/me/orders', checkAuth, getOrdersOfUsers);
router.get('/me', checkAuth, getLoggedInUserDetails);

module.exports = router;
