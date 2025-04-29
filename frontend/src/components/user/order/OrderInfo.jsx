import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import {
  ArrowLeft,
  X,
  Truck,
  Calendar,
  MapPin,
  ShoppingBag,
  DollarSign,
  CreditCard,
  AlertCircle,
  RotateCcw,
  XCircle,
  Printer,
  Clock,
  CheckCircle2,
  User,
  MapPinCheckInside,
  Package,
  Undo2,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { addDays } from 'date-fns';

import { useDispatch, useSelector } from 'react-redux';
import { format } from 'date-fns';
import {
  cancelOrder,
  returnRequest,
  checkForReturn,
} from '../../../services/orderServices';

import { generatePDFInvoice } from '../../../../utils/generateInvoice';
import { setOrderDetail } from '../../../../slices/orderSlice';
import { setSelectedTab } from '../../../../slices/selectedTabSlice';
export default function OrderInfo() {
  const orderDetail = useSelector((state) => state.order.orderDetail);
  const [isOpen, setIsOpen] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelError, setCancelError] = useState(null);
  const [orderCancelled, setOrderCancelled] = useState(false);
  const [reason, setReason] = useState('');
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [status, setStatus] = useState();
  const [error, setError] = useState(false);
  const [returnModal, setReturnModal] = useState(false);
  if (!orderDetail) {
    return (
      <div className="flex items-center justify-center w-4xl bg-gray-50 rounded-lg">
        <div className="text-center">
          <ShoppingBag size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-700 text-lg font-medium">
            No order details selected.
          </p>
          <p className="text-gray-500 mt-2">
            Please select an order to view details
          </p>
        </div>
      </div>
    );
  }
  const dispatch = useDispatch();
  const { order, item, selectedVariant } = orderDetail;
  const formatDateDelivery = (dateString) => {
    try {
      const date = new Date(dateString);
      const newDate = addDays(date, 5);
      return format(newDate, 'd MMMM yyyy h:mm a');
    } catch (error) {
      return dateString || 'N/A';
    }
  };
  // order.createdAt.

  const [returnDisabled, setReturnDisabled] = useState(false);
  useEffect(() => {
    const today = new Date();
    const createdDate = new Date(order?.createdAt);

    const diffInTime = today.getTime() - createdDate.getTime();
    const diffInDays = diffInTime / (1000 * 3600 * 24);

    if (diffInDays > 4) {
      setReturnDisabled(true);
    } else {
      setReturnDisabled(false);
    }
  }, [order?.createdAt]);

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return format(date, 'd MMMM yyyy h:mm a');
    } catch (error) {
      return dateString || 'N/A';
    }
  };

  React.useEffect(() => {
    if (item.status === 'Cancelled') {
      setOrderCancelled(true);
    }
  }, [item.status]);

  const updateaStatus = (status) => {
    dispatch(
      setOrderDetail({ ...orderDetail, item: { ...item, status: status } })
    );
  };

  const handleCancelOrder = async () => {
    try {
      setCancelLoading(true);
      setCancelError(null);
      await cancelOrder(
        order._id,
        item.product._id,
        item.variant,
        item.quantity,
        order.paymentMethod,
        grandTotal
      );
      toast.success('Order cancelled', {
        icon: <CheckCircle2 className="text-white" size={18} />,
        style: {
          border: '1px solid #000',
          padding: '16px',
          color: 'white',
          background: '#000',
          fontSize: '14px',
          fontWeight: 'bold',
        },
        autoClose: 5000,
      });

      updateaStatus('Cancelled');
      setIsOpen(false);
    } catch (error) {
      console.error('Error cancelling order:', error);
      setCancelError('Failed to cancel order. Please try again.');
    } finally {
      setCancelLoading(false);
    }
  };

  const handleGenerateInvoice = () => {
    generatePDFInvoice(order, subtotal, shipping, tax, discount, grandTotal);
  };

  const openReturnModal = () => {
    setShowReturnModal(true);
  };

  const closeReturnModal = () => {
    setShowReturnModal(false);
    setReason('');
  };
  const handleReturnOrder = async () => {
    if (!reason.trim()) {
      setError(true);
      return;
    }
    try {
      const response = await returnRequest(
        order._id,
        item.product._id,
        item.variant,
        reason,
        item?.quantity
      );
      toast.success('Return requested', {
        icon: <CheckCircle2 className="text-white" size={18} />,
        style: {
          border: '1px solid #000',
          padding: '16px',
          color: 'white',
          background: '#000',
          fontSize: '14px',
          fontWeight: 'bold',
        },
        autoClose: 5000,
      });
      setReturnModal(false);

      closeReturnModal();

      if (!response) {
        checkReturnStatus();
      }
    } catch (error) {
      console.error('Error processing return:', error);
    }
  };

  const checkReturnStatus = async () => {
    try {
      const response = await checkForReturn(
        order._id,
        item.product._id,
        item.variant
      );
      setStatus(response.status);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    checkReturnStatus();
  }, [order._id, item.product._id, item.variant]);

  const subtotal = selectedVariant.discount_price * item?.quantity;
  const tax = subtotal * 0.12;
  const shipping = order.shippingPrice || 0;
  const discount = order.discount || 0;
  const grandTotal = subtotal + tax + shipping - discount;

  const getOrderProgress = () => {
    switch (item.status) {
      case 'Pending':
        return 8;
      case 'Processing':
        return 40;
      case 'Shipped':
        return 68;
      case 'Delivered':
        return 100;
      case 'Cancelled':
        return 100;
      case 'Returned':
        return 100;
      default:
        return 10;
    }
  };

  // Get status icon based on order status
  const getStatusIcon = (status) => {
    switch (status) {
      case 'Delivered':
        return <CheckCircle2 size={16} className="text-green-600" />;
      case 'Processing':
        return <Clock size={16} className="text-blue-600" />;
      case 'Shipped':
        return <Truck size={16} className="text-indigo-600" />;
      case 'Cancelled':
        return <XCircle size={16} className="text-red-600" />;
      case 'Returned':
        return <RotateCcw size={16} className="text-amber-600" />;
      case 'Out for Delivery':
        return <Truck size={16} className="text-purple-600" />;
      default:
        return <Clock size={16} className="text-gray-600" />;
    }
  };

  return (
    <div className="w-full mx-auto pt-3 font-sans bg-white rounded-xl shadow-sm">
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
                  <Package className="w-6 h-6 text-red-500 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Cancel order?
                  </h3>
                </div>
              </div>
              <div className="p-5 text-center">
                <p className="text-gray-600">
                  Are you sure you want to cancel this order item?
                </p>
              </div>
              <div className="flex border-t">
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex-1 p-3 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
                >
                  No
                </button>
                <button
                  onClick={handleCancelOrder}
                  className="flex-1 p-3 text-white bg-black font-medium hover:bg-gray-800 transition-colors"
                >
                  Yes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {returnModal && (
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
                  <Package className="w-6 h-6 text-red-500 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Return order?
                  </h3>
                </div>
              </div>
              <div className="p-5 text-center">
                <p className="text-gray-600">
                  Are you sure you want to return this order item?
                </p>
              </div>
              <div className="flex border-t">
                <button
                  onClick={() => {
                    setReturnModal(false);
                  }}
                  className="flex-1 p-3 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
                >
                  No
                </button>
                <button
                  onClick={openReturnModal}
                  className="flex-1 p-3 text-white bg-black font-medium hover:bg-gray-800 transition-colors"
                >
                  Yes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Section */}
      <div className="flex items-center justify-between mb-4 md:mb-8 pb-4 md:pb-6 border-b border-gray-200">
        <div className="flex items-center gap-2 md:gap-4">
          <button className="p-1 md:p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft
              size={16}
              onClick={() => dispatch(setSelectedTab('orders'))}
              className="md:w-5 md:h-5"
            />
          </button>
          <div>
            <h1 className="text-sm md:text-xl  text-gray-900">
              Order #{order.orderID || 'Unknown'}
            </h1>
            <div className="flex items-center gap-1 md:gap-2 mt-1 text-xs md:text-sm text-gray-600">
              <Calendar size={14} className="md:w-4 md:h-4" />
              <p>Placed on {formatDate(order.createdAt)}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <button
            onClick={handleGenerateInvoice}
            disabled={
              item.status === 'Returned' ||
              item.status === 'Cancelled' ||
              orderCancelled
            }
            className={`flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1.5 md:py-2 rounded-lg transition-colors text-xs md:text-sm font-medium ${
              item.status === 'Returned' ||
              item.status === 'Cancelled' ||
              orderCancelled
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-800 text-white hover:bg-gray-700'
            }`}
          >
            <Printer size={14} className="md:w-4 md:h-4" />
            Invoice
          </button>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          {/* Order Status Section */}
          <div className="bg-white rounded-xl p-4 md:p-6 border border-gray-200 shadow-sm">
            <h2 className="text-base md:text-lg font-bold text-gray-900 mb-4 md:mb-6 flex items-center gap-2">
              <Truck className="text-gray-700 w-4 h-4 md:w-5 md:h-5" />
              Order Status
            </h2>

            <div className="text-xs md:text-sm">
              {item.status === 'Cancelled' || item.status === 'Returned' ? (
                <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2 text-gray-700">
                    {item.status === 'Cancelled' || orderCancelled == true ? (
                      <>
                        <XCircle size={20} className="text-red-500" />
                        <div>
                          <p className="text-sm text-gray-600">
                            This order has been Cancelled on
                          </p>
                          <p className="font-medium text-gray-900">
                            {formatDate(order.updatedAt)}
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="p-2 bg-gray-300 text-blue-400 rounded-full">
                          <Undo2 size={16} />
                        </div>
                        <div className="flex flex-col">
                          <p className="">This order has been returned on</p>
                          <p className="font-medium text-gray-900">
                            {formatDate(order.updatedAt)}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center text-sm font-medium text-gray-900">
                      <CheckCircle2 size={16} className="text-green-600 mr-1" />
                      <span>Order Placed</span>
                    </div>
                    <div className="flex items-center text-sm font-medium text-gray-900">
                      {getOrderProgress() >= 25 ? (
                        <CheckCircle2
                          size={16}
                          className="text-green-600 mr-1"
                        />
                      ) : (
                        <Clock size={16} className="text-gray-400 mr-1" />
                      )}
                      <span
                        className={
                          getOrderProgress() >= 25
                            ? 'text-gray-900'
                            : 'text-gray-400'
                        }
                      >
                        Processing
                      </span>
                    </div>
                    <div className="flex items-center text-sm font-medium text-gray-900">
                      {getOrderProgress() >= 50 ? (
                        <CheckCircle2
                          size={16}
                          className="text-green-600 mr-1"
                        />
                      ) : (
                        <Clock size={16} className="text-gray-400 mr-1" />
                      )}
                      <span
                        className={
                          getOrderProgress() >= 50
                            ? 'text-gray-900'
                            : 'text-gray-400'
                        }
                      >
                        Shipped
                      </span>
                    </div>
                    <div className="flex items-center text-sm font-medium text-gray-900">
                      {getOrderProgress() >= 100 ? (
                        <CheckCircle2
                          size={16}
                          className="text-green-600 mr-1"
                        />
                      ) : (
                        <Clock size={16} className="text-gray-400 mr-1" />
                      )}
                      <span
                        className={
                          getOrderProgress() >= 100
                            ? 'text-gray-900'
                            : 'text-gray-400'
                        }
                      >
                        Delivered
                      </span>
                    </div>
                  </div>
                  <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="absolute left-0 h-full bg-green-600"
                      style={{ width: `${getOrderProgress()}%` }}
                    ></div>
                  </div>
                </>
              )}
            </div>
            {item.status == 'Cancelled' && null}

            {item.status == 'Delivered' && (
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-300 text-green-400 rounded-full">
                    <MapPinCheckInside size={16} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Delivered on</p>
                    <p className="font-medium text-gray-900">
                      {formatDate(order.updatedAt)}
                    </p>
                  </div>
                </div>
              </div>
            )}
            {item.status !== 'Cancelled' &&
              item.status !== 'Returned' &&
              item.status !== 'Delivered' && (
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-800 text-white rounded-full">
                      <Truck size={16} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Expected Delivery</p>
                      <p className="font-medium text-gray-900">
                        {formatDateDelivery(order.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
          </div>

          {/* Order Items Section */}
          <div className="bg-white rounded-xl p-4 md:p-6 border border-gray-200 shadow-sm">
            <h2 className="text-base md:text-lg font-bold text-gray-900 mb-4 md:mb-6 flex items-center gap-2">
              <ShoppingBag className="text-gray-700 w-4 h-4 md:w-5 md:h-5" />
              Order Items
            </h2>

            <div className="space-y-4">
              <div className="flex items-start gap-3 md:gap-4 p-3 md:p-4 bg-gray-50 rounded-lg">
                {/* Product Image */}
                <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                  <img
                    src={
                      (selectedVariant &&
                        selectedVariant.productImages &&
                        selectedVariant.productImages.length > 0 &&
                        selectedVariant.productImages[0]) ||
                      '/api/placeholder/96/96'
                    }
                    alt={item?.product?.name || 'Product'}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="text-sm md:text-lg font-semibold text-gray-900">
                      {item?.product?.name || 'Product Name'}
                    </h3>
                    <p className="text-sm md:text-lg font-bold text-gray-900">
                      ₹{item?.price ? item.price.toFixed(0) : '0.00'}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 md:gap-4 mt-2">
                    <p className="text-xs md:text-sm text-gray-600 px-2 py-1 bg-gray-100 rounded-full">
                      Color:{' '}
                      <span className="text-gray-900 font-medium">
                        {(selectedVariant && selectedVariant.color) || 'N/A'}
                      </span>
                    </p>
                    <p className="text-xs md:text-sm text-gray-600 px-2 py-1 bg-gray-100 rounded-full">
                      Size:{' '}
                      <span className="text-gray-900 font-medium">
                        {(selectedVariant && selectedVariant.size) || 'N/A'}
                      </span>
                    </p>
                    <p className="text-xs md:text-sm text-gray-600 px-2 py-1 bg-gray-100 rounded-full">
                      Qty:{' '}
                      <span className="text-gray-900 font-medium">
                        {item?.quantity || 0}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white flex justify-center">
            <div className="flex flex-wrap gap-4">
              {/* Return/Cancel Status Displays */}
              {status === 'Requested' ? (
                <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-lg border border-amber-200 font-medium">
                  <Clock size={18} />
                  Return Requested
                </div>
              ) : status === 'Rejected' ? (
                <div className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg border border-red-200 font-medium">
                  <XCircle size={18} />
                  Return Rejected
                </div>
              ) : item.status === 'Returned' ? null : item.status ===
                'Delivered' ? (
                <button
                  disabled={returnDisabled}
                  onClick={() => setReturnModal(true)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg ${returnDisabled ? 'bg-gray-200 cursor-not-allowed text-gray-600' : 'bg-gray-800 text-white hover:bg-gray-700'}  transition-colors font-medium1`}
                >
                  <RotateCcw size={18} />
                  Return Item
                </button>
              ) : (
                <>
                  {orderCancelled
                    ? null
                    : item.status !== 'Delivered' && (
                        <motion.button
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          whileHover={{ y: -2 }} // slight lift on hover
                          whileTap={{ scale: 0.98 }} // slight shrink on click
                          transition={{ delay: 0.2 }}
                          onClick={() => setIsOpen(true)}
                          disabled={cancelLoading}
                          className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:bg-red-300"
                        >
                          <X size={18} />
                          Cancel Order
                        </motion.button>
                      )}
                </>
              )}
            </div>

            {cancelError && (
              <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r flex items-center gap-2">
                <AlertCircle size={18} />
                <p>{cancelError}</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4 md:space-y-6">
          {/* Payment Summary */}
          <div className="bg-white rounded-xl p-4 md:p-6 border border-gray-200 shadow-sm">
            <h2 className="text-base md:text-lg font-bold text-gray-900 mb-4 md:mb-6 flex items-center gap-2">
              <DollarSign className="text-gray-700 w-4 h-4 md:w-5 md:h-5" />
              Payment Summary
            </h2>

            <div className="text-xs md:text-sm space-y-3">
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <CreditCard size={18} className="text-gray-600" />
                  <span className="text-gray-700">Payment Method</span>
                </div>
                <span className="font-medium text-gray-900">
                  {order.paymentMethod || 'Not specified'}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900 font-medium">
                    ₹{subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-900 font-medium">
                    ₹{shipping.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (12%)</span>
                  <span className="text-gray-900 font-medium">
                    ₹{tax.toFixed(2)}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span className="font-medium">-₹{discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between mt-4 pt-4 border-t border-gray-300">
                  <span className="md:text-lg text-base font-bold text-gray-900">
                    Grand Total
                  </span>
                  <span className="md:text-lg text-base font-bold text-gray-900">
                    ₹{grandTotal.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Details */}
          <div className="bg-white rounded-xl p-2 md:p-6 border border-gray-200 shadow-sm">
            <h2 className="text-base md:text-lg font-bold text-gray-900  flex items-center gap-2">
              <MapPin className="text-gray-700 w-4 h-4 md:w-5 md:h-5" />
              Shipping Details
            </h2>

            <div className="space-y-0 text-xs md:text-sm">
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <User size={18} className="text-gray-600 mt-1" />
                <div>
                  <p className="font-medium text-gray-900">
                    {order.address.fullName}
                  </p>
                  <p className="text-gray-700 mt-1">{order.address.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-2 bg-gray-50 rounded-lg">
                <MapPin size={18} className="text-gray-600 " />
                <div className="text-gray-700">
                  <p>{order.address.street}</p>
                  <p>
                    {order.address.city}, {order.address.state} -{' '}
                    {order.address.zipCode}
                  </p>
                  <p>{order.address.country}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Return Modal */}
      {showReturnModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl">
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
              <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900">
                <RotateCcw size={20} className="text-gray-700" />
                Return Product
              </h2>
              <button
                onClick={() => {
                  setShowReturnModal(false);
                  setReason('');
                  setReturnModal(false);
                }}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>

            {error && (
              <div className="p-3 mb-4 bg-red-50 border-l-4 border-red-500 text-red-700 flex items-center gap-2 rounded-r">
                <AlertCircle size={18} />
                <p>Please provide a reason for the return</p>
              </div>
            )}

            <div className="mb-4">
              <label
                htmlFor="returnReason"
                className="block text-gray-700 mb-2 font-medium"
              >
                Return Reason <span className="text-red-500">*</span>
              </label>
              <textarea
                id="returnReason"
                placeholder="Please explain why you want to return this item..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                rows={4}
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowReturnModal(false);
                  setReason('');
                  setReturnModal(false);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
              >
                Cancel
              </button>
              <button
                disabled={returnDisabled}
                onClick={handleReturnOrder}
                className={`px-4 py-2 ${returnDisabled ? 'cursor-not-allowed bg-gray-800 text-white hover:bg-gray-700' : 'bg-gray-300 text-gray-700'}   rounded-lg  transition-colors`}
              >
                Submit Return
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
