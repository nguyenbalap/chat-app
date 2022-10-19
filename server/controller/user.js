const User = require('../model/User');
const bcrypt = require('bcrypt');

const index = async (req,res) => {
    const users = await User.find({isOnline: true});
    res.status(200).send({users: users, success: true});
}

const show = async (req, res) => {};

const store = async (req, res, next) => {
    const body = req.body;
    const user = await User.find({$or: [{'email': body.email}, {'name': body.name}]});
    if (user.length === 0) {
        const new_user = new User(body);
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        new_user.password = await bcrypt.hash(new_user.password, salt);
    
        new_user.save()
            .then((doc) => {
                res.status(201).json({
                    success: true,
                    data: doc,
                });
            })
            .catch((err) => {
                res.status(400).json({ error: err, success: false });
            });
    } else {
        res.status(400).json({success: false, message: "Email or user name is already exists" });
    }
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

const update = async (req, res) => {
    const body = req.body;
    console.log(req.params.id)
    const update = await User.updateOne({
        _id: req.params.id
    }, {
        $set: {
            name: body.name,
            email: body.email,
            password: body.password,
            isOnline: body.isOnline,
        }
    })
    res.send(update);
};

const destroy = async (req, res) => {};

module.exports = {
    index,
    store,
    update,
    login,
}