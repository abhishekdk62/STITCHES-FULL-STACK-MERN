const User = require("../../models/userSchema");
const Category = require("../../models/categorySchema");
const Coupon = require("../../models/couponSchema");
const ReturnRequest = require("../../models/returnRequestSchema");
const Orders = require("../../models/orderSchema");
const Transaction = require("../../models/transactionSchema");
const Product = require("../../models/productSchema");
const { default: mongoose } = require("mongoose");

const getOrders = async (req, res) => {
  try {
    const search = req.query.search || "";
    const page = parseInt(req.query.page, 10) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;

    const pipeline = [];

    pipeline.push({
      $lookup: {
        from: "products", // Ensure this matches your actual collection name
        localField: "items.product",
        foreignField: "_id",
        as: "productDetails",
      },
    });

    // Stage 2: If search term provided, filter orders based on product name
    if (search) {
      pipeline.push({
        $match: {
          "productDetails.name": { $regex: search, $options: "i" },
        },
      });
    }

    // Stage 3: For each order, merge the joined product details into each item
    pipeline.push({
      $addFields: {
        items: {
          $map: {
            input: "$items",
            as: "item",
            in: {
              $mergeObjects: [
                "$$item",
                {
                  product: {
                    $arrayElemAt: [
                      {
                        $filter: {
                          input: "$productDetails",
                          as: "pd",
                          cond: { $eq: ["$$pd._id", "$$item.product"] },
                        },
                      },
                      0,
                    ],
                  },
                },
              ],
            },
          },
        },
      },
    });

    // Stage 4: Remove the extra field from the lookup
    pipeline.push({
      $project: { productDetails: 0 },
    });

    // Count total matching orders (for pagination info)
    const countPipeline = [...pipeline, { $count: "total" }];
    const countResult = await Orders.aggregate(countPipeline);
    const totalOrders = countResult[0] ? countResult[0].total : 0;
    const totalPages = Math.ceil(totalOrders / limit);

    // Stage 5: Add pagination stages
    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: limit });

    // Execute the pipeline
    let orders = await Orders.aggregate(pipeline);

    orders = await Orders.populate(orders, {
      path: "user",
      select: "name email", 
    });


    res.status(200).json({ data: orders, totalPages });
  } catch (error) {    
    res.status(500).json(error);
  }
};

const prodEdit = async (req, res) => {
  try {
    const { orderID, product, variant, status } = req.body;

    const order = await Orders.findById(orderID);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const orderItem = order.items.find((i) => {
      return (
        i.product.toString() === product && i.variant.toString() === variant
      );
    });

    if (!orderItem) {
      return res.status(404).json({ message: "Order item not found" });
    }

    orderItem.status = status;

    await order.save();

    res.status(200).json({ message: "Order item updated", order });
  } catch (error) {
    console.error("Error updating order item:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

module.exports = { getOrders, prodEdit };
