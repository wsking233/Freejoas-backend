const userModel = require('../models/userModel');

const userController = {
    //login a user
    login: async (req, res) => {
        try {
            const user = await userModel.findOne({ googleSub: req.body.googleSub });
            if (!user) {
                //create a new user when the user is not found
                const newUser = new userModel(req.body);
                await newUser.save();
                return res.status(201).send({message: 'New user logged in successfully'}, newUser);
            }
            res.status(200).send({message: 'User logged in successfully'}, user);
        } catch (error) {
            res.status(500).send({message: 'Error logging in user', error: error});
        }
    },
};

module.exports = userController;