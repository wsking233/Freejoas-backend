const nodemailer = require('nodemailer');
const crypto = require('crypto');
const fs = require('fs');
const ejs = require('ejs');
const userModel = require('../models/userModel');

///////////////////////////////////////////////////
/*************************************************/
/**
 * use this area in local environment only
 * Load local environment variables
 * 
 */

// const dotenv = require('dotenv').config();
// if(dotenv.error){//check if the .env file is present
//     throw dotenv.error;
// }

//comment this area out before pushing to cloud

/*************************************************/
///////////////////////////////////////////////////


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
    const token = generateToken();
    const createdAt = Date.now();
    emailTokens[email] = {token, createdAt};    // store the token and timestamp in memory
    const verifyURL = `https://freejoas.azurewebsites.net/api/v1/verification/verify?email=${email}&token=${token}`;

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
        console.log("verify url: ", verifyURL);
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

    if (!record) {  // no record found
        console.log('No record found');
        console.log('Invalid token');
        return res.redirect('/verificationFailed.html');
    }

    if(record.token === token) {    // token matches
        const { createdAt } = record;
        const now = Date.now();
        if (now - createdAt < tokenLifetime) {  // token is still valid
            // remove the token from memory
            delete emailTokens[email]; 
            // Update the user's account to mark it as verified
            activeUser(email);
            console.log('Email verified');
            return res.redirect('/verificationSuccess.html');
        }
        console.log('Token expired');
        return res.redirect('/verificationFailed.html');
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

// active user
async function activeUser(email) {
    try {
        const user = await userModel.findOne({
            email,
        });
        user.isEmailVerified = true;
        await user.save();
    }
    catch (error) {
        console.error(error);
    }
}

module.exports = {
    sendVerificationEmail,
    verifyEmail,
};
