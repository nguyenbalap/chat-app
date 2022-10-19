const User = require('../model/User');
const bcrypt = require('bcrypt');

const index = async (req,res) => {
    const user = await User.find({});
    res.send(user)
}

const show = async (req, res) => {};

const store = async (req, res, next) => {
    const body = req.body;

    const user = new User(body);
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    user.password = await bcrypt.hash(user.password, salt);

    user.save()
        .then((doc) => {
            res.status(201).json({
                success: true,
                data: doc,
            });
        })
        .catch((err) => {
            res.status(400).json({ error: err, success: false });
        });
};

const login = async (req, res) => {
    const body = req.body;
    const user = await User.findOne({ email: body.email });
    if (user) {
        const validPassword = await bcrypt.compare(body.password, user.password)
        if (validPassword) {
            res.status(200).json({mess: 'Valid Password', success: true, user: user});
        } else {
            res.status(400).json({mess: 'Invalid Password'});
        }
    } else {
        res.status(401).json({ error: "User does not exist" });
    }
};

const create = async (req, res) => {};

const edit = async (req, res) => {};

const update = async (req, res) => {};

const destroy = async (req, res) => {};

module.exports = {
    index,
    store,
    login,
}