const router = require('express').Router();
const { index, store, getMsg } = require('../../controller/message');

router.route("/all").get(getMsg)

router.route("/")
        .get(index)
        .post(store)

module.exports = router;