import React from 'react';
import Header from '../../components/user/common/Header';
import Failure from '../../components/user/order/Failure';
import Footer from '../../components/user/common/Footer';
const PaymentFailure = () => {
  return (
    <div>
      <Header />
      <Failure />
      <Footer />
    </div>
  );
};

export default PaymentFailure;
