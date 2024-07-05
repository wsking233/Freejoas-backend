const { mongoose } = require('../../server/db');
const freejoaModel = require('../../models/freejoaModel');
const userModel = require('../../models/userModel');
const pendingFreejoaModel = require('../../models/pendingFreejoaModel');

/**
 * Controller for handling freejoa-related operations.
 * @namespace freejoaController
 * @version 2
 */

const freejoaController = {

    /**
 * Upload a new freejoa.
 * @async
 * @function uploadFreejoa
 * @memberof freejoaController
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves when the freejoa is uploaded.
 */

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
            const freejoa = new pendingFreejoaModel({   // upload the freejoa to the pendingFreejoa collection
                ...req.body,
                uploader: userId,   //add the uploader ID
                updatedBy: userId  //add the updatedBy ID
            });
            await freejoa.save();

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


    /**
     * Get all freejoas or find freejoa by IDs.
     * @async
     * @function getFreejoasByIdOrAll
     * @memberof freejoaController
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @returns {Promise<void>} A Promise that resolves with the freejoas.
     */
    getFreejoasByIdOrAll: async (req, res) => {
        const userId = req.decodedToken._id;
        console.log("getFreejoasByIdOrAll called with userID:", userId);
        try {
            let freejoas;   // store the freejoas found
            let notFundFreejoaIds = []; // store the IDs of the freejoas that are not found

            // check if there is an freejoaIds query
            if (req.query.freejoaIds) {
                let freejoaIds = req.query.freejoaIds;
                // check if freejoaIds is an array
                if (!Array.isArray(freejoaIds)) {
                    // split the string into an array of IDs
                    freejoaIds = freejoaIds.split(',');
                }

                // find freejoas by IDs
                const foundFreejoas = await freejoaModel.find({ _id: { $in: freejoaIds } });

                // check if no freejoas are found
                if (foundFreejoas.length === 0) {
                    return res.status(404).send({ message: 'No freejoas found with the provided freejoa IDs' });
                }

                // check if all freejoas are found
                if (foundFreejoas.length !== freejoaIds.length) {
                    // get the IDs of the freejoas that are not found
                    notFundFreejoaIds = freejoaIds.filter(id => !foundFreejoas.map(freejoa => freejoa._id.toString()).includes(id));
                }

                freejoas = foundFreejoas;
            } else {
                // if there is no freejoaIds query, get all freejoas
                freejoas = await freejoaModel.find({});
            }

            // if notFundFreejoaIds is not empty, return 200 with a message
            if (notFundFreejoaIds.length > 0) {
                console.log('some freejoas not found:', notFundFreejoaIds);
                console.log("------------------------------------------");
                res.status(200).json({
                    message: `Some freejoas not found: ${notFundFreejoaIds.join(', ')}`,
                    data: freejoas
                });
            } else {
                console.log("All freejoas returned successfully");
                console.log("------------------------------------------");
                res.status(200).send({ message: 'All freejoas returned successfully', data: freejoas });
            }

        } catch (error) {
            console.log("Error getting freejoas", error);
            res.status(500).send({ message: error.message });
        }
    },


    /**
    * delete a freejoa with a specific ID.
    * @async
    * @function deleteFreejoa
    * @memberof freejoaController
    * @param {Object} req - The request object.
    * @param {Object} res - The response object.
    * @returns {Promise<void>} A Promise that resolves when the freejoa is deleted.
    */

    deleteFreejoa: async (req, res) => {
        const adminId = req.decodedToken._id;
        const { freejoaIds } = req.query; //get the freejoaId from the request body
        console.log('deleteFreejoa called with userID:', adminId);

        //check if the freejoaIds is in the request body
        if (!freejoaIds) {
            console.log('Please provide freejoa IDs to delete');
            console.log("------------------------------------------")
            return res.status(400).send({ message: 'Please provide freejoa IDs to delete' });
        }

        // split the string into an array of IDs
        const freejoaIdsArray = freejoaIds.split(',');


        try {
            let notFoundFreejoaIds = []; // to store IDs of freejoas not found
            // find freejoas by IDs
            const freejoas = await freejoaModel.find({ _id: { $in: freejoaIdsArray } });

            // check if no freejoas found
            if (!freejoas || freejoas.length === 0) {
                console.log('No freejoas found with the provided IDs');
                console.log("------------------------------------------")
                return res.status(404).send({ message: 'No freejoas found with the provided IDs' });
            }

            // check if all freejoas are found
            if (freejoas.length !== freejoaIdsArray.length) {
                // get the IDs of freejoas not found
                const foundFreejoaIds = freejoas.map(freejoa => freejoa._id.toString());
                notFoundFreejoaIds = freejoaIdsArray.filter(id => !foundFreejoaIds.includes(id));
            }

            // delete freejoas
            await freejoaModel.deleteMany({ _id: { $in: foundFreejoaIds } });

            // if notFoundFreejoaIds is not empty, return 200 with a message
            if (notFoundFreejoaIds.length > 0) {
                console.log('some freejoas not found:', notFoundFreejoaIds);
                console.log("------------------------------------------")
                res.status(200).json({
                    message: `Freejoas deleted successfully, but some freejoas not found: ${notFoundFreejoaIds.join(', ')}`,
                });
            } else {
                console.log('Freejoas deleted successfully');
                console.log("------------------------------------------")
                res.status(200).json({
                    message: 'Freejoas deleted successfully',
                });
            }
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    },


    // get all pending freejoas
    getAllPendingFreejoas: async (req, res) => {
        const userId = req.decodedToken._id;
        const { freejoaIds } = req.query;
        console.log("getAllPendingFreejoas called with userID:", userId);

        let freejoaIdsArray = [];
        if (freejoaIds) {
            // split the string into an array of IDs
            freejoaIdsArray = freejoaIds.split(',');
        }

        try {
            let freejoas;   // to store the freejoas found
            let notFoundFreejoaIds = []; // to store IDs of freejoas not found

            if (freejoaIdsArray.length > 0) {
                // find freejoas by IDs
                freejoas = await pendingFreejoaModel.find({ _id: { $in: freejoaIdsArray } });
                // check if no freejoas found
                if (!freejoas || freejoas.length === 0) {
                    console.log('No pending freejoas found with the provided IDs');
                    console.log("------------------------------------------");
                    return res.status(404).send({ message: 'No pending freejoas found with the provided IDs' });
                }
                // check if all freejoas are found
                if (freejoas.length !== freejoaIdsArray.length) {
                    // get the IDs of freejoas not found
                    const foundFreejoaIds = freejoas.map(freejoa => freejoa._id.toString());
                    notFoundFreejoaIds = freejoaIdsArray.filter(id => !foundFreejoaIds.includes(id));
                }
            } else {
                // if there is no freejoaIds query, get all freejoas
                freejoas = await pendingFreejoaModel.find({});
            }

            if (freejoas.length === 0) {
                return res.status(200).send({ message: 'database is currently empty' });
            }

            // if notFoundFreejoaIds is not empty, return 200 with a message
            if (notFoundFreejoaIds.length > 0) {
                console.log('some pending freejoas not found:', notFoundFreejoaIds);
                res.status(200).json({
                    message: `Some pending freejoas not found: ${notFoundFreejoaIds.join(', ')}`,
                    data: freejoas
                });
            } else {
                console.log("All pending freejoas returned successfully");
                res.status(200).send({ message: 'All pending freejoas returned successfully', data: freejoas });
            }
        } catch (error) {
            console.log("Error getting pending freejoas", error);
            res.status(500).send({ message: error.message });
        }
    },

    // approve pending freejoas
    approvePendingFreejoas: async (req, res) => {
        /**
         * This function approves pending freejoas by creating new freejoas 
         * from the pending freejoas collection to the freejoas collection
         */
        const userId = req.decodedToken._id;
        const { freejoaIds } = req.query;    // receive an array of freejoa IDs
        console.log("approvePendingFreejoas called with userID:", userId);
        const session = await mongoose.startSession();  // start a session to make sure all operations are atomic
        session.startTransaction();
        try {
            let notFoundFreejoaIds = []; // to store IDs of freejoas not found
            if (!freejoaIds) {
                console.log("Please provide freejoa IDs to approve");
                console.log("------------------------------------------");
                await session.abortTransaction();
                session.endSession();
                return res.status(400).send({ message: 'Please provide freejoa IDs to approve' });
            }

            //split the string into an array of IDs
            const freejoaIdsArray = freejoaIds.split(',');

            // find all pending freejoas with the IDs
            const pendingFreejoas = await pendingFreejoaModel.find({ _id: { $in: freejoaIdsArray } }).session(session);
            console.log(pendingFreejoas.length + " pending freejoas found");

            // no pending freejoas found
            if (pendingFreejoas.length === 0) {
                console.log("No Pending Freejoas found, request IDs: ", freejoaIdsArray);
                console.log("------------------------------------------");
                await session.abortTransaction();
                session.endSession();
                return res.status(404).send({ message: 'No Pending Freejoas found' });
            }

            // check if all pending freejoas are found
            if (pendingFreejoas.length !== freejoaIdsArray.length) {
                // get the IDs of the freejoas that are not found
                notFoundFreejoaIds = freejoaIdsArray.filter(id => !pendingFreejoas.map(freejoa => freejoa._id.toString()).includes(id));
                console.log("Some pending freejoas not found: ", notFoundFreejoaIds);
            }


            // save the new freejoas
            const savedFreejoas = await freejoaModel.insertMany(pendingFreejoas, { session });

            // check if all pending freejoas were saved as new freejoas
            if (savedFreejoas.length === pendingFreejoas.length) {
                // delete the pending freejoas
                const foundFreejoaIds = pendingFreejoas.map(freejoa => freejoa._id.toString());
                await pendingFreejoaModel.deleteMany({ _id: { $in: foundFreejoaIds } }).session(session);
                // commit the transaction
                await session.commitTransaction();

                // if there are freejoas not found, return 200 with a message
                if (notFoundFreejoaIds.length > 0) {
                    console.log("Some pending freejoas not found: ", notFoundFreejoaIds);
                    console.log("------------------------------------------");
                    return res.status(200).send({ message: `Pending Freejoas approved successfully, but some pending freejoas not found: ${notFoundFreejoaIds.join(', ')}` });
                } else {
                    console.log("Pending Freejoas approved successfully");
                    console.log("------------------------------------------");
                    return res.status(200).send({ message: 'Pending Freejoas approved successfully' });
                }
            } else {
                await session.abortTransaction();
                console.log("Error approving some pending freejoas");
                console.log("------------------------------------------");
                return res.status(500).send({ message: 'Error approving some pending freejoas' });
            }
        } catch (error) {
            await session.abortTransaction();
            console.log("Error approving pending freejoas", error);
            console.log("------------------------------------------");
            return res.status(500).send({ message: error.message });
        } finally {
            // end the session
            session.endSession();
        }
    },

    // reject pending freejoas
    rejectPendingFreejoas: async (req, res) => {
        const userId = req.decodedToken._id;
        const { freejoaIds } = req.query;    // receive an array of freejoa IDs
        console.log("rejectPendingFreejoas called with userID:", userId);
        const session = await mongoose.startSession();  // start a session to make sure all operations are atomic
        session.startTransaction();
        try {
            let notFoundFreejoaIds = []; // to store IDs of freejoas not found
            if (!freejoaIds) {
                console.log("Please provide freejoa IDs to approve");
                console.log("------------------------------------------");
                await session.abortTransaction();
                session.endSession();
                return res.status(400).send({ message: 'Please provide freejoa IDs to approve' });
            }

            //split the string into an array of IDs
            const freejoaIdsArray = freejoaIds.split(',');

            // find all pending freejoas with the IDs
            const pendingFreejoas = await pendingFreejoaModel.find({ _id: { $in: freejoaIdsArray } }).session(session);
            console.log(pendingFreejoas.length + " pending freejoas found");

            // no pending freejoas found
            if (pendingFreejoas.length === 0) {
                console.log("No Pending Freejoas found, request IDs: ", freejoaIds);
                console.log("------------------------------------------");
                await session.abortTransaction();
                session.endSession();
                return res.status(404).send({ message: 'No Pending Freejoas found' });
            }

            // check if all pending freejoas are found
            if (pendingFreejoas.length !== freejoaIdsArray.length) {
                // get the IDs of the freejoas that are not found
                notFoundFreejoaIds = freejoaIdsArray.filter(id => !pendingFreejoas.map(freejoa => freejoa._id.toString()).includes(id));
                console.log("Some pending freejoas not found: ", notFoundFreejoaIds);
            }

            // get all the found freejoa IDs
            const foundFreejoaIds = pendingFreejoas.map(freejoa => freejoa._id.toString());
            // delete the pending freejoas
            await pendingFreejoaModel.deleteMany({ _id: { $in: foundFreejoaIds } }).session(session);

            if (notFoundFreejoaIds.length > 0) {
                console.log("Some pending freejoas not found: ", notFoundFreejoaIds);
                console.log("------------------------------------------");
                await session.commitTransaction();
                return res.status(200).send({ message: `Pending Freejoas rejected successfully, but some pending freejoas not found: ${notFoundFreejoaIds.join(', ')}` });
            }

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


};


module.exports = freejoaController;