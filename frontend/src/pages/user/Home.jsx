import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../components/user/Header";
import Promotions from "../../components/user/Promotions";
import NewArivals from "../../components/user/NewArivals";
import Banner from "../../components/user/Banner";
import Footer from "../../components/user/Footer";
import CategoryMen from "../../components/user/CategoryMen";
import CategoryWomen from "../../components/user/CategoryWomen";
import Saving from "../../components/user/Saving";
import Brands from "../../components/user/Brands";
import Trending from "../../components/user/Trending";
import { useDispatch } from "react-redux";
import { login } from "../../../slices/authSlice";
import Gap from "../../components/user/Gap";

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

  return (
    <div>
      <Header />
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
