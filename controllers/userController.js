const userModel = require('../models/userModel');

const userController = {
    //login a user
    login: async (req, res) => {
        try {
            const user = await userModel.findOne({ googleSub: req.body.googleSub });
            if (!user) {
                //create a new user
                const newUser = new userModel(req.body);
                await newUser.save();
                res.status(201).send({message: 'New user logged in successfully'}, newUser);
            }
            res.status(200).send({message: 'User logged in successfully'}, user);
        } catch (error) {
            res.status(500).send(error);
        }
    },
};

module.exports = userController;