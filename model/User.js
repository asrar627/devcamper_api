const crypto = require('crypto');
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs'); // we are using bcryptjs because we want to avoid from whole bcrypt dependencies issues and just include its js
const jwt = require('jsonwebtoken');
const UserSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, 'please add a name']
    },
    email: {
        type: String,
        required: [true, 'please add an email'],
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Plese use a valid email address.']
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

// Encrypt password using bcrypt
UserSchema.pre('save', async function(next){
    if (!this.isModified('password')){
        next();
    }
    const salt = await bcrypt.genSalt(10); // we can increase 10 to 111, 12 or more to make password salt strong but 10 is recommendable according to documentation // and its return promise
    this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function() {
    return jwt.sign({id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

// Match user password with encrypted password
UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Generate and Hash Password Token
UserSchema.methods.getResetPasswordToken = function() {
    // Generate Token
    const resetToken = crypto.randomBytes(20).toString('hex');
    // Hash Token and set to resetPasswordToken field
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    // Set Expire
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000 // 10 minutes like in reverse 1 sec * 1 min * 10

    return resetToken;
}


module.exports = mongoose.model('User', UserSchema);