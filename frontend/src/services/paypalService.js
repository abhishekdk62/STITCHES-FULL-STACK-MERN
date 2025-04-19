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
      returnUrl: orderDetails.returnUrl, // now using /payment/success as provided
      cancelUrl: orderDetails.cancelUrl,
    };

    const response = await fetch("http://localhost:5000/api/paypal/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    return await response.json();
  } catch (error) {
    console.error("❌ Error creating PayPal order:", error);
    throw error;
  }
};

export const capturePaypalOrder = async (orderID, orderDetails) => {
  try {
    const response = await fetch(`http://localhost:5000/api/paypal/capture-order/${orderID}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderDetails), // Send order details along with order ID
    });

    return await response.json();
  } catch (error) {
    console.error("❌ Error capturing PayPal order:", error);
    throw error;
  }
};
