const mongoose = require('mongoose');

const freejoaSchema = new mongoose.Schema({
    latitude: String,
    longitude: String,
    title: String,
    isActive: {type: Boolean, default: true},
    status: {
        type: String,
        enum: ['low', 'mid', 'high'],
        default: 'mid'
    },
    amount: Number,
    description: String,
    uploader: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'user'},
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
},{
    timestamps: true
});

module.exports = mongoose.model('freejoa', freejoaSchema);