const mongoose = require('mongoose');

const connectDB = async (MONGO_URL) => {
    try {
        const conn = await mongoose.connect(MONGO_URL);

        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (e) {
        console.log("Trying to reconnect to DB. Waiting 1 sec...");
        setTimeout(() => connectDB(MONGO_URL), 1000);
    }
};

module.exports = { connectDB };