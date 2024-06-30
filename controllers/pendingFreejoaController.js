const pendingFreejoaModel = require('../models/pendingFreejoaModel');
const freejoaModel = require('../models/freejoaModel');
const {mongoose} = require('../server/db');

const pendingFreejoaController = {

    // get all pending freejoas
    getAllUploadRequest: async (req, res) => {
        const userId = req.decodedToken._id;
        console.log("getAllPendingFreejoas called with userID:", userId);
        try {
            const freejoas = await pendingFreejoaModel.find({});
            if (freejoas.length === 0) {
                return res.status(200).send({ message: 'database is currently empty' });
            }
            console.log("All pending freejoas returned successfully");
            console.log("------------------------------------------");
            res.status(200).send({message: 'All pending freejoas returned successfully', data: freejoas});
        } catch (error) {
            console.log("Error getting pending freejoas", error);
            res.status(500).send({ message: error.message });
        }
    },

    removeImage:(object)=>{
        //remove image key from a object
        delete object.image;
        return object;
    },

    // approve pending freejoas
    approvePendingFreejoas: async (req, res) => {
        /**
         * This function approves pending freejoas by creating new freejoas 
         * from the pending freejoas collection to the freejoas collection
         */
        const userId = req.decodedToken._id;
        const { freejoaIds } = req.body;    // receive an array of freejoa IDs
        console.log("approvePendingFreejoas called with userID:", userId);
        const session = await mongoose.startSession();  // start a session to make sure all operations are atomic
        session.startTransaction(); 
        try {
            // find all pending freejoas with the IDs
            const pendingFreejoas = await pendingFreejoaModel.find({ _id: { $in: freejoaIds } }).session(session);  
            console.log("Pending Freejoas found: ", pendingFreejoas);

            // no pending freejoas found
            if (pendingFreejoas.length === 0) {
                console.log("No Pending Freejoas found, request IDs: ", freejoaIds);
                await session.abortTransaction();
                session.endSession();
                return res.status(404).send({ message: 'No Pending Freejoas found' });
            }
            
            // save the new freejoas
            const savedFreejoas = await freejoaModel.insertMany(pendingFreejoas, { session });
            
            // check if all pending freejoas were saved as new freejoas
            if (savedFreejoas.length === pendingFreejoas.length) {
                // delete the pending freejoas
                await pendingFreejoaModel.deleteMany({ _id: { $in: freejoaIds } }).session(session);    
                // commit the transaction
                await session.commitTransaction();  
                console.log("Pending Freejoas approved successfully");
                res.status(200).send({ message: 'Pending Freejoas approved successfully'});
                console.log("------------------------------------------");
            } else {
                await session.abortTransaction();
                console.log("Error approving some pending freejoas");
                res.status(500).send({ message: 'Error approving some pending freejoas' });
                console.log("------------------------------------------");
            }
        } catch (error) {
            await session.abortTransaction();
            console.log("Error approving pending freejoas", error);
            res.status(500).send({ message: error.message });
            console.log("------------------------------------------");
        } finally {
            // end the session
            session.endSession();
        }
    },
    
    // reject pending freejoas
    rejectPendingFreejoas: async (req, res) => {
        const userId = req.decodedToken._id;
        const { freejoaIds } = req.body;   // receive an array of freejoa IDs
        console.log("rejectPendingFreejoas called with userID:", userId);
        const session = await mongoose.startSession();  // start a session to make sure all operations are atomic
        session.startTransaction();
        try {
            // find all pending freejoas with the IDs
            const pendingFreejoas = await pendingFreejoaModel.find({ _id: { $in: freejoaIds } }).session(session);
            
            // no pending freejoas found
            if (pendingFreejoas.length === 0) {
                console.log("No Pending Freejoas found, request IDs: ", freejoaIds);
                await session.abortTransaction();
                session.endSession();
                return res.status(404).send({ message: 'No Pending Freejoas found' });
            }

            // delete the pending freejoas
            await pendingFreejoaModel.deleteMany({ _id: { $in: freejoaIds } }).session(session);
            await session.commitTransaction();
            console.log("Pending Freejoas rejected successfully");
            res.status(200).send({ message: 'Pending Freejoas rejected successfully' });
            console.log("------------------------------------------");
        } catch (error) {
            await session.abortTransaction();
            console.log("Error rejecting pending freejoas", error);
            res.status(500).send({ message: error.message });
        } finally {
            // end the session
            session.endSession();
        }
    },

    // get all pending updates
    approvePendingUpdate: async (req, res) => {
        /**
         *  function not fully implemented yet
         *  need to consider how to handle image updates
         */

        /**
         *  This function approves pending updates by updating the original document
         *  with the updated data from the pending update collection
         *  and then deleting the pending update
         * 
         */
        const { updateId } = req.body;
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const pendingUpdate = await PendingUpdate.findById(updateId).session(session);
            if (!pendingUpdate) {
                await session.abortTransaction();
                session.endSession();
                return res.status(404).send({ message: 'Pending update not found' });
            }
    
            const { updatedData } = pendingUpdate;
            const originalDoc = await freejoaModel.findById(updateId).session(session);
            if (!originalDoc) {
                await session.abortTransaction();
                session.endSession();
                return res.status(404).send({ message: 'Original document not found' });
            }
    
            Object.keys(updatedData).forEach(key => {
                if (key === 'image') {
                    if (Array.isArray(updatedData[key])) {
                        updatedData[key].forEach(image => originalDoc.image.push(image));
                    } else {
                        originalDoc.image.push(updatedData[key]);
                    }
                } else {
                    originalDoc[key] = updatedData[key];
                }
            });
    
            originalDoc.updatedBy = req.decodedToken._id;
            await originalDoc.save({ session });
            await PendingUpdate.findByIdAndDelete(updateId).session(session);
            await session.commitTransaction();
            res.status(200).send({ message: 'Update approved and applied successfully' });
        } catch (error) {
            await session.abortTransaction();
            console.log("Error approving update", error);
            res.status(500).send({ message: error.message });
        } finally {
            session.endSession();
        }
    },

};

module.exports = pendingFreejoaController;