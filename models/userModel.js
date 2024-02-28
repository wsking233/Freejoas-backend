const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    googleSub: String,
    username: String,
    email: String,
    freejoas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'freejoas' }],
},{
    timestamps: true
});

module.exports = mongoose.model('user', userSchema);