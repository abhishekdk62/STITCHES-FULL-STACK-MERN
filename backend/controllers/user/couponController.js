
const Coupons = require("../../models/couponSchema");

const Referal = require("../../models/referalSchema");

const getCoupons = async (req, res) => {
  try {
    const uid = req.user.id;
    const now = new Date();

   await Coupons.deleteMany({
    expiryDate:{$lte:now},
    isDeleted: false


   })


    await Referal.deleteMany({expiryDate:{$lte:now},  isDeleted: false
    })

    const coupons = await Coupons.find({
      isDeleted: false,

    });

    const refCoupons = await Referal.find({
      uid,
      isDeleted: false, 
    });

    res.status(200).json({ coupons, refCoupons });
  } catch (error) {
    res.status(500).json(error);
  }
};

const applyCoupon = async (req, res) => {
  try {
    const { couponCode } = req.body;
    const { finalTotal } = req.body;

    if (couponCode === "") {
      return res.status(200).json({ message: "Coupon removed" });
    }

    let coupon = await Coupons.findOne({ code: couponCode, isDeleted: false });
    if (!coupon) {
      coupon = await Referal.findOne({ code: couponCode });
      if (!coupon) {
        return res.status(400).json("Coupon doesn't exist");
      }
    }

    const now = new Date();

    if (coupon.usedCount >= coupon.usageLimit || now >= coupon.expiryDate) {
      coupon.isDeleted = true; 
      await coupon.save();
      return res.status(400).json("Coupon is no longer valid");
    }
    console.log(finalTotal);

  if(coupon.minimumAmount>finalTotal)
  {
    return res.status(400).json(`Minimum order amount to use this coupon is ${coupon.minimumAmount}`);

  }

    await coupon.save();

    res.status(200).json(coupon);
  } catch (error) {
    console.log(error);
    
    res.status(500).json(error);
  }
};



module.exports = {
  getCoupons,
  applyCoupon,
};
