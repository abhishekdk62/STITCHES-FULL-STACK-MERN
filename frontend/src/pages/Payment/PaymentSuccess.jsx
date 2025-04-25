import React, { useEffect } from "react";
import Header from "../../components/user/common/Header";
import Success from "../../components/user/order/Success";
import Footer from "../../components/user/common/Footer";
import { useLocation, useNavigate } from "react-router-dom";
import { capturePaypalOrder } from "../../services/paypalService";

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const orderID = queryParams.get("token");
  
    console.log("✅ PaymentSuccess Component Loaded");
    console.log("🔍 Extracted orderID:", orderID);
  
    const storedOrderDetails = localStorage.getItem("orderDetails");



    const storedCouponDetails = localStorage.getItem("coupon");



    const orderDetails = storedOrderDetails ? JSON.parse(storedOrderDetails) : null;
    const couponDetails = storedCouponDetails ? JSON.parse(storedCouponDetails) : null;
  
    console.log("📝 Order Details Received:", orderDetails);
  
    if (!orderID || !orderDetails||!couponDetails) {
      console.error("❌ Missing orderID or orderDetails or couponDetails. Redirecting to failure.");
      navigate("/payment/failure");
      return;
    }
  
    capturePaypalOrder(orderID, orderDetails,couponDetails)
      .then((response) => {
        console.log("✅ Capture Response:", response);
  
        if (response.success) {
          localStorage.removeItem("orderDetails"); 
          navigate("/order/confirmed", { state: { order: response.order } });
        } else {
          console.error("❌ Capture failed. Redirecting to failure.");
          navigate("/payment/failure");
        }
      })
      .catch((error) => {
        console.error("❌ Error capturing order:", error);
        navigate("/payment/failure");
      });
  }, [location, navigate]);
  

  return (
    <div>
      <Header />
      <Success />
      <Footer />
    </div>
  );
};

export default PaymentSuccess;
