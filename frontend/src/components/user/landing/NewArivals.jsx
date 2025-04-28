import React, { useState, useEffect } from "react";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import CategorySlideShimmer from "../category/CategorySlideShimmer";
import { useNavigate } from "react-router-dom";
import { fetchNewArrivalsService } from "../../../services/productService";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const NewArrivals = () => {
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleProductView = (product) => {
    navigate(`/product/${product._id}`);
  };

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const data = await fetchNewArrivalsService();
        setNewArrivals(data);
      } catch (error) {
        console.error("Error fetching new arrivals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNewArrivals();
  }, []);

  // Custom Arrow Components
  const PrevArrow = ({ onClick }) => (
    <button
      onClick={onClick}
      className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-black text-white p-2 rounded-full hover:bg-gray-800 transition-all"
    >
      <FaChevronLeft className="w-4 h-4" />
    </button>
  );

  const NextArrow = ({ onClick }) => (
    <button
      onClick={onClick}
      className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-black text-white p-2 rounded-full hover:bg-gray-800 transition-all"
    >
      <FaChevronRight className="w-4 h-4" />
    </button>
  );

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5, // Default for larger screens
    slidesToScroll: 1,
    draggable: true,
    swipeToSlide: true,
    prevArrow: <PrevArrow />, // Left Arrow
    nextArrow: <NextArrow />, // Right Arrow
    responsive: [
      {
        breakpoint: 1024, // For screens below 1024px
        settings: {
          slidesToShow: 3,
          draggable: true,
          swipeToSlide: true,
        },
      },
      {
        breakpoint: 768, // For screens below 768px (md)
        settings: {
          slidesToShow: 2, // Show only 2 items
          draggable: true,
          swipeToSlide: true,
        },
      },
      {
        breakpoint: 480, // For screens below 480px
        settings: {
          slidesToShow: 2, // Show only 1 item
          draggable: true,
          swipeToSlide: true,
        },
      },
    ],
  };

  return (
    <section className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-center my-4">
        <div className="flex mb-8 items-center w-full max-w-6xl">
          <div className="flex-grow border-t-2 border-gray-300"></div>
          <h1
            style={{ fontFamily: "'Cambay', sans-serif" }}
            className="md:text-2xl mx-6 text-gray-600 whitespace-nowrap"
          >
            New Arrivals
          </h1>
          <div className="flex-grow border-t-2 border-gray-300"></div>
        </div>
      </div>

      {loading ? (
        <CategorySlideShimmer />
      ) : (
        <div className="relative">
          <Slider {...sliderSettings}>
            {newArrivals.map((product) => (
              <div
                onClick={() => handleProductView(product)}
                key={product?._id}
                className="p-3 group cursor-pointer"
              >
                <div className="flex items-center justify-center">
                  <div className="md:w-100 md:h-100">
                    <img
                      src={product?.variants[0]?.productImages?.[0]}
                      alt={product?.name}
                      className="w-full h-full object-cover transition duration-300 ease-in-out group-hover:brightness-75"
                    />
                  </div>
                </div>
                <p
                  style={{ fontFamily: "'Cambay', sans-serif" }}
                  className="mt-2 text-center text-gray-700 text-sm"
                >
                  {product?.name}
                </p>
              </div>
            ))}
          </Slider>
        </div>
      )}
    </section>
  );
};

export default NewArrivals;
