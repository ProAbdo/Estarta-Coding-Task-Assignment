const express = require('express');
const router = express.Router();
const empStatusRoutes = require('./empStatus');

router.use('/api', empStatusRoutes);

module.exports = router;