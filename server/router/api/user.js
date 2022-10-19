const router = require('express').Router();
const { index, store, login, update } = require('../../controller/user');
router.route("/")
        .get(index)
        
router.route("/register")
        .post(store)
router.route("/login")
        .post(login)
router.route("/:id")
        .put(update)
        

module.exports = router;