const freejoasModel = require('../models/freejoasModel');

const freejoasController = {

    //create a new freejoa
    createFreejoa: async (req, res) => {
        console.log("createFreejoa called");
        try {
            const freejoa = new freejoasModel(req.body);
            await freejoa.save();
            res.status(201).send({message: 'New freejoa created successfully', freejoa: freejoa});
        } catch (error) {
            console.log("Error creating freejoa", error);
            res.status(500).send({message: 'Error creating freejoa', error: error});
        }
    },
    //get all freejoas
    getAllFreejoas: async (req, res) => {
        try {
            const freejoas = await freejoasModel.find({});
            res.status(200).send(freejoas);
        } catch (error) {
            console.log("Error getting freejoas", error);
            res.status(500).send({message: 'Error getting freejoas', error: error});
        }
    },
    //get freejoa by ID
    getFreejoaByID: async (req, res) => {
        try {
            const freejoa = await freejoasModel.findById(req.params.freejoaID);
            if (!freejoa) {
                console.log("Freejoa not found, request ID: ", req.params.freejoaID);
                return res.status(404).send({message:'Freejoa not found'});
            }
            res.status(200).send(freejoa);
        } catch (error) {
            res.status(500).send({message: 'Error getting freejoas', error: error});
        }
    },
    //update a freejoa with a specific ID
    updateFreejoa: async (req, res) => {
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
        try {
            const freejoa = await freejoasModel.findByIdAndDelete(req.params.freejoaID);
            if (!freejoa) {
                console.log("Freejoa not found, request ID: ", req.params.freejoaID);
                return res.status(404).send({message:'Freejoa not found'});
            }
            res.status(200).send(freejoa);
        } catch (error) {
            console.log("Error deleting freejoa", error);
            res.status(500).send({message: 'Error deleting freejoa', error: error});
        }
    }

};

module.exports = freejoasController;