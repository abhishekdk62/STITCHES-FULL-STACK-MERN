

const Product = require("../../models/productSchema");

const Cart = require("../../models/cartSchema");


const getCartItems = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({ userId }).populate("items.productId");
    res.status(200).json(cart);
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const addToCart = async (req, res) => {
  try {
    const { productId, quantity, variantId } = req.body;
    const userId = req.user.id;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }
    const variant = product.variants.find((v) => v._id.equals(variantId));
    if (!variant) {
      return res.status(404).json({ message: "Selected variant not found." });
    }
    if (variant.stock < quantity) {
      return res.status(400).json({ message: "Not enough stock available." });
    }
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({
        userId,
        items: [],
        totalPrice: 0,
        tax: 0,
        shippingPrice: 0,
      });
    } else if (
      cart.items.find(
        (i) => i.productId.equals(productId) && i.variantId.equals(variantId)
      )
    ) {
      return res.status(400).json({ message: "Item already in the cart" });
    }
    cart.items.push({
      productId,
      variantId,
      quantity,
      price: variant.discount_price || variant.base_price,
    });
    cart.totalPrice = cart.items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );
    let taxRate = 0.12;
    cart.tax = cart.items.reduce(
      (sum, item) => sum + item.quantity * item.price * taxRate,
      0
    );
    cart.tax = parseFloat(cart.tax.toFixed(2));

    cart.shippingPrice = cart.totalPrice > 499 ? 0 : 50;
    await cart.save();
    res.status(200).json({ message: "Product added to cart", cart });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const changeQuantity = async (req, res) => {
  try {
    const { cid, pid, vid, quantity } = req.body;
    if (!cid || !pid || !vid || !quantity) {
      return res.status(400).json({ message: "IDs and quantity not provided" });
    }
    const cart = await Cart.findById(cid);
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    const item = cart.items.find(
      (item) => item.productId.equals(pid) && item.variantId.equals(vid)
    );
    if (!item) {
      return res.status(404).json({ message: "Item not found in cart" });
    }
    const product = await Product.findById(pid);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    const variant = product.variants.find((v) => v._id.equals(vid));
    if (!variant) {
      return res.status(404).json({ message: "Variant not found" });
    }
    if (quantity > variant.stock) {
      return res
        .status(400)
        .json({ message: "Quantity exceeds available stock" });
    }
    if (quantity > 5) {
      return res
        .status(400)
        .json({ message: "Cannot add more than 5 of the same item" });
    }
    item.quantity = quantity;
    cart.totalPrice = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    // ✅ Update tax
    let taxRate = 0.12;
    cart.tax = cart.items.reduce(
      (sum, item) => sum + item.quantity * item.price * taxRate,
      0
    );
    cart.tax = parseFloat(cart.tax.toFixed(2)); // Ensure proper rounding

    await cart.save();

    return res.status(200).json({ message: "Cart updated successfully", cart });
  } catch (error) {
    console.error("Error updating quantity:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};
const checkInCart = async (req, res) => {
  try {
    const { pid, vid } = req.body;
    const userId = req.user.id;

    const cart = await Cart.findOne({
      userId,
      "items.productId": pid,
      "items.variantId": vid,
    });

    if (cart) {
      return res.status(200).json({ inCart: true });
    }

    res.status(200).json({ inCart: false });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const deleteItem = async (req, res) => {
  try {
    const itemid = req.body.itemId;
    const cartId = req.body.cartId;

    if (!itemid || !cartId) {
      return res
        .status(400)
        .json({ message: "Item ID and Cart ID are required" });
    }
    const cart = await Cart.findById(cartId);
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    const itemIndex = cart.items.findIndex((i) => i._id.equals(itemid));
    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }
    cart.items.splice(itemIndex, 1);
    cart.totalPrice = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    await cart.save();
    return res.status(200).json({ message: "Item removed successfully", cart });
  } catch (error) {
    console.error("Error deleting item:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};
module.exports = {
  getCartItems,
  addToCart,
  changeQuantity,
  checkInCart,
  deleteItem,
};
