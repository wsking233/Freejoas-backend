/**
 *  Auth Controller
 *  @version 2
 * 
 * This controller handles all user authentication
 * 
 */

const userModel = require('../../models/userModel');
const bcrypt = require('bcrypt');
const { createToken } = require('../server/auth');


const authController = {
     //login
     userLogin: async (req, res) => {
        const { email, password } = req.body;
        console.log('login called with email:', email);
        try {
            //find a user with email
            const user = await userModel.findOne({ email: email});
            if (!user) {
                console.log('User not found');
                return res.status(404).send({ message: 'User not found' });
            }

            //compare the password
            const validPassword = await bcrypt.compare(password, user.password);

            //check if the password is correct
            if (!validPassword) {
                console.log('Invalid password');
                return res.status(401).send({ message: 'Invalid password' });
            }

            if (!user.isEmailVerified) {
                console.log('Email not verified');
                return res.status(402).send({ message: 'Email not verified' });
            }

            //create a token
            const token = createToken(user);
            console.log('User logged in successfully', user);
            console.log("------------------------------------------")
            res.status(200).send({ message: 'User logged in successfully', token: token, data: removePassword(user)});
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    },

    //admin login
    adminLogin: async (req, res) => {
        const { email, password } = req.body;
        console.log('adminLogin called with email:', email);
        try {
            //find a user with email
            const user = await userModel.findOne({ email: email});
            if (!user) {
                console.log('User not found');
                return res.status(404).send({ message: 'User not found' });
            }

            //compare the password
            const validPassword = await bcrypt.compare(password, user.password);

            //check if the password is correct
            if (!validPassword) {
                console.log('Invalid password');
                return res.status(401).send({ message: 'Invalid password' });
            }

            // check if the user is an admin
            if (user.accountType !== 'admin') {
                console.log('User is not an admin');
                return res.status(403).send({ message: 'Request Denide, Authorized User Only' });
            }

            //create a token
            const token = createToken(user);
            console.log('User logged in successfully', user);
            console.log("------------------------------------------")
            res.status(200).send({ message: 'User logged in successfully', token: token, data: removePassword(user)});
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    },

}

module.exports = authController;

