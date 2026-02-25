const mongoose = require('mongoose');


const TransactionSchema = new mongoose.Schema(
  {
    senderId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
    },
    receiverId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      
    },
    amount: { 
      type: mongoose.Schema.Types.Decimal128, 
      required: true 
    },
    type: { 
      type: String, 
      enum: ['transfer', 'deposit', 'withdrawal', 'reversal'], 
      required: true 
    },
    status: { 
      type: String, 
      enum: ['pending', 'success', 'failed'], 
      default: 'pending' 
    },
    reference: { 
      type: String, 
      unique: true, 
      required: true,
      index: true
      
    }, // e.g., TX-164444000
    bankName: { 
      type: String
      
    },
    description: { type: String },

    reciepientAccountNumber: {type: String}
    
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", TransactionSchema);