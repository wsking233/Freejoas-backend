const MONGO_DB_URL = process.env.MONGO_DB_URL;

const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_DB_URL);
        console.info('Connected to MongoDB');
        console.info('you can now make requests to the database')
        console.info(`-----------------------------------------------`);
    } catch (error) {
        console.error('Error connecting to MongoDB', error);
    }
}

module.exports = {
    connectDB,
    mongoose
};