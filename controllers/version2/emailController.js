const nodemailer = require('nodemailer');
const crypto = require('crypto');
const fs = require('fs');
const ejs = require('ejs');
const userModel = require('../../models/userModel');
const config = require('../../server/config');


// Load local environment variables get the password
const EMAIL_SERVER_PASSWORD = config.EMAIL_SERVER_PASSWORD;
const EMAIL_SERVER_DOMAIN = config.EMAIL_SERVER_DOMAIN;
const EMAIL_SERVER_HOST = config.EMAIL_SERVER_HOST;
const EMAIL_SERVER_PORT = config.EMAIL_SERVER_PORT;
const VERIFICATION_SERVER_DOMAIN = config.VERIFICATION_SERVER_DOMAIN;


// Store email tokens in memory
const verificationTokens = {};
const resetPasswordTokens = {};
const oneDayTokenTime = 24 * 60 * 60 * 1000; // 1 day in milliseconds
const oneHourTokenTime = 60 * 60 * 1000; // 1 hour in milliseconds

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
const verifyEmailTemplate = fs.readFileSync('../../templates/verifyEmailTemplate.ejs', 'utf-8');
const resetPasswordTemplate = fs.readFileSync('../../templates/resetPasswordTemplate.ejs', 'utf-8');

// generate a random token
function generateToken() {
    return crypto.randomBytes(20).toString('hex');
}

// send a verification email
async function sendVerificationEmail(req, res) {
    const { email } = req.body;
    const token = generateToken();
    const createdAt = Date.now();
    verificationTokens[email] = {token, createdAt};    // store the token and timestamp in memory
    const verifyURLV2 = `${VERIFICATION_SERVER_DOMAIN}/api/v2/users/verify-email?email=${email}&token=${token}`;
    const verifyURL = verifyURLV2;

    try {
        const htmlContent = ejs.render(verifyEmailTemplate, { verifyURL });
        // set up email data
        const mailOptions = {
            to: email,
            subject: 'Email Verification - Freejoas',
            html: htmlContent,
        };

        // send mail with defined transport object
        await transporter.sendMail(mailOptions);
        console.log("verify url: ", verifyURL);
        res.status(200).send({ message: 'Verification email sent' , data: verifyURL});
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Failed to send verification email' });
    }
}


// send a reset password email
async function sendResetPasswordEmail(req, res) {
    const { email } = req.body;
    const token = generateToken();
    const createdAt = Date.now();
    resetPasswordTokens[email] = {token, createdAt};    // store the token and timestamp in memory
    const resetURLV2 = `${VERIFICATION_SERVER_DOMAIN}/api/v2/users/reset-password?email=${email}&token=${token}`;
    const resetPasswordURL = resetURLV2;

    try {
        const htmlContent = ejs.render(resetPasswordTemplate, { resetPasswordURL });
        // set up email data
        const mailOptions = {
            to: email,
            subject: 'Reset Password - Freejoas',
            html: htmlContent,
        };

        // send mail with defined transport object
        await transporter.sendMail(mailOptions);
        console.log("reset url: ", resetPasswordURL);
        res.status(200).send({ message: 'Reset password email sent' , data: resetPasswordURL});
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Failed to send reset password email' });
    }
}


// verify an email address
function verifyEmail(req, res) {
    const { email, token } = req.query;
    const record = verificationTokens[email];

    if (!record) {  // no record found
        console.log('No token record found');
        return res.redirect('/verificationFailed.html');
    }

    if(record.token === token) {    // token matches
        const { createdAt } = record;
        const now = Date.now();
        if (now - createdAt < oneDayTokenTime) {  // token is still valid
            // remove the token from memory
            delete verificationTokens[email]; 
            // Update the user's account to mark it as verified
            activeUser(email);
            console.log('Email verified');
            return res.redirect('/verificationSuccess.html');
        }
        console.log('Token expired');
        return res.redirect('/verificationFailed.html');
    }
}

// reset password
function resetPassword(req, res) {
    const { email, token } = req.query;
    const record = resetPasswordTokens[email];

    if (!record) {  // no record found
        console.log('No token record found');
        return res.redirect('/invalidToken.html');
    }

    if(record.token === token) {    // token matches
        const { createdAt } = record;
        const now = Date.now();
        if (now - createdAt < oneDayTokenTime) {  // token is still valid
            // remove the token from memory
            delete resetPasswordTokens[email]; 
            console.log('Reset password');
            return res.redirect('/resetPasswordSuccess.html');
        }
        console.log('Token expired');
        return res.redirect('/resetPasswordFailed.html');
    }
}


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

// update new password
async function updatePassword(req, res) {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({
            email,
        });
        user.password = password;
        await user.save();
        res.status(200).send({ message: 'Password updated' });
    }
    catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Failed to update password' });
    }
}

// clear expired tokens
setInterval(() => {
    const now = Date.now();
    for (const email in verificationTokens) {
        if (now - verificationTokens[email].timestamp > oneDayTokenTime) {
            delete verificationTokens[email];
        }
    }
}, oneHourTokenTime); // check every hour

module.exports = {
    sendVerificationEmail,
    sendResetPasswordEmail,
    verifyEmail,
};
