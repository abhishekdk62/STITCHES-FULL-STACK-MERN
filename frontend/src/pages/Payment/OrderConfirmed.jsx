import React from 'react';
import Header from '../../components/user/common/Header';
import Footer from '../../components/user/common/Footer';
import Confirmed from '../../components/user/order/Confirmed';

const OrderConfirmed = () => {
  return (
    <div>
      <Header />
      <Confirmed />
      <Footer />
    </div>
  );
};

export default OrderConfirmed;
