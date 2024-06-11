const { Mongoose } = require('mongoose');
const freejoaModel = require('../models/freejoaModel');
const userModel = require('../models/userModel');


function removeImage(freejoa) {
    const freejoaObject = freejoa.toObject();
    freejoaObject.image = freejoaObject.image.map(image => {
        if(image.data.length !== 0) image.data = "image data"; //replace the image data with a string
        return image;
    });
    return freejoaObject;
}


const freejoaController = {

    //upload a new freejoa
    uploadFreejoa: async (req, res) => {
        const userId = req.decodedToken._id;
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
            const freejoa = new freejoaModel(req.body);
            freejoa.uploader = userId;  //set the uploader to the current user
            freejoa.updatedBy = userId;   //set the updatedBy to the current user
            await freejoa.save();

            const user = new userModel().findByIdAndUpdate(
                userId,
                { push: { uploads: freejoa._id } },
                { new: true, runValidators: true }
            )

            console.log("New freejoa created successfully");
            console.log("user uploads:", user.uploads)
            console.log("------------------------------------------")
            res.status(201).send({ message: 'New freejoa uploaded successfully'});
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
            res.status(200).send({message: 'All freejoas returned successfully', data: freejoas});
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
        const freejoaId = req.body.freejoaId; //get the freejoaId from the request body
        console.log("updateFreejoa called with userID:", userId);
        try {
            //get the freejoa by ID
            const freejoa = await freejoaModel.findById(freejoaId);

            if (!freejoa) { //if freejoa not found return 404
                console.log("Freejoa not found, request ID: ", freejoaId);
                return res.status(404).send({ message: 'Freejoa not found' });
            }

            //check if imageId is in the request body
            if (req.body.imageId) {
                const imageId = req.body.imageId;
                const imageFound = freejoa.image.id(imageId);   //find the image from the image array
                if (!imageFound) {  //if image not found return 404
                    console.log("Image not found, request ID: ", imageId);
                    return res.status(404).send({ message: 'Image not found' });
                }
                imageFound.remove(); //delete the image
            }

            //check if the request body contains image key
            if (req.body.image) {
                freejoa.image.push(req.body.image); //add the image to the freejoa
            }

            //check all other keys in the request body
            for (const key in req.body) {
                if (key !== "imageId" && key !== "image") {
                    freejoa[key] = req.body[key];   //update the freejoa with the request body
                }
            }

            freejoa.updatedBy = userId;   //set the updatedBy to the current user
            await freejoa.save();    //save the updated freejoa

            res.status(200).send({ message: 'Freejoa updated successfully'});
            console.log("------------------------------------------");
        } catch (error) {
            console.log("Error updating freejoa", error);
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