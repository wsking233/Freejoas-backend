const freejoasModel = require('../models/freejoasModel');

const freejoasController = {

    //create a new freejoa
    createFreejoa: async (req, res) => {
        try {
            const freejoa = new freejoasModel(req.body);
            await freejoa.save();
            res.status(201).send(freejoa);
        } catch (error) {
            res.status(400).send(error);
        }
    },
    //get all freejoas
    getAllFreejoas: async (req, res) => {
        try {
            const freejoas = await freejoasModel.find({});
            res.status(200).send(freejoas);
        } catch (error) {
            res.status(500).send(error);
        }
    },
    //get freejoa by ID
    getFreejoaByID: async (req, res) => {
        try {
            const freejoa = await freejoasModel.findById(req.params.freejoaID);
            if (!freejoa) {
                return res.status(404).send('Freejoa not found');
            }
            res.status(200).send(freejoa);
        } catch (error) {
            res.status(500).send(error);
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
                return res.status(404).send('Freejoa not found');
            }
            res.status(200).send(freejoa);
        } catch (error) {
            res.status(500).send(error);
        }
    },
    //delete a freejoa with a specific ID
    deleteFreejoa: async (req, res) => {
        try {
            const freejoa = await freejoasModel.findByIdAndDelete(req.params.freejoaID);
            if (!freejoa) {
                return res.status(404).send('Freejoa not found');
            }
            res.status(200).send(freejoa);
        } catch (error) {
            res.status(500).send(error);
        }
    }

};

module.exports = freejoasController;