const router = require('express').Router();
const { index, store, login } = require('../../controller/user');
router.route("/")
        .get(index)
        
router.route("/register")
        .post(store)
router.route("/login")
        .post(login)

module.exports = router;