const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TransactionSchema = new Schema({
  user: { 
    type: Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  order: { 
    type: Schema.Types.ObjectId, 
    ref: "Order", 
    required: false 
  },
  transactionType: {
    type: String,
    enum: ["Cancellation", "Return","Credited","Debited"], 
    required: true
  }
  ,
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: "Rs"
  },
  details: {
    type: String,
    default: ""
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Transaction", TransactionSchema);
