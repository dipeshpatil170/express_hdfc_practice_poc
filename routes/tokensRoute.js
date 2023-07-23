var express = require('express');
const { checkAuth } = require('../middlewares/checkAuth');
const { reNewAccessToken } = require('../controllers/tokensController');
var router = express.Router();

router.post('/', checkAuth, reNewAccessToken);

module.exports = router;
