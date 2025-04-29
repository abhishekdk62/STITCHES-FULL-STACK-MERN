import React, { useEffect, useState, useCallback } from 'react';

import { useSelector } from 'react-redux';
import { createPaypalOrder } from '../src/services/paypalService';

export default function PayPalButton({
  grandTotal,
  paymentMethod,
  couponData,
  discount,
}) {
  const [errorMessage, setErrorMessage] = useState('');
  const [sdkLoaded, setSdkLoaded] = useState(false);

  const userDetails = useSelector((state) => state.auth.user);
  const address = useSelector((state) => state.checkout.shippingAddress);
  const cartItems = useSelector((state) => state.checkout.cart);

  useEffect(() => {
    const loadPaypalScript = () => {
      if (document.getElementById('paypal-sdk')) {
        setSdkLoaded(true);
        return;
      }

      const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID;
      if (!PAYPAL_CLIENT_ID) {
        console.error('❌ Missing PayPal Client ID.');
        setErrorMessage('Missing PayPal Client ID.');
        return;
      }

      console.log('ℹ️ Loading PayPal SDK...');
      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}`;
      script.id = 'paypal-sdk';
      script.async = true;
      script.onload = () => {
        console.log('✅ PayPal SDK Loaded');
        setSdkLoaded(true);
      };
      script.onerror = () => {
        console.error('❌ Failed to load PayPal SDK.');
        setErrorMessage('Failed to load PayPal SDK.');
      };

      document.body.appendChild(script);
    };

    loadPaypalScript();
  }, []);

  const handlePaypalPayment = useCallback(async () => {
    setErrorMessage('');

    if (!cartItems || !cartItems.items || cartItems.items.length === 0) {
      setErrorMessage('Cart is empty. Add items before proceeding.');
      return;
    }

    try {
      const returnUrl = `${window.location.origin}/payment/success`;
      const cancelUrl = `${window.location.origin}/payment/failure`;

      const orderDetails = {
        cid: cartItems._id,
        items: cartItems.items.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
          price: item.price,
        })),
        address,
        paymentMethod,
        totalPrice: cartItems.totalPrice,
        tax: cartItems.tax,
        shippingPrice: cartItems.shippingPrice,
        grandTotal,
        userId: userDetails?._id,
        returnUrl,
        cancelUrl,
        couponData,
        discount,
      };

      console.log('💾 Storing Order Details in Local Storage:', orderDetails);
      localStorage.setItem('orderDetails', JSON.stringify(orderDetails));
      localStorage.setItem('coupon', JSON.stringify({ couponData, discount }));

      const data = await createPaypalOrder(orderDetails);
      console.log('🔍 PayPal Order Response:', data);

      if (!data.approvalUrl) {
        setErrorMessage('No approval URL returned. Please try again.');
        return;
      }

      console.log('✅ Redirecting to PayPal:', data.approvalUrl);
      window.location.href = data.approvalUrl;
    } catch (error) {
      console.error('❌ PayPal Payment Error:', error);
      setErrorMessage(
        'There was an error initiating PayPal payment. Please try again.'
      );
    }
  }, [cartItems, address, paymentMethod, grandTotal, userDetails]);

  return (
    <div className="text-center">
      {errorMessage && <p className="text-red-600">{errorMessage}</p>}
      <button
        type="button"
        onClick={handlePaypalPayment}
        className={`${
          sdkLoaded
            ? 'flex items-center justify-center bg-yellow-400 px-3 py-2 hover:bg-yellow-500 text-white font-semibold rounded transition-colors'
            : 'bg-gray-400 text-gray-700 flex items-center cursor-not-allowed font-semibold py-2 px-6 rounded shadow-md transition-colors'
        }`}
        disabled={!sdkLoaded}
      >
        <img
          src="https://www.paypalobjects.com/paypal-ui/logos/svg/paypal-color.svg"
          height="130"
          width="130"
          alt="PayPal Logo"
          className="mr-2"
        />
      </button>
    </div>
  );
}
