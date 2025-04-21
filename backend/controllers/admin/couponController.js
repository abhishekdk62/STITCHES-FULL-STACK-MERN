const Coupon = require("../../models/couponSchema");

const addCoupon = async (req, res) => {
  try {
    const { name, discountType, discountValue, expiryDate, usageLimit } =
      req.body;
    let couponName = name;

    const code = Math.random().toString(36).slice(2, 8).toUpperCase();

    const existingCoupon = await Coupon.findOne({
      $or: [{ code }, { couponName }],
    });

    if (existingCoupon) {
      return res
        .status(400)
        .json({ message: "Coupon code or name already exists" });
    }

    // Create new coupon
    const newCoupon = new Coupon({
      code,
      couponName,
      discountType,
      discountValue,
      expiryDate,
      usageLimit,
    });

    await newCoupon.save();

    res.status(201).json({
      message: "Coupon created successfully",
      coupon: newCoupon,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: error.message });
  }
};

const editCoupon = async (req, res) => {
  try {
    // Assume the coupon ID is provided in req.params.id
    const couponId = req.params.id;
    // The new data is provided in req.body
    const updateData = req.body;

    const updatedCoupon = await Coupon.findByIdAndUpdate(couponId, updateData, {
      new: true,
    });

    if (!updatedCoupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    res.status(200).json({
      message: "Coupon updated successfully",
      coupon: updatedCoupon,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const searchCoupons = async (req, res) => {
  try {
    const searchQuery = req.query.q || "";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const currentDate = new Date();
    const filter = {
      couponName: { $regex: searchQuery, $options: "i" },
      expiryDate: { $gte: currentDate },

      isDeleted: false,
    };

    const total = await Coupon.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    const coupon = await Coupon.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      coupon,
      total,
      page,
      totalPages,
    });
  } catch (error) {
    console.error("Error in searchCoupons:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const searchDeletedCoupons = async (req, res) => {
  try {
    const searchQuery = req.query.q || "";
    const currentDate = new Date();

    const coupons = await Coupon.find({
      couponName: { $regex: searchQuery, $options: "i" },
      expiryDate: { $gte: currentDate },

      isDeleted: true,
    }).sort({ createdAt: -1 });

    res.status(200).json(coupons);
  } catch (error) {
    console.error("Error in searchproducts:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const softdeleteCoupon = async (req, res) => {
  try {
    const couponId = req.params.id;

    const updatedCoupon = await Coupon.findByIdAndUpdate(
      couponId,
      { isDeleted: true },
      { new: true }
    );

    if (!updatedCoupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    res
      .status(200)
      .json({ r: true, message: "Coupon soft deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const restoreCoupon = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json("Id not found");
    }
    const coupon = await Coupon.findByIdAndUpdate(
      id,
      { isDeleted: false },
      { new: true }
    );
    res.status(200).json("Product updated");
  } catch (error) {
    res.status(500).json("Internal server error", error);
  }
};
module.exports = {
  addCoupon,
  restoreCoupon,
  searchCoupons,
  softdeleteCoupon,
  searchDeletedCoupons,
  editCoupon,
};
