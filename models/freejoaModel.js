const mongoose = require('mongoose');

const freejoaSchema = new mongoose.Schema({
    latitude: String,
    longitude: String,
    title: String,
    isActive: { type: Boolean, default: true },
    status: {
        type: String,
        enum: ['low', 'mid', 'high'],
        default: 'mid'
    },
    image:[{
        //auto generate the id
        _id: { type: mongoose.Schema.Types.ObjectId, auto: true, required: true },
        data: String,
        contentType: String,
        filename: String,
    }],
    amount: Number,
    description: String,
    uploader: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'user' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
}, {
    timestamps: true
});


module.exports = mongoose.model('freejoa', freejoaSchema);