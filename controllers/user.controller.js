const User = require('../models/user.model');



// Get current user profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password -transactionPin -resetPasswordOTP -resetPasswordExpires');
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Optionally format KYC for response (if null/empty, show as pending/incomplete)
    const profile = {
      ...user.toObject(),
      kycStatus: user.kycStatus || 'pending', // Ensure shown if default
      kycDetails: user.kycDetails || { idType: null, idNumber: null } // Null until updated
    };

    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Profile & KYC
const updateProfile = async (req, res) => {
    try {
        const {first_name, last_name, address, idType, idNumber } = req.body;

        const updatedData = {
            first_name,
            last_name,
            address,
            'kycDetails.idType': idType,
            'kycDetails.idNumber': idNumber,
        };

        // If ID details are provided, we could set status to 'verified' 
        // (In a real app, this would be 'pending' until an admin checks it)
        if (idType && idNumber) {
            updatedData.kycStatus = 'pending';
        }

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { $set: updatedData },
            { new: true, runValidators: true }
        ).select('-password');

        res.status(200).json({ message: "Profile updated successfully", user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateFcmToken = async (req, res) => {
  try {
    const { fcmToken } = req.body;
    await User.findByIdAndUpdate(req.user._id, { fcmToken });
    res.status(200).json({ message: 'FCM token updated' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProfile, updateProfile, updateFcmToken };