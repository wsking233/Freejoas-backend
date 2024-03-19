const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    avatar: String,
    username: String,
    firstname: String,
    lastname: String,
    email: {type:String, required: true, unique: true},
    password: {type:String, required: true},
    googleSub: String,
    accountType: {type:String, required: true, default:"user"}, // 'admin' or 'user
    uploads: [{ type: mongoose.Schema.Types.ObjectId, ref: 'freejoas' }],
},{
    timestamps: true
});

module.exports = mongoose.model('user', userSchema);