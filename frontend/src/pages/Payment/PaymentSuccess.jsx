import React, { useEffect } from "react";
import Header from "../../components/user/Header";
import Success from "../../components/user/Success";
import Footer from "../../components/user/Footer";
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
    const orderDetails = storedOrderDetails ? JSON.parse(storedOrderDetails) : null;
  
    console.log("📝 Order Details Received:", orderDetails);
  
    if (!orderID || !orderDetails) {
      console.error("❌ Missing orderID or orderDetails. Redirecting to failure.");
      navigate("/payment/failure");
      return;
    }
  
    capturePaypalOrder(orderID, orderDetails)
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
