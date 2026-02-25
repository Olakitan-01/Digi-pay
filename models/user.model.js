const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    first_name: { 
        type: String, 
        required: true, 
        trim: true 
    },
    last_name: { 
        type: String, 
        required: true, 
        trim: true 
    },
    username: { 
        type: String, 
        required: true, 
        unique: true, 
        lowercase: true 
    },
    email: { type: String, 
        required: true, 
        unique: true, 
        lowercase: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    phone: { 
        type: String, 
        required: true, 
        unique: true 
    }, // This is the key!
    transactionPin: {
    type: String, // Stored as a hashed string
    default: null
    },
    gender: { 
        type: String, 
        enum: ["male", "female", "other"], 
        required: true 
    },
    role: { 
        type: String, 
        enum: ["user", "admin"], 
        default: "user" 
    },
    isActive: { 
        type: Boolean, 
        default: true 
    },
    hasPin: {
        type: Boolean,
        default: false
    },
    kycStatus: {
        type: String,
        enum: ['pending', 'verified', 'rejected'],
        default: 'pending'
    },
    kycDetails: {
        idType: { type: String }, // e.g., NIN, BVN, Passport
        idNumber: { type: String }
    },
    address: { type: String },
    resetPasswordOTP: String,
    resetPasswordExpires: Date,
}, 
{ timestamps: true });

module.exports = mongoose.model("User", UserSchema);