import React, { useEffect } from 'react';
import Header from '../../components/user/common/Header';
import Success from '../../components/user/order/Success';
import Footer from '../../components/user/common/Footer';
import { useSearchParams, useNavigate } from 'react-router-dom';
import WallSuccess from '../../components/user/wallet/WalletSuccess';
import { captureWalletPaymentApi } from '../../services/transactionService';

const WalletSuccuss = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const success = searchParams.get('success');
    const token = searchParams.get('token');

    if (searchParams.get('cancel')) {
      navigate('/wallet/error');
      return;
    }

    if (success && token) {
      captureWalletPaymentApi(token)
        .then((data) => {
          if (data?.success) {
            navigate('/wallet/success');
          } else {
            navigate('/wallet/error');
          }
        })
        .catch(() => {
          navigate('/wallet/error');
        });
    }
  }, [searchParams, navigate]);

  return (
    <div>
      <Header />
      <WallSuccess />
      <Footer />
    </div>
  );
};

export default WalletSuccuss;
