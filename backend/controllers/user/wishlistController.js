
const Wishlist = require("../../models/wishlistShema");

const Cart = require("../../models/cartSchema");



const addToWishlist = async (req, res) => {
  try {
    const { productId, selectedVariant } = req.body;
    const userId = req.user.id;

    if (!productId || !selectedVariant) {
      return res
        .status(400)
        .json({ message: "Product or Variant data missing" });
    }

    let wishlist = await Wishlist.findOne({ userId });

    if (wishlist) {
      const itemExists = wishlist.items.find(
        (item) =>
          item.productId.equals(productId) &&
          item.selectedVariant._id.toString() === selectedVariant._id.toString()
      );

      if (itemExists) {
        return res.status(400).json({ message: "Item already in wishlist" });
      }

      wishlist.items.push({ productId, selectedVariant });
      await wishlist.save();
      return res
        .status(200)
        .json({ message: "Item added to wishlist", wishlist });
    } else {
      wishlist = new Wishlist({
        userId,
        items: [{ productId, selectedVariant }],
      });
      await wishlist.save();
      return res
        .status(201)
        .json({ message: "Item added to wishlist", wishlist });
    }
  } catch (error) {
    return res.status(500).json(error);
  }
};

const getWishlist = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(400).json({ error: "User ID is not provided" });
    }

    // Retrieve the user's wishlist and populate product details
    const wishlistDoc = await Wishlist.findOne({ userId }).populate(
      "items.productId"
    );
    if (!wishlistDoc || !wishlistDoc.items || wishlistDoc.items.length === 0) {
      return res
        .status(404)
        .json({ message: "Wishlist is empty", wishlist: [] });
    }

    // Retrieve the user's cart
    const cart = await Cart.findOne({ userId });
    const cartItems = cart?.items || [];

    const filteredWishlistItems = wishlistDoc.items.filter((wItem) => {
      const wishlistProductId =
        wItem?.productId?._id?.toString() || wItem?.productId?.toString() || "";
      const wishlistVariantId =
        wItem?.selectedVariant?._id?.toString() ||
        wItem?.selectedVariant?.toString() ||
        "";

      if (!wishlistProductId || !wishlistVariantId) return false;

      const existsInCart = cartItems.some((cItem) => {
        const cartProductId = cItem?.productId?.toString() || "";
        const cartVariantId = cItem?.variantId?.toString() || "";
        return (
          cartProductId === wishlistProductId &&
          cartVariantId === wishlistVariantId
        );
      });

      return !existsInCart;
    });

    const sortedWishlistItems = filteredWishlistItems.sort((a, b) => {
      return new Date(b.addedAt) - new Date(a.addedAt);
    });
    

    return res.status(200).json({ wishlist: sortedWishlistItems });
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const removeWishlist = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.user.id;

    if (!id || !userId) {
      return res
        .status(400)
        .json({ message: "User id and wishlist id are required" });
    }

  
    const wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    
    const itemIndex = wishlist.items.findIndex((item) => item._id.equals(id));

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Wishlist item not found" });
    }

    
    wishlist.items.splice(itemIndex, 1);
    await wishlist.save();

    return res
      .status(200)
      .json({ message: "Wishlist item successfully removed", wishlist });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};



module.exports = {
  getWishlist,
  addToWishlist,
  removeWishlist,
};
