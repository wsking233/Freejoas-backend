const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const { createToken } = require('../server/auth');


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
            res.status(201).send({ message: 'New user created successfully', data: removePassword(user) });
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    },
    //update a user with a specific ID
    updateUser: async (req, res) => {
        const userId = req.decodedToken._id;
        console.log('updateUser API called with userID:', userId);

        //check if accountType is in the request body
        if (req.body.accountType) {
            console.log(userId + " is trying to update account type with updateUser API.")
            return res.status(403).send({ message: 'Updating account type is not allowed' });
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
    // get all users or get users by IDs
    getUsersByIdsOrAll: async (req, res) => {
        const adminId = req.decodedToken._id; 
        console.log('getUsersByIdsOrAll called with adminID:', adminId);

        try {
            let users;
            let notFoundUserIds = []; // to store IDs of users not found

            if (req.query._id) { // if there is an _id parameter in the query
                // split the _id by comma
                const userIds = req.query._id.split(',');
                // find users by IDs
                const foundUsers = await userModel.find({ _id: { $in: userIds } }); 
                // get the IDs of users not found
                const foundUserIds = foundUsers.map(user => user._id.toString());
                notFoundUserIds = userIds.filter(id => !foundUserIds.includes(id));

                // if no users found, return 404
                if (foundUsers.length === 0) {
                    res.status(404).json({ message: 'Users not found' });
                    return;
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
                res.status(200).json({ message: `Some users not found: ${notFoundUserIds.join(', ')}`, data: safeUsers });
            } else {
                // if all requested users are found, return 200 with the users
                console.log('Users returned successfully');
                res.status(200).json({ message: 'Users returned successfully', data: safeUsers });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    //delete a user with a specific ID
    deleteUser: async (req, res) => {
        const adminId = req.decodedToken._id;
        const { userId } = req.body; //get the userId from the request body
        console.log('deleteUser called with userID:', adminId);
        try {
            const user = await userModel.findByIdAndDelete(userId);
            if (!user) {
                console.log('User not found', userId);
                return res.status(404).send({ message: 'User not found' });
            }
            console.log("User:" + userId + " is deleted by admin:" + adminId, user);
            console.log("------------------------------------------")
            res.status(200).send({ message: "User:" + userId + " is deleted by admin:" + adminId });
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    },
};

module.exports = UsersController;