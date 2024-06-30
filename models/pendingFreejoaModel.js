const mongoose = require('mongoose');

const pendingFreejoaSchema = new mongoose.Schema({
    latitude: String,
    longitude: String,
    title: String,
    isActive: {type: Boolean, default: true},
    status: {
        type: String,
        enum: ['low', 'mid', 'high'],
        default: 'mid'
    },
    image:[{
            //auto generate the id
            _id: {type: mongoose.Schema.Types.ObjectId, auto: true, required: true},    
            data: String,
            contentType: String,
            filename: String,
        }],
    amount: Number,
    description: String,
    uploader: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'user'},
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    // requestType: { 
    //     /**
    //      *  this key is used to determine the type of the pending freejoa
    //      *  is used in the pending collection only
    //      *  should be removed when transfered to the freejoa collection
    //      */
    //     type: String,
    //     enum: ['upload', 'update'],
    //     required: true
    // },
},{
    timestamps: true
});

module.exports = mongoose.model('pending-freejoa', pendingFreejoaSchema);