import React from "react";
import Header from "../../components/user/Header";
import Failure from "../../components/user/Failure";
import Footer from "../../components/user/Footer";
import WalletFailure from "../../components/user/WalletFailure";
const WalletError = () => {
  return (
    <div>
      <Header />
      <WalletFailure />
      <Footer />
    </div>
  );
};

export default WalletError;
