const express = require('express');
const router = express.Router();

// MAIN ROUTES
router.get('/', async (req, res) => {
    res.render('index');
});

module.exports = router;