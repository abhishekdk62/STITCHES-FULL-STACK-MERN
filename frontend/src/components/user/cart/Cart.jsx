import { Trash2, ShoppingBag, Home, ChevronRight, MinusCircle, PlusCircle } from "lucide-react";
import {
  getCartItems,
  changeQuantityApi,
  removeFromCart,
} from "../../../services/userService";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCart } from "../../../../slices/checkoutSlice";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

export default function ShoppingCart() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.checkout.cart);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [removeCartId, setRemoveCartId] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const getCart = async () => {
    try {
      const response = await getCartItems();
      dispatch(setCart(response));
    } catch (error) {
      console.log(error);
      toast.error("Failed to load cart items");
    } finally {
    }
  };

  useEffect(() => {
    setIsLoading(true);

    getCart();
    setIsLoading(false);

  }, []);

  const changeQauntity = async (item, newQuantity) => {
    if (newQuantity < 1) {
      return;
    }
    try {
      await changeQuantityApi(
        cartItems._id,
        item.productId._id,
        item.variantId,
        newQuantity
      );

      getCart();
      
    } catch (error) {
      console.log(error.response?.data?.message);


      toast.error(error.response?.data?.message||"Failed to update quantity", {
        icon: (
          <img
            src="https://static.thenounproject.com/png/217675-200.png"
            className="animate-pulse"
            style={{ filter: "invert(1)" }}
            alt="Success Icon"
            width="30"
            height="30"
          />
        ),
        style: {
          border: "1px solid #0f5132",
          padding: "16px",
          color: "white",
          background: "#ff5252",
          fontSize: "14px",
          fontWeight: "bold",
        },
      });

    }
  };

  const removeItem = async () => {
    try {
      await removeFromCart(removeCartId, cartItems._id);
      getCart();
      setIsOpen(false);
      toast.success("Item removed from cart", {
        icon: (
          <img
            src="https://static.thenounproject.com/png/247537-200.png"
            className="animate-spin"
            style={{ filter: "invert(1)" }}
            alt="Success Icon"
            width="30"
            height="30"
          />
        ),
        style: {
          border: "1px solid #0f5132",
          padding: "16px",
          color: "white",
          background: "black",
          fontSize: "14px",
          fontWeight: "bold",
        },
        autoClose: 5000,
      });


    } catch (error) {
      console.log(error);
      toast.error("Failed to remove item");
    }
  };

  const handleCheckout = () => {
    navigate("/user/checkout");
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 24 
      }
    }
  };

  const buttonVariants = {
    hover: { 
      scale: 1.05, 
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 10 
      } 
    },
    tap: { scale: 0.95 }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[600px] w-4xl">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ 
            repeat: Infinity, 
            duration: 1, 
            ease: "linear" 
          }}
        >
          <ShoppingBag className="w-12 h-12 text-gray-400" />
        </motion.div>
      </div>
    );
  }

  if (!cartItems || !cartItems.items || cartItems.items.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-6 bg-card h-[600px] w-4xl rounded-lg  flex flex-col items-center justify-center"
      >
        <ShoppingBag className="w-24 h-24 text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-700 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Looks like you haven't added any items to your cart yet</p>
        <motion.button
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          onClick={() => navigate("/")}
          className="bg-black text-white px-6 py-3 rounded-md flex items-center gap-2"
        >
          Continue Shopping
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 bg-white h-auto min-h-[600px] w-4xl rounded-lg"
    >
     
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-lg shadow-xl max-w-sm w-full mx-4 overflow-hidden"
            >
              <div className="p-5 border-b">
                <div className="flex items-center justify-center">
                  <Trash2 className="w-6 h-6 text-red-500 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Remove from Cart</h3>
                </div>
              </div>
              <div className="p-5 text-center">
                <p className="text-gray-600">
                  Are you sure you want to remove this item from your cart?
                </p>
              </div>
              <div className="flex border-t">
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex-1 p-3 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={removeItem}
                  className="flex-1 p-3 text-white bg-black font-medium hover:bg-gray-800 transition-colors"
                >
                  Remove
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header with Logo */}
      <div className="flex justify-between items-center pb-5 border-b mb-8">
        <div className="flex items-center gap-2">
          <ShoppingBag className="h-8 w-8 text-black" />
          <h1 className="text-2xl font-bold">Shopping Cart</h1>
        </div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {cartItems.items.map((item, indx) => (
          <motion.div 
            key={indx} 
            variants={itemVariants}
            className="overflow-hidden h-[200px] bg-white rounded-lg border border-gray-200 transition-shadow duration-300 "
          >
            <div className="flex flex-col md:flex-row gap-6">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="flex-shrink-0"
              >
                <img
                  src={
                    item?.productId.variants.find(
                      (v) => v._id == item.variantId
                    ).productImages[0]
                  }
                  className="w-full md:w-40 h-full object-cover rounded-md shadow"
                />
              </motion.div>
                
              
              <div className="flex-grow p-3">
                <div className="flex justify-between items-start">
                  <div className="">
                    <h3 className="font-medium text-lg mb-1">{item.productId.name}</h3>
                    <p className="text-gray-500 mb-1">
                      Color:{" "}
                      <span className="font-medium">
                        {
                          item?.productId.variants.find(
                            (v) => v._id == item.variantId
                          ).color
                        }
                      </span>
                    </p>
                    <p className="text-gray-500 mb-3">
                      Size:{" "}
                      <span className="font-medium">
                        {
                          item?.productId.variants.find(
                            (v) => v._id == item.variantId
                          ).size
                        }
                      </span>
                    </p>
                  </div>
                  
                  <motion.button
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    onClick={() => {
                      setIsOpen(true);
                      setRemoveCartId(item._id);
                    }}
                    className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50"
                  >
                    <Trash2 className="h-5 w-5" />
                  </motion.button>
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between mt-4">
                  {/* Price */}
                  <div className="mb-4 md:mb-0">
                    <p className="text-gray-500 text-sm">Price</p>
                    <p className="font-medium">₹{item.price}</p>
                  </div>

                  {/* Quantity */}
                  <div className="mb-4 md:mb-0">
                    <p className="text-gray-500 text-sm mb-2">Quantity</p>
                    <div className="flex items-center gap-2">
                      <motion.button
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        onClick={() => changeQauntity(item, item.quantity - 1)}
                        className="text-gray-600 hover:text-red-500"
                      >
                        <MinusCircle className="h-5 w-5" />
                      </motion.button>
                      <span className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-md font-medium">
                        {item.quantity}
                      </span>
                      <motion.button
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        onClick={() => changeQauntity(item, item.quantity + 1)}
                        className="text-gray-600 hover:text-green-500"
                      >
                        <PlusCircle className="h-5 w-5" />
                      </motion.button>
                    </div>
                  </div>

                  {/* Subtotal */}
                  <div>
                    <p className="text-gray-500 text-sm">Subtotal</p>
                    <p className="font-bold">₹{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Cart Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8 bg-gray-50 p-6 rounded-lg border border-gray-200"
      >
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-500 mb-1">Total ({cartItems.items.length} items)</p>
            <p className="text-2xl font-bold">₹{cartItems.totalPrice?.toFixed(2) || 0}</p>
          </div>
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => handleCheckout()}
            className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-md font-medium flex items-center gap-2"
          >
            <ShoppingBag className="h-5 w-5" />
            Proceed To Checkout
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}