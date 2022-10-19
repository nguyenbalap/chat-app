const router = require('express').Router();
const { index } = require('../../controller/message');
router.route("/")
        .get(index)

module.exports = router;