const Message = require('../model/Message');

const index = async (req,res) => {
    const messages = await Message.find({});
    res.send(messages)
}

const getMsg = async (req, res) => {
    const {to, from } = req.query;
    try {
        const messages = await Message.find({})
            .or([
                {
                    sender: from, 
                    receiver: to
                },
                {
                    sender: to, 
                    receiver: from
                }]).populate('sender', 'name').select('message receiver sender created_at')
                .exec();
        res.status(200).json({messages: messages})
    }
    catch (err) {
        console.log(err);
        res.status(400).json({err: err})
    }
    
}

const show = async (req, res) => {};

const store = async (req, res) => {
    try {
        const messages = new Message({
            message: req.body.message,
            sender: req.body.sender,
            receiver: req.body.receiver,
        })
        messages.save();
        res.status(200).json({success: true});
    }catch (err) {
        res.status(400).json({success: false, message: err});
    }
    
};

const create = async (req, res) => {};

const edit = async (req, res) => {};

const update = async (req, res) => {};

const destroy = async (req, res) => {};

module.exports = {
    index,
    store,
    getMsg
}