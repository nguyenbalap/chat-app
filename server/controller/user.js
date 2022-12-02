const User = require('../model/User');
const bcrypt = require('bcrypt');

const index = async (req,res) => {
    const __id = req.params.id;
    // const users = await User.find({_id: {$ne: __id}, isOnline: true});
    const users = await User.find({isOnline: true});
    res.status(200).send({users: users, success: true});
}

const show = async (req, res) => {};

const store = async (req, res, next) => {
    const body = req.body;
    try {
        if (!body.email || !body.email.trim().length) {
            return res.status(422).json({
                message: "Email is required"
            })
        }
        if (!body.name || !body.name.trim().length) {
            return res.status(422).json({
                message: "Name is required"
            })
        }
        if (!body.password || !body.password.trim().length) {
            return res.status(422).json({
                message: "Password is required"
            })
        }
        const user = new User(body);
        user.save()
            .then((doc) => {
                res.status(201).json({
                    success: true,
                    data: doc,
                    message: "User saved successfully"
                });
            })
            .catch((err) => {
                res.status(500).json({ error: err, success: false });
            });
    }
    catch (err) {
        res.status(500).json({ error: err, success: false });
    }
        
};

const login = async (req, res) => {
    const body = req.body;

    if (!body.email || !body.email.length) {
        return res.status(422).send({
          message: 'email is required and must not be empty'
        })
    }
  
    if (!body.password || !body.password.length) {
        return res.status(422).send({
            message: 'Password is required and must not be empty'
        })
    }
    try {
        const user = await User.findOne({ email: body.email }).select('+password');
        if (user) {
            const validPassword = await bcrypt.compare(body.password, user.password)
            if (validPassword) {
                res.status(200).json({message: 'Valid Password', success: true, user: user});
            } else {
                res.status(404).json({message: 'Invalid Password'});
            }
        } else {
            res.status(404).json({ error: "User does not exist" });
        }
    }
    catch (err) {
        res.status(500).json({ error: err, success: false });
    }
    
};

const create = async (req, res) => {};

const edit = async (req, res) => {};

const update = async (req, res) => {
    console.log('Updating...');
    const body = req.body;
    const update = await User.updateOne({
        _id: req.params.id
    }, {
        $set: {
            name: body.name,
            email: body.email,
            password: body.password,
            isOnline: body.isOnline,
            socketId: body.socketId,
        }
    })
    res.send(update);
};

const updateUserOnline = async (req, res) => {
    const { id } = req.params;
    const { isOnline } = req.body;

    try {
        const update = await User.findOneAndUpdate({_id: id}, {isOnline: isOnline});
    } catch (error) {
        res.status(400).json({error: error, success: false});
    }
    res.status(200).json({success: true});
    
}

const destroy = async (req, res) => {};

module.exports = {
    index,
    store,
    update,
    login,
    updateUserOnline
}