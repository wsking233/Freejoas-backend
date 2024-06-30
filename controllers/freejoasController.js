const { Mongoose } = require('mongoose');
const freejoaModel = require('../models/freejoaModel');
const userModel = require('../models/userModel');
const pendingFreejoaModel = require('../models/pendingFreejoaModel');


function removeImage(freejoa) {
    const freejoaObject = freejoa.toObject();
    freejoaObject.image = freejoaObject.image.map(image => {
        if (image.data.length !== 0) image.data = "image data"; //replace the image data with a string
        return image;
    });
    return freejoaObject;
}


const freejoaController = {

    //upload a new freejoa
    uploadFreejoa: async (req, res) => {
        const userId = req.decodedToken._id;
        // const data =  req.body.freejoa;
        console.log("createFreejoa called with userID:", userId);
        try {

            //if this user is deleted but the token is not expired
            //this token still able to pass the verifyToken middleware
            //check is this user exists in database
            if (!await userModel.findById(userId)) {
                console.log("User not found");
                return res.status(404).send({ message: 'User not found' });
            }

            //create a new freejoa
            const freejoa = new pendingFreejoaModel({   // upload the freejoa to the pendingFreejoa collection
                ...req.body,
                uploader: userId,   //add the uploader ID
                updatedBy: userId  //add the updatedBy ID
            });
            await freejoa.save();

            console.log("reuqest body:", req.body);
            

            // add the freejoa to the user's uploads
            const user = await userModel.findByIdAndUpdate(
                userId,
                { $push: { uploads: freejoa._id } },
                { new: true, runValidators: true }
            );

            console.log("New freejoa created successfully");
            console.log("user uploads:", user.uploads)
            console.log("freejoa:", freejoa);
            console.log("------------------------------------------")
            res.status(201).send({ message: 'New freejoa uploaded successfully' });
        } catch (error) {
            console.log("Error creating freejoa", error);
            res.status(500).send({ message: error.message });
        }
    },
    //get all freejoas
    getAllFreejoas: async (req, res) => {
        const userId = req.decodedToken._id;
        console.log("getAllFreejoas called with userID:", userId);
        try {
            const freejoas = await freejoaModel.find({});
            if (freejoas.length === 0) {
                return res.status(200).send({ message: 'database is currently empty' });
            }
            console.log("All freejoas returned successfully");
            console.log("------------------------------------------");
            res.status(200).send({ message: 'All freejoas returned successfully', data: freejoas });
        } catch (error) {
            console.log("Error getting freejoas", error);
            res.status(500).send({ message: error.message });
        }
    },
    //get freejoa by ID
    getFreejoaByID: async (req, res) => {
        const userId = req.decodedToken._id;
        const freejoaId = req.params.freejoaId; //get the freejoaId from the params
        console.log("getFreejoaByID called with userID:", userId);
        try {
            const freejoa = await freejoaModel.findById(freejoaId);
            if (!freejoa) {
                console.log("Freejoa not found, request ID: ", freejoaId);
                return res.status(404).send({ message: 'Freejoa not found' });
            }
            console.log("Freejoa is found");
            res.status(200).send({ message: 'Freejoa is found', data: freejoa });
            console.log("------------------------------------------");
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    },
    //update a freejoa with a specific ID
    updateFreejoa: async (req, res) => {
        const userId = req.decodedToken._id;
        const { freejoaId, updatedData } = req.body;
        console.log("submitUpdateRequest called with userID:", userId);
        try {
            //find the freejoa by ID
            const freejoa = await freejoaModel.findById(freejoaId);
            if (!freejoa) {
                console.log("Freejoa not found, request ID: ", freejoaId);
                return res.status(404).send({ message: 'Freejoa not found' });
            }
            // create a new object with the updated data
            const completeUpdatedData = {
                ...freejoa.toObject(), // copy the original data
                ...updatedData, //update the data with the new data
            };

            // create a new pending update request
            const newPendingUpdate = new PendingFreejoa({
                _id: freejoaId,
                ...completeUpdatedData,
                requestType: 'update',
                updatedBy: userId
            });
            await newPendingUpdate.save();

            res.status(200).send({ message: 'Update request submitted successfully' });
            console.log("------------------------------------------");
        } catch (error) {
            console.log("Error submitting update request", error);
            res.status(500).send({ message: error.message });
        }
    },
    //delete a freejoa with a specific ID
    deleteFreejoa: async (req, res) => {
        const adminId = req.decodedToken._id;
        const freejoaId = req.body.freejoaId; //get the freejoaId from the request body
        console.log("deleteFreejoa called with userID:", adminId);
        try {
            const freejoa = await freejoaModel.findByIdAndDelete(freejoaId);
            if (!freejoa) {
                console.log("Freejoa not found, request ID: ", freejoaId);
                return res.status(404).send({ message: 'Freejoa not found' });
            }
            console.log("Freejoa deleted successfully");
            res.status(200).send({ message: "Freejoa: " + freejoaId + " is deleted by admin:" + adminId });
        } catch (error) {
            console.log("Error deleting freejoa", error);
            res.status(500).send({ message: error.message });
        }
    }
};


module.exports = freejoaController;