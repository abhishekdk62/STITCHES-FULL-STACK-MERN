import apiClient from './apiClient';

export const createOrder = async (
  cartid,
  cartItems,
  address,
  paymentMethod,
  totalPrice,
  tax,
  shippingPrice,
  grandTotal,
  discount,
  couponData
) => {
  try {
    const response = await apiClient.post('/user/order', {
      cartid,
      cartItems,
      address,
      paymentMethod,
      totalPrice,
      tax,
      shippingPrice,
      grandTotal,
      discount,
      couponData,
    });
    return response;
  } catch (error) {
    throw error;
  }
};
export const fetchOrders = async () => {
  try {
    const response = await apiClient.get(`/user/orders/`);
    return response.data.data || [];
  } catch (error) {
    throw error;
  }
};

export const fetchOrdersAdmin = async (search = '', page = 1) => {
  try {
    const response = await apiClient.get('/admin/orders', {
      params: {
        search,
        page,
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const cancelOrder = async (
  orderId,
  productId,
  variantId,
  quantity,
  paymentMethod,
  grandTotal
) => {
  try {
    const response = await apiClient.put(`/user/orders/${orderId}`, {
      productId,
      variantId,
      quantity,
      paymentMethod,
      grandTotal,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const editProdDeliveryInfo = async (
  orderID,
  product,
  variant,
  status
) => {
  try {
    const response = await apiClient.put('/admin/prod', {
      orderID,
      product,
      variant,
      status,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const returnRequest = async (
  orderId,
  productId,
  variantId,
  reason,
  quantity
) => {
  try {
    const response = await apiClient.post('/user/return', {
      orderId,
      productId,
      variantId,
      reason,
      quantity,
    });
  } catch (error) {
    throw error;
  }
};

export const fetchReturnReqAPI = async () => {
  try {
    const response = await apiClient.get('/admin/returnreq');
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const checkForReturn = async (orderId, productId, variantId) => {
  try {
    const response = await apiClient.get(
      `/user/checkReturns?oid=${orderId}&pid=${productId}&vid=${variantId}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const approveReturnAPI = async (
  requestId,
  userId,
  rate,
  quantity,
  pid,
  vid
) => {
  try {
    const response = await apiClient.put('/admin/approveReturn', {
      requestId,
      userId,
      rate,
      quantity,
      pid,
      vid,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const rejectReturnAPI = async (requestId) => {
  try {
    const response = await apiClient.put('/admin/rejectReturn', {
      requestId,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
