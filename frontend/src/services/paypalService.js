import apiClient from "./apiClient";

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

    const response = await apiClient.post("/api/paypal/create-order",JSON.stringify(payload)) 

    return response.data;
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
    const response = await apiClient.post(`api/paypal/capture-order/${orderID}`,JSON.stringify(orderDetails, couponDetails)) 
    
    return  response.data;
  } catch (error) {
    console.error('❌ Error capturing PayPal order:', error);
    throw error;
  }
};
