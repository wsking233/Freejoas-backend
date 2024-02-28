const mongoose = require('mongoose');

const freejoasSchema = new mongoose.Schema({
    latitude: String,
    longitude: String,
    title: String,
    status: Boolean,
    amount: Number,
    description: String,
    uploader: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
},{
    timestamps: true
});

module.exports = mongoose.model('freejoas', freejoasSchema);