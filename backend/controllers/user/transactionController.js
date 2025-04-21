
const Transaction = require("../../models/transactionSchema");




const getTransactions = async (req, res) => {
  try {
    const userId = req.user.id;
    const transactions = await Transaction.find({ user: userId }).sort({
      createdAt: -1,
    });

    res.status(200).json({ transactions });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: error.message });
  }
};


module.exports = {
  getTransactions,
};

