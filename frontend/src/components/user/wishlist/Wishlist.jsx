import React, { useEffect, useState } from 'react';
import { X, Heart, ShoppingCart, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { toast } from 'react-hot-toast';
import {
  getWishlistApi,
  removeWishlistItem,
} from '../../../services/wishlistService';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { addToCartApi } from '../../../services/userService';
import { useSelector } from 'react-redux';
import Notification from '../common/Notification';

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isEmpty, setIsEmpty] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [removeItemId, setRemoveItemId] = useState(null);

  const getWishlist = async () => {
    try {
      const response = await getWishlistApi();
      setWishlistItems(response.data.wishlist);
      console.log('wishlist items are', response.data.wishlist);
    } catch (error) {
      console.log(error);
      if (error.response.data.wishlist.length == 0) {
        setIsEmpty(true);
        setWishlistItems([]);
      }
    }
  };

  useEffect(() => {
    getWishlist();
  }, []);

  const navigate = useNavigate();
  const handleProductView = (product) => {
    navigate(`/product/${product._id}`);
  };

  const handleRemove = async () => {
    try {
      const response = await removeWishlistItem(removeItemId);

      toast.success('Removed from wishlist', {
        icon: (
          <img
            src="https://static.thenounproject.com/png/29520-200.png"
            className="animate-bounce"
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
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsOpen(false);
      getWishlist();
    }
  };

  const addToCart = async (pid, vid) => {
    const quantity = 1;
    try {
      const response = await addToCartApi(pid, vid, quantity);

      toast.success(response.message, {
        icon: (
          <img
            src="https://static.thenounproject.com/png/29520-200.png"
            className="animate-bounce"
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
      });
      getWishlist();
    } catch (error) {
      toast.error(error.message, {
        icon: (
          <img
            src="https://static.thenounproject.com/png/3941-200.png"
            className="animate-bounce"
            style={{ filter: 'invert(1)' }}
            alt="Success Icon"
            width="30"
            height="30"
          />
        ),
        style: {
          padding: '16px',
          color: 'white',
          background: '#ff6666',
          fontSize: '14px',
          fontWeight: 'bold',
        },
      });
    }
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
  const userDetails = useSelector((state) => state.auth.user);

  if (!userDetails) {
    return (
      <Notification
        p1={'You’re not signed in'}
        p2={'Please log in to view your Wishlists.'}
        icon={<Heart className="w-16 h-16 text-gray-300 mb-4" />}
      />
    );
  }
  if (isEmpty) {
    return (
      <Notification
        p1={'Your wishlist is empty'}
        p2={'Items added to your wishlist will appear here'}
        icon={<Heart className="w-16 h-16 text-gray-300 mb-4" />}
      />
    );
  }

  return (
    <div className=" bg-white min-h-screen w-full mx-auto rounded-xl">
      <div className="flex items-center justify-between mb-8 border-b pb-4">
        <div className="flex pt-5 items-center gap-3">
          <Heart className="md:w-8 md:h-8 w-6 h-6 text-black" />
          <h1 className="text-base sm:text-lg  md:text-2xl  font-bold text-black tracking-tight">
            My Wishlist
          </h1>
        </div>
        <div className="text-sm text-gray-500">
          {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'}
        </div>
      </div>

      <div className="grid gap-6">
        {wishlistItems.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-stretch">
              <div
                onClick={() => handleProductView(item.productId)}
                className="relative md:w-32 md:h-50 w-30 h-38 cursor-pointer overflow-hidden bg-gray-100"
              >
                <img
                  src={item.selectedVariant.productImages[0]}
                  alt={item.productId.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="flex-1 p-4 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div
                    onClick={() => handleProductView(item.productId)}
                    className="cursor-pointer"
                  >
                    <h3 className="md:text-lg text-base   font-semibold text-gray-900 group-hover:text-black transition-colors">
                      {item.productId.name}
                    </h3>
                    <p className="text-gray-500 text-xs  md:text-sm mt-1">
                      {item.productId.brand}
                    </p>
                    <div className="mt-2 space-y-1">
                      <p className="md:text-sm text-[0.7rem] text-gray-600">
                        <span className="font-medium">Color:</span>{' '}
                        {item.selectedVariant.color}
                      </p>
                      <div className="md:mt-2 px-2 py-4 md:text-sm text-[0.7rem]">
                        {item.selectedVariant.stock > 0 ? (
                          <span className=" bg-white border border-green-700 bg-opacity-10 text-green-600 font-medium  rounded">
                            In Stock
                          </span>
                        ) : (
                          <span className=" bg-red-50 text-red-500 font-medium border-red-600  rounded flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> Out of Stock
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setRemoveItemId(item._id);
                        setIsOpen(true);
                      }}
                      className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                      aria-label="Remove from wishlist"
                    >
                      <X className="h-5 w-5 text-gray-700 hover:text-red-500" />
                    </button>
                  </div>
                </div>

                <div className="md:mt-4 flex items-center md:justify-end gap-3">
                  <button
                    onClick={() =>
                      addToCart(item.productId._id, item.selectedVariant._id)
                    }
                    disabled={item.selectedVariant.stock <= 0}
                    className={`flex items-center text-sm md:text-base gap-2 px-3 py-1 md:px-5 md:py-2 rounded-md font-medium transition-all duration-300 ${
                      item.selectedVariant.stock <= 0
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-black text-white hover:bg-gray-800'
                    }`}
                  >
                    <ShoppingCart className="w-4  h-4" />
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Confirmation modal */}
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
                  <Heart className="w-6 h-6 text-red-500 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Remove from Wishlist
                  </h3>
                </div>
              </div>
              <div className="p-5 text-center">
                <p className="text-gray-600">
                  Are you sure you want to remove this item from your wishlist?
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
                  onClick={handleRemove}
                  className="flex-1 p-3 text-white bg-black font-medium hover:bg-gray-800 transition-colors"
                >
                  Remove
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Wishlist;
