import React, { useEffect } from "react";
import Header from "../../components/user/common/Header";
import Success from "../../components/user/order/Success";
import Footer from "../../components/user/common/Footer";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

import WallSuccess from "../../components/user/wallet/WalletSuccess";
import { captureWalletPaymentApi } from "../../services/transactionService";

const WalletSuccuss = () => {


    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const success = searchParams.get("success");
        const token = searchParams.get("token");
        const userId = searchParams.get("userId");
    
        if (success && token && userId) {
          captureWalletPaymentApi(token, userId)
            .then((data) => {
             
              navigate("/wallet/payed");
            })
            .catch((error) => {
              console.error("Error capturing payment:", error);
            
              navigate("/wallet/payed");
            });
        }
      }, [searchParams]);
    
  return (
    <div>
      <Header />
      <WallSuccess />
      <Footer />
    </div>
  );
};

export default WalletSuccuss;
