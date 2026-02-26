const User = require('../models/user.model');



// Get current user profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password -transactionPin -resetPasswordOTP -resetPasswordExpires -createdAt -updatedAt');
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
// Update Profile & KYC
const updateProfile = async (req, res) => {
  try {
    const { first_name, last_name, username, address, idType, idNumber } = req.body;

    // Basic validation
    // if (!first_name || !last_name) {
    //   return res.status(400).json({ message: 'First and last name are required' });
    // }

    const updatedData = {
      first_name,
      last_name,
      username,
      address
    };

    // Handle KYC if provided (starts as pending/null in model)
    let kycChanged = false;
    if (idType && idNumber) {
      updatedData.kycDetails = { idType, idNumber };
      updatedData.kycStatus = 'pending'; // Set to 'pending' until admin verifies; or 'verified' for prototype
      kycChanged = true;
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updatedData },
      { new: true, runValidators: true }
    ).select('-password -transactionPin -resetPasswordOTP -resetPasswordExpires -createdAt -updatedAt');

    if (!user) return res.status(404).json({ message: 'User not found' });

    // Optional: Queue notification if KYC updated
    if (kycChanged) {
      notificationQueue.add({
        type: 'kyc_update',
        userId: user._id,
        details: { status: user.kycStatus },
        fcmToken: user.fcmToken
      });
    }

    res.status(200).json({ success: true, message: 'Profile updated successfully', data: user });
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