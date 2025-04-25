const Orders = require("../../models/orderSchema");
const Products = require("../../models/productSchema");
const Category = require("../../models/categorySchema");

const getSalesReport = async (req, res) => {
  try {
    const { r, s, e } = req.query; // r = range, s = startDate, e = endDate
    const orders = await Orders.find({});
    const deliveredItems = [];
    const now = new Date();
    const start = s ? new Date(s) : null;
    const end = e ? new Date(e) : null;
    function isSameWeek(d1, d2) {
      const startOfWeek = new Date(d2);
      startOfWeek.setDate(d2.getDate() - d2.getDay());
      startOfWeek.setHours(0, 0, 0, 0);

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);

      return d1 >= startOfWeek && d1 <= endOfWeek;
    }
    function isSameDay(d1, d2) {
      return (
        d1.getDate() === d2.getDate() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getFullYear() === d2.getFullYear()
      );
    }

    function isSameMonth(d1, d2) {
      return (
        d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear()
      );
    }

    function isSameYear(d1, d2) {
      return d1.getFullYear() === d2.getFullYear();
    }

    orders.forEach((order) => {
      order.items
        .filter((item) => item.status === "Delivered")
        .forEach((item) => {
          const createdAt = new Date(order.createdAt);
          let include = false;
          if (r === "daily") include = isSameDay(createdAt, now);
          else if (r === "weekly") include = isSameWeek(createdAt, now);
          else if (r === "monthly") include = isSameMonth(createdAt, now);
          else if (r === "yearly") include = isSameYear(createdAt, now);
          else if (r === "custom" && start && end) {
            include = createdAt >= start && createdAt <= end;
          }

          if (include) {
            deliveredItems.push({
              orderID: order.orderID,
              quantity: item.quantity,
              coupon: order.coupon,
              price: item.price,
              discount: item.discount || 0,
              createdAt: order.createdAt,
              shippingPrice: order.shippingPrice,
              paymentMethod: order.paymentMethod,
            });
          }
        });
    });

    const orderCount = deliveredItems.length;
    const orderAmount = deliveredItems.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0
    );
    const totalDiscount = deliveredItems.reduce(
      (sum, i) => sum + i.discount,
      0
    );
    const couponCodes = [
      ...new Set(deliveredItems.map((i) => i.coupon).filter(Boolean)),
    ];

    let totQuantity = 0;
    let totPrice = 0;
    let totDiscount = 0;
    let o = await Orders.find({});
    let filteredOrders = [];

    o.forEach((order) => {
      const delivered = order.items.filter(
        (item) => item.status === "Delivered"
      );
      filteredOrders.push(...delivered);
    });

    const ord = await Orders.find({ "items.status": "Delivered" });

    ord.forEach((o) => {
      totDiscount += o.discount;
    });

    filteredOrders.forEach((o) => {
      totQuantity += o.quantity;
      totPrice += o.price * o.quantity;
    });

    res.status(200).json({
      range: r,
      deliveredItemCount: orderCount,
      orderAmount,
      totalDiscount,
      couponCodes,
      deliveredItems,
      totQuantity,
      totPrice,
      totDiscount,
    });
  } catch (error) {
    console.error("Sales Report Error:", error);
    res.status(500).json({ message: "Error generating sales report", error });
  }
};

const getTopSellers = async (req, res) => {
  try {
    // 🔥 1 DB call, but we populate each item’s product (only the 'name', 'brand', and 'category' fields)
    const orders = await Orders.find({ /* your filter */ })
      .populate({
        path: 'items.product',
        select: 'name brand category'
      });

    let topBrands   = {};
    let topCategory = {};
    let topProduct  = {};

    // 1️⃣ Gather unique category IDs from delivered items that actually have a product & category
    const categoryIds = new Set();
    orders.forEach(o =>
      o.items.forEach(i => {
        if (
          i.status === 'Delivered' &&
          i.product &&
          i.product.category
        ) {
          categoryIds.add(i.product.category.toString());
        }
      })
    );

    // Populate category names in one go
    const categories = await Category.find({
      _id: { $in: Array.from(categoryIds) }
    }).select('name');
    const categoryMap = categories.reduce((map, c) => {
      map[c._id.toString()] = c.name;
      return map;
    }, {});

    // 2️⃣ Tally up brands, categories, and product counts for delivered items
    orders.forEach(o =>
      o.items.forEach(i => {
        if (
          i.status !== 'Delivered' ||
          !i.product ||
          !i.product.category
        ) return;

        const prod = i.product;

        // Brand
        if (prod.brand) {
          topBrands[prod.brand] = (topBrands[prod.brand] || 0) + i.quantity;
        }

        // Category (fall back to “Unknown” if name missing)
        const catName = categoryMap[prod.category.toString()] || 'Unknown';
        topCategory[catName] = (topCategory[catName] || 0) + i.quantity;

        // Product
        if (prod.name) {
          topProduct[prod.name] = (topProduct[prod.name] || 0) + i.quantity;
        }
      })
    );

    return res.json({ topBrands, topCategory, topProduct });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: 'Server error',
      error: err.message
    });
  }
};




module.exports = { getSalesReport,getTopSellers };
