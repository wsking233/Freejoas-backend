const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');


//remove password from the user object
function removePassword(user) {
    const userObject = user.toObject();
    delete userObject.password;
    return userObject;
}

const userController = {
    //login
    login: async (req, res) => {
        console.log('login called');
        try {
            //find a user with username or email
            const user = await userModel.findOne({
                $or: [
                    { username: req.body.username },
                    { email: req.body.email }
                ]
            });
            if (!user) {
                console.log('User not found');
                return res.status(404).send({ message: 'User not found' });
            }

            //compare the password
            const validPassword = await bcrypt.compare(req.body.password, user.password);

            //check if the password is correct
            if (!validPassword) {
                console.log('Invalid password');
                return res.status(401).send({ message: 'Invalid password' });
            }
            console.log('User logged in successfully', user);
            res.status(200).send({ message: 'User logged in successfully', user: removePassword(user) });
        } catch (error) {
            res.status(500).send({ message: 'Error logging in', error: error });
        }
    },
    //create a new user
    createUser: async (req, res) => {
        console.log('createUser called');
        console.log('req.body:', req.body);
        try {
            //check the email is exists in database
            if (await userModel.findOne({ email: req.body.email })) {
                return res.status(401).send('Email already exists');
            };

            // Hash the password
            req.body.password = await bcrypt.hash(req.body.password, 10);

            //create a new user
            const user = await userModel.create(req.body);
            await user.save();
            console.log('New user created successfully', user);
            res.status(201).send({ message: 'New user created successfully', user: removePassword(user)  });
        } catch (error) {
            res.status(500).send({ message: 'Error creating user', error });
        }
    },
    //update a user with a specific ID
    updateUser: async (req, res) => {
        console.log('updateUser called with userID:', req.params.userID);
        try {
            const user = await userModel.findByIdAndUpdate(
                req.params.userID,
                req.body,
                { new: true, runValidators: true });    //returns the updated user instead of the old user
            if (!user) {
                return res.status(404).send({ message: 'User not found' });
            }
            console.log('User updated successfully', removePassword(user) );
            res.status(200).send({ message: 'User updated successfully', user: removePassword(user)  });
        } catch (error) {
            res.status(500).send({ message: 'Error updating user', error: error });
        }
    },
    //get all users
    getAllUsers: async (req, res) => {
        console.log('getAllUsers called');
        try {
            const users = await userModel.find({});
            console.log('All users returned successfully');
            if (users.length === 0) {
                return res.status(200).send({ message: 'database is currently empty' });
            }
            const safeUsers = users.map(user => removePassword(user));
            res.status(200).send({ message: 'All users returned successfully', users: safeUsers  });
        } catch (error) {
            res.status(500).send({ message: 'Error getting users', error: error });
        }
    },
    //delete a user with a specific ID
    deleteUser: async (req, res) => {
        console.log('deleteUser called with userID:', req.params.userID);
        try {
            const user = await userModel.findByIdAndDelete(req.params.userID);
            if (!user) {
                console.log('User not found', req.params.userID);
                return res.status(404).send({ message: 'User not found', userID: req.params.userID });
            }
            console.log('User deleted successfully', user);
            res.status(200).send({ message: 'User deleted successfully', user: removePassword(user)  });
        } catch (error) {
            res.status(500).send({ message: 'Error deleting user', error: error });
        }
    },
};

module.exports = userController;