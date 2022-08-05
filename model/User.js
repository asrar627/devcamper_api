const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, 'please add a name']
    },
    email: {
        type: String,
        required: [true, 'please add an email'],
        unique: true
        //match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Plese use a valid email address.']
    },
    role: {
        type: String,
        enum: ["user", "publisher"],
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'please add an password'],
        minlength: 6,
        select: false // its does not return or show password in the field
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('User', UserSchema);