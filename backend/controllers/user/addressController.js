const User = require("../../models/userSchema");

const Address = require("../../models/addressSchema");

const addAddress = async (req, res) => {
  try {
    const {
      fullName,
      street,
      city,
      state,
      addressType,
      zipCode,
      country,
      phone,
      defaultBilling,
    } = req.body;

    const user = req.user.id;
    if (
      !fullName ||
      !street ||
      !city ||
      !state ||
      !zipCode ||
      !country ||
      !phone ||
      !addressType
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const newAddress = new Address({
      user,
      fullName,
      street,
      city,
      state,
      addressType,
      zipCode,
      country,
      phone,
      isDefault: defaultBilling || false,
    });
    await newAddress.save();
    await User.findByIdAndUpdate(newAddress.user, {
      $push: { addresses: newAddress._id },
    });
    res.status(201).json({
      message: "Address added successfully",
      address: newAddress,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const editAddress = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      fullName,
      street,
      city,
      state,
      addressType,
      zipCode,
      country,
      phone,
      defaultBilling,
    } = req.body;

    const user = req.user.id;

    const address = await Address.findOne({ _id: id, user });
    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }
    address.fullName = fullName || address.fullName;
    address.street = street || address.street;
    address.city = city || address.city;
    address.state = state || address.state;
    address.zipCode = zipCode || address.zipCode;
    address.country = country || address.country;
    address.phone = phone || address.phone;
    address.addressType = addressType || address.addressType;
    address.isDefault = defaultBilling ?? address.isDefault;
    await address.save();
    res.status(200).json({
      message: "Address updated successfully",
      address,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user.id; // Ensure the request has user info

    if (!id) {
      return res.status(400).json({ message: "Address ID not provided" });
    }

    const address = await Address.findOne({ _id: id, user });
    if (!address) {
      return res
        .status(404)
        .json({ message: "Address not found or unauthorized" });
    }

    await Address.findByIdAndDelete(id);

    await User.findByIdAndUpdate(user, { $pull: { addresses: id } });

    res.status(200).json({ message: "Address deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAddress = async (req, res) => {
  try {
    const uid = req.user.id;
    const user = await User.findById(uid).populate("addresses");
    if (!user) {
      return res.status(400).json("user not found");
    }
    res.status(200).json({ user: user });
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  addAddress,
  getAddress,
  editAddress,
  deleteAddress,
};
