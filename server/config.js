/**
 *  this file is used to load environment variables
 */

const environment = process.env.NODE_ENV || 'development';

if (environment === 'development') {
    const dotenv = require('dotenv').config();

    if (dotenv.error) {
        throw dotenv.error;
    }
}


// server port
const PORT = process.env.PORT;
// MongoDB URL
const MONGO_DB_URL = process.env.MONGO_DB_URL;
// Email server variables
const EMAIL_SERVER_PASSWORD = process.env.EMAIL_SERVER_PASSWORD;
const EMAIL_SERVER_DOMAIN = process.env.EMAIL_SERVER_DOMAIN;
const EMAIL_SERVER_HOST = process.env.EMAIL_SERVER_HOST;
const EMAIL_SERVER_PORT = process.env.EMAIL_SERVER_PORT;

module.exports = {
    PORT,
    MONGO_DB_URL,
    EMAIL_SERVER_PASSWORD,
    EMAIL_SERVER_DOMAIN,
    EMAIL_SERVER_HOST,
    EMAIL_SERVER_PORT
}