var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { err: 'Error: You need to add a proper action, see examples bellow.' });
});

module.exports = router;
