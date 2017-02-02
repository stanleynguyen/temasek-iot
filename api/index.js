const router = require('express').Router();

router.use('/api/admin', require('./admin'));
router.use('/api/voter', require('./voter'));
router.use('/api/organiser', require('./organiser'));

module.exports = router;
