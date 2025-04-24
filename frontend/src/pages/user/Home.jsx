import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../components/user/common/Header";
import Promotions from "../../components/user/landing/Promotions";
import NewArivals from "../../components/user/landing/NewArivals";
import Banner from "../../components/user/common/Banner";
import Footer from "../../components/user/common/Footer";
import CategoryMen from "../../components/user/category/CategoryMen";
import CategoryWomen from "../../components/user/category/CategoryWomen";
import Saving from "../../components/user/landing/Saving";
import Brands from "../../components/user/landing/Brands";
import Trending from "../../components/user/landing/Trending";
import { useDispatch } from "react-redux";
import { login } from "../../../slices/authSlice";
import Gap from "../../components/user/landing/Gap";
import { useState } from "react";
import PromotionalBanner from "../../components/user/common/PromotionalBanner";

const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    // Extract token from the query parameters
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get("token");

    if (token) {
      dispatch(login({ token }));

      localStorage.setItem("token", token);
      // Optionally, remove the token from the URL for cleanliness
      navigate("/user/home", { replace: true });
    }
  }, [location, navigate]);
    const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <div>
      <PromotionalBanner />
      <Header selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />

      <Banner />

   
        <Saving />
        <NewArivals />
      <div className="px-6 md:px-12 lg:px-20 space-y-12">
        <Promotions />
        {/* <Brands /> */}
        {/* <CategoryWomen /> */}
        {/* <Trending /> */}

        {/* <CategoryMen /> */}
      </div>
      <Footer />
    </div>
  );
};
export default Home;
