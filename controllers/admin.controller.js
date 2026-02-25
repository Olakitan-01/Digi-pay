const User = require('../models/user.model');
const Account = require('../models/account.model');
const Transaction = require('../models/transaction.model');

// 1. Freeze/Unfreeze Account
const freezeAccount = async (req, res) => {
  try {
    const { accountNumber, action } = req.body; // action: 'freeze' or 'unfreeze'
    const status = action === 'freeze' ? 'frozen' : 'active';

    const account = await Account.findOneAndUpdate(
      { accountNumber },
      { status },
      { new: true }
    );

    if (!account) return res.status(404).json({ message: 'Account not found' });

    res.status(200).json({ message: `Account ${action}d successfully`, account });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. Approve/Reject KYC
const manageKyc = async (req, res) => {
  try {
    const { userId, status } = req.body; // status: 'verified' or 'rejected'

    const user = await User.findByIdAndUpdate(
      userId,
      { kycStatus: status },
      { new: true }
    ).select('-password');

    if (!user) return res.status(404).json({ message: 'User not found' });

    // Optional: Notify user via queue
    const notificationQueue = require('../utils/notificationQueue.util');
    notificationQueue.add({
      type: 'kyc_update',
      userId,
      details: { status }
      // Add FCM/email logic in processor
    });

    res.status(200).json({ message: `KYC ${status}`, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. View All Transactions (with pagination and filters)
const getAllTransactions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Optional filters: e.g., ?type=transfer&status=success
    const query = {};
    if (req.query.type) query.type = req.query.type;
    if (req.query.status) query.status = req.query.status;
    if (req.query.fromDate) query.createdAt = { $gte: new Date(req.query.fromDate) };
    if (req.query.toDate) query.createdAt = { ...query.createdAt, $lte: new Date(req.query.toDate) };

    const transactions = await Transaction.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('senderId', 'first_name last_name phone')
      .populate('receiverId', 'first_name last_name phone');

    const total = await Transaction.countDocuments(query);

    res.status(200).json({
      success: true,
      pagination: { total, page, limit, pages: Math.ceil(total / limit) },
      data: transactions
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Bonus: View All Users (for KYC review)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password -transactionPin');
    res.status(200).json({ data: users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { freezeAccount, manageKyc, getAllTransactions, getAllUsers };