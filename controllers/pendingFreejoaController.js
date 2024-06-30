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
    transferData: async (req, res) => {
        const { sourceModelName, destinationModelName, ids } = req.body;
        const session = await mongoose.startSession();
        session.startTransaction();
    
        try {
            // Check if required parameters are provided
            if (!sourceModelName || !destinationModelName || !ids || !Array.isArray(ids) || ids.length === 0) {
                throw new Error('Invalid request parameters');
            }
    
            // Dynamically fetch models based on model names
            const SourceModel = mongoose.model(sourceModelName);
            const DestinationModel = mongoose.model(destinationModelName);
    
            // Find documents in the source model by ids
            const documents = await SourceModel.find({ _id: { $in: ids } }).session(session);
    
            // Check if all documents were found
            if (documents.length !== ids.length) {
                await session.abortTransaction();
                session.endSession();
                const foundIds = documents.map(doc => doc._id.toString());
                const notFoundIds = ids.filter(id => !foundIds.includes(id));
                console.log(`Documents not found in ${sourceModelName}: ${notFoundIds.join(', ')}`);
                return res.status(404).json({ message: `Documents not found in ${sourceModelName}: ${notFoundIds.join(', ')}` });
            }
    
            // Insert documents into destination model
            const insertedDocuments = await DestinationModel.insertMany(documents, { session });
    
            // Check if all documents were successfully inserted
            if (insertedDocuments.length === documents.length) {
                // Delete documents from source model
                await SourceModel.deleteMany({ _id: { $in: ids } }).session(session);
                await session.commitTransaction();
                session.endSession();
                console.log(`Data transferred successfully from ${sourceModelName} to ${destinationModelName}`);
                return res.status(200).json({ message: `Data transferred successfully from ${sourceModelName} to ${destinationModelName}` });
            } else {
                await session.abortTransaction();
                session.endSession();
                console.log(`Error transferring data from ${sourceModelName} to ${destinationModelName}`);
                return res.status(500).json({ message: `Error transferring data from ${sourceModelName} to ${destinationModelName}` });
            }
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            console.error(`Error transferring data: ${error.message}`);
            return res.status(500).json({ message: `Error transferring data: ${error.message}` });
        }
    }
    
};

module.exports = pendingFreejoaController;