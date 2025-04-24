const Transactions = require("../../models/transactionSchema");
const User = require("../../models/userSchema");

const getTransactions = async (req, res) => {
  try {
    // Extract pagination parameters from query
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const searchQuery = req.query.query || "";
    

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Prepare search filter
    let filter = {};
    if (searchQuery) {
      // We'll need to pre-fetch users that match the search query
      const matchingUsers = await User.find({
        $or: [
          { firstname: { $regex: searchQuery, $options: 'i' } },
          { email: { $regex: searchQuery, $options: 'i' } }
        ]
      }).select('_id');
      
      const userIds = matchingUsers.map(user => user._id);
      
      filter = {
        $or: [
          { user: { $in: userIds } }, // Search by user
          { transactionType: { $regex: searchQuery, $options: 'i' } } // Search by transaction type
        ]
      };
    }

    // Count total documents for pagination info
    const totalDocs = await Transactions.countDocuments(filter);
    const totalPages = Math.ceil(totalDocs / limit);

    // Fetch paginated transactions with filter
    const transactions = await Transactions.find(filter)
      .sort({ createdAt: -1 }) // Sort by newest first
      .skip(skip)
      .limit(limit);

    // Process transactions to include user details
    let data = [];
    for (const t of transactions) {
      const user = await User.findById(t.user);
      data.push({
        name: user?.firstname || "N/A",
        email: user?.email || "N/A",
        transactionId: t._id,
        transactionDate: t.createdAt,
        transactionType: t.transactionType,
        amount: t.amount,
        currency: t.currency,
        orderId: t.order || null,
        details: t.details || null,
      });
    }

    // Return paginated result with pagination metadata
    res.status(200).json({
      data,
      pagination: {
        totalDocs,
        limit,
        totalPages,
        page,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong", error });
  }
};

module.exports = { getTransactions };