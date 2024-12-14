const router = require('express').Router();

router.post('/', (req, res) => {
    res.status(200).send({
        message: 'OK',
        data: req.body
    });
});

module.exports = router;