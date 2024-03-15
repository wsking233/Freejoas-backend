const { Mongoose } = require('mongoose');
const freejoaModel = require('../models/freejoaModel');
const fs = require('fs');


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
                return res.status(404).send({message: 'User not found'});
            }

            //create a new freejoa
            const freejoa = new freejoaModel(req.body);
            freejoa.uploader = userId;  //set the uploader to the current user
            freejoa.updatedBy = userId;   //set the updatedBy to the current user
            await freejoa.save();
            console.log("New freejoa created successfully", freejoa);
            console.log("------------------------------------------")
            res.status(201).send({message: 'New freejoa uploaded successfully', freejoa: freejoa});
        } catch (error) {
            console.log("Error creating freejoa", error);
            res.status(500).send({message: 'Error uploading a freejoa', error: error.message});
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
            res.status(200).send(freejoas);
        } catch (error) {
            console.log("Error getting freejoas", error);
            res.status(500).send({message: 'Error getting freejoas', error: error.message});
        }
    },
    //get freejoa by ID
    getFreejoaByID: async (req, res) => {
        const userId = req.decodedToken._id;
        const freejoaId = req.body.freejoaId; //get the freejoaId from the request body
        console.log("getFreejoaByID called with userID:", userId);
        try {
            const freejoa = await freejoaModel.findById(freejoaId);
            if (!freejoa) {
                console.log("Freejoa not found, request ID: ", freejoaId);
                return res.status(404).send({message:'Freejoa not found'});
            }
            console.log("Freejoa found:",freejoa);
            res.status(200).send({message: 'Freejoa found', freejoa: freejoa});
            console.log("------------------------------------------");
        } catch (error) {
            res.status(500).send({message: 'Error getting freejoa', error: error.message});
        }
    },
    //update a freejoa with a specific ID
    updateFreejoa: async (req, res) => {
        const userId = req.decodedToken._id;
        const freejoaId = req.body.freejoaId; //get the freejoaId from the request body
        console.log("updateFreejoa called with userID:", userId);
        try {
            const freejoa = await freejoaModel.findByIdAndUpdate(
                freejoaId, //find the freejoa by ID
               {
                ...
                req.body,   //update the freejoa with the request body
                updatedBy: userId   //set the updatedBy to the current user
            },
                { new: true, runValidators: true });
            if (!freejoa) {
                console.log("Freejoa not found, request ID: ", freejoaId);
                return res.status(404).send({message:'Freejoa not found'});
            }
            res.status(200).send({message: 'Freejoa updated successfully', freejoa: freejoa});
            console.log("------------------------------------------");
        } catch (error) {
            console.log("Error updating freejoa", error);
            res.status(500).send({message: 'Error updating freejoa', error: error.message});
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
                console.log("Freejoa not found, request ID: ",freejoaId);
                return res.status(404).send({message:'Freejoa not found'});
            }
            console.log("Freejoa deleted successfully", freejoa);
            res.status(200).send({ message: "Freejoa: " + freejoaId + " is deleted by admin:" + adminId});
        } catch (error) {
            console.log("Error deleting freejoa", error);
            res.status(500).send({message: 'Error deleting freejoa', error: error.message});
        }
    },
    //upload images for a freejoa
    uploadImages: async (req, res) => {
        const userId = req.decodedToken._id;
        const freejoaId = req.body.freejoaId; //get the freejoaId from the request body
        // const freejoaId = "65b8a03d5439c0e653ad5746";
        console.log("uploadImages called with userID:", userId);
        try {
            const freejoa = await freejoaModel.findById(freejoaId);
            if (!freejoa) {
                console.log("Freejoa not found, request ID: ",freejoaId);
                return res.status(404).send({message:'Freejoa not found'});
            }
            if(!req.body.images){
                console.log("No images found in the request body");
                return res.status(400).send({message: 'No images found in the request body'});
            }

            const file = req.body.images;

            fs.readFile(file.path, (err, data)=>{
                if(err){
                    console.log("Error reading file", err.message);
                    return res.status(500).send({message: 'Error reading file'});
                }else{
                    console.log("File read successfully");
                    console.log("binary data:",data);
                }
            })

            freejoa.images.push(req.body.images);
            freejoa.updatedBy = userId;   //set the updatedBy to the current user
            await freejoa.save();
            console.log("Images uploaded successfully", freejoa);
            console.log("------------------------------------------");
            res.status(201).send({message: 'Images uploaded successfully', freejoa: freejoa});
        } catch (error) {
            console.log("Error uploading images", error);
            res.status(500).send({message: 'Error uploading images'});
        }
    },

};

module.exports = freejoaController;