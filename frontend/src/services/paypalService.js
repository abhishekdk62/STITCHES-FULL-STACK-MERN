export const createPaypalOrder = async (orderDetails) => {
  try {
    const payload = {
      cid: orderDetails.cid,
      cartItems: orderDetails.items,
      address: orderDetails.address,
      paymentMethod: orderDetails.paymentMethod,
      totalPrice: orderDetails.totalPrice,
      tax: orderDetails.tax,
      shippingPrice: orderDetails.shippingPrice,
      grandTotal: orderDetails.grandTotal,
      amount: orderDetails.grandTotal,
      uid: orderDetails.userId,
      returnUrl: orderDetails.returnUrl,
      cancelUrl: orderDetails.cancelUrl,
      couponData: orderDetails.couponData,
      discount: orderDetails.discount,
    };

    const response = await fetch(
      'https://stitches.digital/api/api/paypal/create-order',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    );

    return await response.json();
  } catch (error) {
    console.log('❌ Error creating PayPal order:', error);
    throw error;
  }
};

export const capturePaypalOrder = async (
  orderID,
  orderDetails,
  couponDetails
) => {
  try {
    const response = await fetch(
      `https://stitches.digital/api/api/paypal/capture-order/${orderID}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderDetails, couponDetails), // Send order details along with order ID
      }
    );

    return await response.json();
  } catch (error) {
    console.error('❌ Error capturing PayPal order:', error);
    throw error;
  }
};
