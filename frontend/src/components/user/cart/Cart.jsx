import {
  Trash2,
  ShoppingBag,
  Home,
  ChevronRight,
  MinusCircle,
  PlusCircle,
} from 'lucide-react';
import React from 'react';

import {
  getCartItems,
  changeQuantityApi,
  removeFromCart,
} from '../../../services/userService';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setCart } from '../../../../slices/checkoutSlice';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import Notification from '../common/Notification';

export default function ShoppingCart() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.checkout.cart);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [removeCartId, setRemoveCartId] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const userDetails = useSelector((state) => state.auth.user);

  const getCart = async () => {
    try {
      const response = await getCartItems();
      dispatch(setCart(response));
    } catch (error) {
      console.log(error);
      toast.error('Failed to load cart items');
    } finally {
    }
  };

  useEffect(() => {
    const loadCart = async () => {
      if (!userDetails) return;
      setIsLoading(true);
      try {
        await getCart();
      } finally {
        setIsLoading(false);
      }
    };
    loadCart();
  }, [userDetails]);

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

      toast.error(
        error.response?.data?.message || 'Failed to update quantity',
        {
          icon: (
            <img
              src="https://static.thenounproject.com/png/217675-200.png"
              className="animate-pulse"
              style={{ filter: 'invert(1)' }}
              alt="Success Icon"
              width="30"
              height="30"
            />
          ),
          style: {
            border: '1px solid #0f5132',
            padding: '16px',
            color: 'white',
            background: '#ff5252',
            fontSize: '14px',
            fontWeight: 'bold',
          },
        }
      );
    }
  };

  const removeItem = async () => {
    try {
      await removeFromCart(removeCartId, cartItems._id);
      getCart();
      setIsOpen(false);
      toast.success('Item removed from cart', {
        icon: (
          <img
            src="https://static.thenounproject.com/png/247537-200.png"
            className="animate-spin"
            style={{ filter: 'invert(1)' }}
            alt="Success Icon"
            width="30"
            height="30"
          />
        ),
        style: {
          border: '1px solid #0f5132',
          padding: '16px',
          color: 'white',
          background: 'black',
          fontSize: '14px',
          fontWeight: 'bold',
        },
        autoClose: 5000,
      });
    } catch (error) {
      console.log(error);
      toast.error('Failed to remove item');
    }
  };

  const handleCheckout = () => {
    navigate('/user/checkout');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 24,
      },
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 10,
      },
    },
    tap: { scale: 0.95 },
  };

  if (!userDetails) {
    return (
      <Notification
        p1="You're not signed in"
        p2="Please log in to view your cart and start shopping."
        icon={<ShoppingBag />}
        actionLabel="Log In"
        onAction={() => navigate('/')}
        secondaryLabel="Browse Products"
        onSecondary={() => navigate('/products')}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[600px] w-4xl">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            repeat: Infinity,
            duration: 1,
            ease: 'linear',
          }}
        >
          <ShoppingBag className="w-12 h-12 text-gray-400" />
        </motion.div>
      </div>
    );
  }

  if (!cartItems || !cartItems.items || cartItems.items.length === 0) {
    return (
      <Notification
        p1="Your cart is empty"
        p2="Looks like you haven't added any items yet. Explore our collection and find something you love."
        icon={<ShoppingBag />}
        actionLabel="Start Shopping"
        onAction={() => navigate('/products')}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 sm:p-6 bg-white h-auto shadow-sm border border-gray-100 min-h-[500px] w-full max-w-4xl mx-auto rounded-xl"
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
                  <h3 className="text-lg font-semibold text-gray-900">
                    Remove from Cart
                  </h3>
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

      <div className="flex justify-between items-center pb-3 md:pb-5 border-b mb-4 md:mb-8">
        <div className="flex items-center gap-2">
          <ShoppingBag className="h-5 w-5 md:h-8 md:w-8 text-black" />
          <h1 className="text-lg md:text-2xl font-bold">Shopping Cart</h1>
        </div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6 "
      >
        {cartItems.items.map((item, indx) => (
          <motion.div
            key={indx}
            variants={itemVariants}
            className="border border-gray-200 bg-white rounded-lg hover:shadow-md transition-shadow duration-200 overflow-hidden"
          >
            <div className="flex gap-3 md:gap-6">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className=""
              >
                <img
                  src={
                    item?.productId.variants.find(
                      (v) => v._id == item.variantId
                    ).productImages[0]
                  }
                  className="h-28 w-24 sm:h-36 sm:w-32 object-cover rounded-lg"
                />
              </motion.div>

              <div className="p-1 md:p-3 h-full flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-sm sm:text-base mb-1 line-clamp-2">
                      {item.productId.name}
                    </h3>

                    <p className="text-gray-500 text-xs sm:text-sm mb-1">
                      Color:{' '}
                      <span className="font-medium text-gray-700">
                        {
                          item?.productId.variants.find(
                            (v) => v._id == item.variantId
                          ).color
                        }
                      </span>
                    </p>
                    <p className="text-gray-500 text-xs sm:text-sm mb-2">
                      Size:{' '}
                      <span className="font-medium text-gray-700">
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
                    className="text-red-500 hover:text-red-700 p-1 md:p-2 rounded-full hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 md:h-5 md:w-5" />
                  </motion.button>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 mt-3 pt-3 border-t border-gray-100">
                  <div>
                    <p className="text-gray-400 text-xs">Price</p>
                    <p className="font-semibold text-sm sm:text-base">
                      ₹{item.price}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-400 text-xs mb-1">Quantity</p>
                    <div className="flex items-center gap-2">
                      <motion.button
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        onClick={() => changeQauntity(item, item.quantity - 1)}
                        className="text-gray-500 hover:text-red-500 p-1"
                        aria-label="Decrease quantity"
                      >
                        <MinusCircle className="h-5 w-5" />
                      </motion.button>
                      <span className="min-w-[2rem] text-center bg-gray-100 rounded-md font-medium text-sm py-1 px-2">
                        {item.quantity}
                      </span>
                      <motion.button
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        onClick={() => changeQauntity(item, item.quantity + 1)}
                        className="text-gray-500 hover:text-green-600 p-1"
                        aria-label="Increase quantity"
                      >
                        <PlusCircle className="h-5 w-5" />
                      </motion.button>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-gray-400 text-xs">Subtotal</p>
                    <p className="font-bold text-sm sm:text-base">
                      ₹{(item.price * item.quantity).toFixed(0)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-6 bg-gray-50 p-4 sm:p-6 rounded-xl border border-gray-200"
      >
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-3 md:mb-0">
            <p className="text-gray-500 text-xs md:text-sm mb-1">
              Total ({cartItems.items.length} items)
            </p>
            <p className="text-base md:text-2xl font-bold">
              ₹{cartItems.totalPrice?.toFixed(2) || 0}
            </p>
          </div>
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => handleCheckout()}
            className="w-full sm:w-auto bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <ShoppingBag className="h-4 w-4 md:h-5 md:w-5" />
            Proceed To Checkout
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
