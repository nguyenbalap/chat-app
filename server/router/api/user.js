const router = require('express').Router();
const { index, store, login, update, updateUserOnline } = require('../../controller/user');
        
router.route("/register")
        .post(store)
router.route("/login")
        .post(login)
router.route("/:id")
        .get(index)
        .put(update)
router.route("/socket/:id")
        .put(updateUserOnline)
        

module.exports = router;