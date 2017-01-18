const router = require('express').Router();

router.use('/api/admin', require('./admin'));

module.exports = router;
