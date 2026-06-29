import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/user/common/Header';
import Promotions from '../../components/user/landing/Promotions';
import NewArivals from '../../components/user/landing/NewArivals';
import Banner from '../../components/user/common/Banner';
import Footer from '../../components/user/common/Footer';
import Saving from '../../components/user/landing/Saving';
import { useDispatch } from 'react-redux';
import { login } from '../../../slices/authSlice';
import { useState } from 'react';
import { verifyUser } from '../../services/authService';

const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get('token');

    if (token) {
      verifyUser()
        .then(({ userId, role, user }) => {
          dispatch(login({ userId, role, user }));
          navigate('/user/home', { replace: true });
        })
        .catch(() => {
          navigate('/', { replace: true });
        });
    }
  }, [location, navigate, dispatch]);

  const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <div className="overflow-x-hidden">
      <Header
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      <div className="max-w-7xl mx-auto w-full">
        <Banner />
        <Saving />
        <NewArivals />
        <div className="px-4 md:px-12 lg:px-20 space-y-12">
          <Promotions />
        </div>
        <Footer />
      </div>
    </div>
  );
};
export default Home;
