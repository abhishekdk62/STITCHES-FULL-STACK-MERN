import React, { useEffect, useRef, useState } from 'react';
import Header from '../../components/user/common/Header';
import Success from '../../components/user/order/Success';
import Footer from '../../components/user/common/Footer';
import { useLocation, useNavigate } from 'react-router-dom';
import { capturePaypalOrder } from '../../services/paypalService';

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [hide] = useState(true);
  const capturedRef = useRef(false);

  useEffect(() => {
    if (capturedRef.current) return;

    const queryParams = new URLSearchParams(location.search);
    const orderID = queryParams.get('token');

    const storedOrderDetails = localStorage.getItem('orderDetails');
    const storedCouponDetails = localStorage.getItem('coupon');

    const orderDetails = storedOrderDetails
      ? JSON.parse(storedOrderDetails)
      : null;
    const couponDetails = storedCouponDetails
      ? JSON.parse(storedCouponDetails)
      : null;

    if (!orderID || !orderDetails) {
      navigate('/payment/failure');
      return;
    }

    capturedRef.current = true;

    capturePaypalOrder(orderID, orderDetails, couponDetails)
      .then((response) => {
        if (response.success) {
          localStorage.removeItem('orderDetails');
          localStorage.removeItem('coupon');
          navigate('/order/confirmed', { state: { order: response.order } });
        } else {
          navigate('/payment/failure');
        }
      })
      .catch(() => {
        navigate('/payment/failure');
      });
  }, [location, navigate]);

  return (
    <div>
      <Header />
      <Success hide={hide} />
      <Footer />
    </div>
  );
};

export default PaymentSuccess;
