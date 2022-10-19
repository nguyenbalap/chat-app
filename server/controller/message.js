const Message = require('../model/Message');

const index = async (req,res) => {
    const messages = await Message.find({});
    res.send(messages)
}

const show = async (req, res) => {};

const store = async (req, res) => {};

const create = async (req, res) => {};

const edit = async (req, res) => {};

const update = async (req, res) => {};

const destroy = async (req, res) => {};

module.exports = {
    index
}