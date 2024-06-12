const nodemailer = require('nodemailer');
const crypto = require('crypto');
const dotenv = require('dotenv').config();
const fs = require('fs');
const ejs = require('ejs');

if (dotenv.error) {//check if the .env file is present
    throw dotenv.error;
}

// Load local environment variables get the password
const EMAIL_SERVER_PASSWORD = process.env.EMAIL_SERVER_PASSWORD;
const EMAIL_SERVER_DOMAIN = process.env.EMAIL_SERVER_DOMAIN;
const EMAIL_SERVER_HOST = process.env.EMAIL_SERVER_HOST;
const EMAIL_SERVER_PORT = process.env.EMAIL_SERVER_PORT;


// Store email tokens in memory
const emailTokens = {};
const tokenLifetime = 60 * 60 * 1000; // 1 hour in milliseconds



// Create a nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    host: EMAIL_SERVER_HOST,
    port: EMAIL_SERVER_PORT,
    secure: true,
    auth: {
        user: EMAIL_SERVER_DOMAIN,
        pass: EMAIL_SERVER_PASSWORD,
    },
});

// Load the email template
const verifyEmailTemplate = fs.readFileSync('./models/verifyEmailTemplate.ejs', 'utf-8');

// generate a random token
function generateToken() {
    return crypto.randomBytes(20).toString('hex');
}

// send a verification email
async function sendVerificationEmail(req, res) {
    const { email, username } = req.body;
    const verifyURL = 'https://example.com';
    const token = generateToken();
    const createdAt = Date.now();
    emailTokens[email] = {token, createdAt};    // store the token and timestamp in memory

    try {
        const htmlContent = ejs.render(verifyEmailTemplate, { username, verifyURL });
        // set up email data
        const mailOptions = {
            to: email,
            subject: 'Email Verification - Freejoas',
            html: htmlContent,
        };

        // send mail with defined transport object
        await transporter.sendMail(mailOptions);
        res.status(200).send('Verification email sent');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error sending email');
    }
}

// verify an email address
function verifyEmail(req, res) {
    const { email, token } = req.query;
    const record = emailTokens[email];

    if(record && record.token === token) {
        const { createdAt } = record;
        const now = Date.now();
        if (now - createdAt < tokenLifetime) {
            delete emailTokens[email];
            /**
             * Update the user's account to mark it as verified
             */
            res.status(200).send('Email verified');
        } else {
            res.status(400).send('Token expired');
        }
    }else{
        res.status(400).send('Invalid token');
    }
}

// clear expired tokens
setInterval(() => {
    const now = Date.now();
    for (const email in emailTokens) {
        if (now - emailTokens[email].timestamp > tokenLifetime) {
            delete emailTokens[email];
        }
    }
}, 60 * 60 * 1000); // check every hour

module.exports = {
    sendVerificationEmail,
    verifyEmail,
};
