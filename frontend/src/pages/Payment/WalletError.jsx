import React from 'react';
import Header from '../../components/user/common/Header';
import Failure from '../../components/user/order/Failure';
import Footer from '../../components/user/common/Footer';
import WalletFailure from '../../components/user/wallet/WalletFailure';
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
