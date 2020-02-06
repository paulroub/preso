const express = require('express');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
    res.render('pres', { title: 'Preso' });
});

module.exports = router;
