/**
 * usersController
 * @version 2
 */

const userModel = require('../../models/userModel');
const bcrypt = require('bcrypt');
const { ADMIN, USER } = require('../../server/auth');


//remove password from the user object
function removePassword(user) {
    const userObject = user.toObject();
    delete userObject.password;
    return userObject;
}

const UsersController = {

    //create a new user
    createUser: async (req, res) => {
        console.log('createUser called');
        try {
            //check the email is exists in database
            if (await userModel.findOne({ email: req.body.email })) {
                return res.status(401).send({ message: 'Email already exists' });
            };

            // Hash the password
            req.body.password = await bcrypt.hash(req.body.password, 10);

            //create a new user
            const user = await userModel.create(req.body);
            await user.save();
            console.log('New user created successfully', user);
            console.log("------------------------------------------")
            res.status(201).send({ message: 'New user created successfully' });
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    },

    //update a user
    updateUser: async (req, res) => {
        const userId = req.decodedToken._id;
        console.log('updateUser API called with userID:', userId);

        //check if token _id is the same as the parameter _id
        if (userId !== req.params.userId) {
            console.log('You are not authorized to update this user');
            console.log('user ID:', userId);
            console.log('param ID:', req.params.userId);
            return res.status(403).send({ message: 'Unauthorised opreation' });
        }

        //check if accountType is in the request body
        if (req.body.accountType) {
            console.log(userId + " is trying to update account type with updateUser API.")
            return res.status(403).send({ message: 'updating account type is not allowed' });
        }

        //check if password is in the request body
        if (req.body.password) {
            console.log(userId + " is trying to update password with updateUser API.")
            return res.status(403).send({ message: 'updating password is not allowed' });
        }

        try {
            const user = await userModel.findByIdAndUpdate(
                userId,    //find the user by ID
                req.body,           //update the user with the request body
                { new: true, runValidators: true });    //returns the updated user instead of the old user
            if (!user) {
                return res.status(404).send({ message: 'User not found' });
            }
            console.log('User updated successfully', removePassword(user));
            console.log("------------------------------------------")
            res.status(200).send({ message: 'User updated successfully', data: removePassword(user) });
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    },
    // update user password
    updatePassword: async (req, res) => {
        const userId = req.decodedToken._id;
        const { currentPassword, newPassword } = req.body;
        console.log('updatePassword called with userID:', userId);

        // check if currentPassword and newPassword are in the request body
        if (!currentPassword || !newPassword) {
            console.log('Please provide current Password and new Password');
            console.log("------------------------------------------")
            return res.status(400).send({ message: 'Please provide current Password and new Password' });
        }

        //check if token _id is the same as the parameter _id
        if (userId !== req.params.userId) {
            console.log('You are not authorized to update this user');
            console.log("------------------------------------------")
            return res.status(403).send({ message: 'Unauthorised opreation' });
        }

        try {
            // find the user by ID
            const user = await userModel.findById(userId);
            if (!user) {
                console.log('User not found');
                console.log("------------------------------------------")
                return res.status(404).send({ message: 'User not found' });
            }

            // check if the current password is correct
            const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);
            if (!isPasswordCorrect) {
                console.log('Current password is incorrect');
                console.log("------------------------------------------")
                return res.status(401).send({ message: 'Current password is incorrect' });
            }

            // check if the new password is the same as the current password
            const isSamePassword = await bcrypt.compare(newPassword, user.password);
            if (isSamePassword) {
                console.log('New password cannot be the same as the current password');
                console.log("------------------------------------------")
                return res.status(400).send({ message: 'New password cannot be the same as the current password' });
            }

            // hash the new password
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            // update the user with the new password
            user.password = hashedPassword;
            await user.save();

            console.log('Password updated successfully');
            console.log("------------------------------------------")
            res.status(200).send({ message: 'Password updated successfully' });
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    },

    updateAccountType: async (req, res) => {
        const adminId = req.decodedToken._id;
        const userId = req.params.userId;
        const { accountType } = req.body;
        console.log('updateAccountType called with userID:', adminId);

        // check if accountType is in the request body
        if (!accountType) {
            console.log('Please provide accountType');
            console.log("------------------------------------------")
            return res.status(400).send({ message: 'Please provide accountType' });
        }

        // check if accountType is either USER or ADMIN
        if (accountType.trim() !== USER && accountType.trim() !== ADMIN) {
            console.log('Invalid account type');
            console.log('accountType:', accountType);
            console.log("------------------------------------------")
            return res.status(400).send({ message: 'Invalid account type' });
        }

        try {
            // find the user by ID
            const user = await userModel.findById(userId);
            if (!user) {
                console.log('User not found');
                console.log("------------------------------------------")
                return res.status(404).send({ message: 'User not found' });
            }

            // update the user with the new accountType
            user.accountType = accountType;
            await user.save();

            console.log('Account type updated successfully');
            console.log("------------------------------------------")
            res.status(200).send({ message: 'Account type updated successfully' });
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    },


    // get all users or get users by IDs
    getUsersByIdsOrAll: async (req, res) => {
        const adminId = req.decodedToken._id;
        const { userIds } = req.query;
        console.log('getUsersByIdsOrAll called with adminID:', adminId);

        let userIdsArray = []; // to store the userIds array
        if (userIds) {
            console.log('userIds:', userIds);
            // split the userIds string into an array of userIds
            userIdsArray = userIds.split(',');
        }


        try {
            let users;  // to store the users found
            let notFoundUserIds = []; // to store IDs of users not found

            if (userIdsArray.length > 0) { // if there is an userIds parameter in the query
                // find users by IDs
                const foundUsers = await userModel.find({ _id: { $in: userIdsArray } });

                // if no users found, return 404
                if (foundUsers.length === 0) {
                    res.status(404).json({ message: 'Users not found' });
                    return;
                }

                // check if all users are found
                if (foundUsers.length !== userIdsArray.length) {
                    // get the IDs of users not found
                    const foundUserIds = foundUsers.map(user => user._id.toString());
                    notFoundUserIds = userIdsArray.filter(id => !foundUserIds.includes(id));
                }

                users = foundUsers;
            } else {
                // if no _id parameter, return all users
                users = await userModel.find({});
            }

            // remove password from each user
            const safeUsers = users.map(user => removePassword(user));

            if (notFoundUserIds.length > 0) {
                // if some requested users are not found, return 200 with a message
                console.log('some users not found:', notFoundUserIds);
                res.status(200).json({
                    message: `User returned successfully, but some users not found: ${notFoundUserIds.join(', ')}`,
                    data: safeUsers
                });
            } else {
                // if all requested users are found, return 200 with the users
                console.log('Users returned successfully');
                res.status(200).json({
                    message: 'Users returned successfully',
                    data: safeUsers
                });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    //delete a user with a specific ID
    deleteUser: async (req, res) => {
        const adminId = req.decodedToken._id;
        const { userIds } = req.query; //get the userId from the request body
        console.log('deleteUser called with userID:', adminId);

        // check if userIds is in the request body
        if (!userIds) {
            console.log('userIds not found in the request body');
            console.log("------------------------------------------")
            return res.status(400).send({ message: 'Please provide userIds' });
        }

        // split the userIds string into an array of userIds
        const userIdsArray = userIds.split(',');

        // check if the userIds array is empty
        if (userIdsArray.length === 0) {
            console.log('userIds array is empty');
            console.log("------------------------------------------")
            return res.status(400).send({ message: 'Please provide userIds' });
        }


        try {
            let notFoundUserIds = []; // to store IDs of users not found
            // find users by IDs
            const users = await userModel.find({ _id: { $in: userIdsArray } });

            // check if no users found
            if (!users || users.length === 0) {
                return res.status(404).send({ message: 'No users found with the provided IDs' });
            }

            // check if all users are found
            if (users.length !== userIdsArray.length) {
                // get the IDs of users not found
                const foundUserIds = users.map(user => user._id.toString());
                notFoundUserIds = userIdsArray.filter(id => !foundUserIds.includes(id));
            }

            // delete users
            await userModel.deleteMany({ _id: { $in: userIdsArray } });

            // if notFoundUserIds is not empty, return 200 with a message
            if (notFoundUserIds.length > 0) {
                console.log('some users not found:', notFoundUserIds);
                res.status(200).json({
                    message: `Users deleted successfully, but some users not found: ${notFoundUserIds.join(', ')}`,
                });
            } else {
                console.log('Users deleted successfully');
                res.status(200).json({
                    message: 'Users deleted successfully',
                });
            }


        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    },

    // send email verification

};

module.exports = UsersController;