
const Transaction = require("../../models/transactionSchema");
const User = require("../../models/userSchema");




const getTransactions = async (req, res) => {
  try {
    const userId = req.user.id;
    const transactions = await Transaction.find({ user: userId }).sort({
      createdAt: -1,
    });

    const user=await User.findById(userId)

    res.status(200).json({ transactions,user });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: error.message });
  }
};


module.exports = {
  getTransactions,
};

