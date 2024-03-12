const { Mongoose } = require('mongoose');
const freejoasModel = require('../models/freejoasModel');

const freejoasController = {

    //upload a new freejoa
    uploadFreejoa: async (req, res) => {
        console.log("createFreejoa called with loader ID:", req.body.uploader);
        try {
            const uploader = req.body.uploader;
            if(!uploader){ //check if the uploader is present
                console.log("Uploader is required");
                return res.status(400).send({message: 'Uploader is required'});
            }

            //check the uploader is a valid ObjectId
            if(!Mongoose.Types.ObjectId.isValid(uploader)){
                console.log("Invalid User ID");
                return res.status(400).send({message: 'Invalid User ID'});
            }

            //check is the uploader exists in database
            if (!await userModel.findById(uploader)) {
                console.log("User not found");
                return res.status(404).send({message: 'User not found'});
            }

            //create a new freejoa
            const freejoa = new freejoasModel(req.body);
            await freejoa.save();
            console.log("New freejoa created successfully", freejoa);
            res.status(201).send({message: 'New freejoa uploaded successfully', freejoa: freejoa});
        } catch (error) {
            console.log("Error creating freejoa", error);
            res.status(500).send({message: 'Error uploading a freejoa', error: error});
        }
    },
    //get all freejoas
    getAllFreejoas: async (req, res) => {
        console.log("getAllFreejoas called");
        try {
            const freejoas = await freejoasModel.find({});
            console.log("All freejoas returned successfully");
            res.status(200).send(freejoas);
        } catch (error) {
            console.log("Error getting freejoas", error);
            res.status(500).send({message: 'Error getting freejoas', error: error});
        }
    },
    //get freejoa by ID
    getFreejoaByID: async (req, res) => {
        console.log("getFreejoaByID called with id:", req.params.freejoaID);
        try {
            const freejoa = await freejoasModel.findById(req.params.freejoaID);
            if (!freejoa) {
                console.log("Freejoa not found, request ID: ", req.params.freejoaID);
                return res.status(404).send({message:'Freejoa not found'});
            }
            console.log("Freejoa found:",freejoa);
            res.status(200).send(freejoa);
        } catch (error) {
            res.status(500).send({message: 'Error getting freejoas', error: error});
        }
    },
    //update a freejoa with a specific ID
    updateFreejoa: async (req, res) => {
        console.log("updateFreejoa called with id:", req.params.freejoaID);
        try {
            const freejoa = await freejoasModel.findByIdAndUpdate(
                req.params.freejoaID,
                req.body, 
                { new: true, runValidators: true });
            if (!freejoa) {
                console.log("Freejoa not found, request ID: ", req.params.freejoaID);
                return res.status(404).send({message:'Freejoa not found'});
            }
            res.status(200).send(freejoa);
        } catch (error) {
            console.log("Error updating freejoa", error);
            res.status(500).send({message: 'Error updating freejoa', error: error});
        }
    },
    //delete a freejoa with a specific ID
    deleteFreejoa: async (req, res) => {
        console.log("deleteFreejoa called with id:", req.params.freejoaID);
        try {
            const freejoa = await freejoasModel.findByIdAndDelete(req.params.freejoaID);
            if (!freejoa) {
                console.log("Freejoa not found, request ID: ", req.params.freejoaID);
                return res.status(404).send({message:'Freejoa not found'});
            }
            console.log("Freejoa deleted successfully", freejoa);
            res.status(200).send({message: 'Freejoa deleted successfully', freejoa: freejoa});
        } catch (error) {
            console.log("Error deleting freejoa", error);
            res.status(500).send({message: 'Error deleting freejoa', error: error});
        }
    }

};

module.exports = freejoasController;