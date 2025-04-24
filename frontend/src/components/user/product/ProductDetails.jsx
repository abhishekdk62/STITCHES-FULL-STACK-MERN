import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { addToCartApi } from "../../../services/userService";
import { addToWishlist } from "../../../services/wishlistService";
import { useParams } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ReactImageMagnify from "react-image-magnify";
import { toast } from "react-hot-toast";

import { Star } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import AlertDialog from "../Popup";
import {
  addReview,
  checkInCartApi,
  fetchProductReviews,
  getCategoryName,
  getProductById,
  getProductRating,
  getSimilarProducts,
} from "../../../services/productService";

import { setSelectedTab } from "../../../../slices/selectedTabSlice";

const ProductDetails = () => {
  const userDetails = useSelector((state) => state.auth.user);
  const [showWishlistAlert, setShowWishlistAlert] = useState(false);
  const [productDetails, setProductDetails] = useState(null);
  const [selectedTabSmall, setSelectedTabSmall] = useState("Description");
  const [userInfo, setUserInfo] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState();
  const [catDetails, setCatDetails] = useState();
  const [selectedImage, setSelectedImage] = useState(null);
  const [stockMessage, setStockMessage] = useState("");
  const [stockMessageColor, setStockMessageColor] = useState("");
  const [loading, setLoding] = useState(false);
  const [isCarted, setIsCarted] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const user = useSelector((state) => state.auth.user);

  const [reviews, setReviews] = useState([
    { id: 1, name: "John Doe", rating: 4, text: "Great product!" },
  ]);
  const [newReview, setNewReview] = useState({ rating: 3, text: "" });
  const navigate = useNavigate();
  const { id } = useParams();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const userId = useSelector((state) => state.auth.userId);

  const prodById = async (id) => {
    try {
      const product = await getProductById(id);
      setProductDetails(product);
    } catch (error) {
      console.log(error);
      if (error.response.data.message == "Product not found") {
        navigate("/products");
      }
    }
  };

  const handleWishlist = async () => {
    if (!userDetails) {
      setShowWishlistAlert(true); 
      return;
    }
    try {
      const response = await addToWishlist(productDetails._id, selectedVariant);
      toast.success(response.data.message, {
        icon: (
          <img
            src="https://static.thenounproject.com/png/29520-200.png"
            className="animate-bounce"
            style={{ filter: "invert(1)" }}
            alt="Success Icon"
            width="30"
            height="30"
          />
        ),
        style: {
          border: "1px solid #0f5132",
          padding: "16px",
          color: "white",
          background: "black",
          fontSize: "14px",
          fontWeight: "bold",
        },
      });

      console.log(response);
    } catch (error) {

      toast.error(error.response.data.message, {
        icon: (
          <img
            src="https://static.thenounproject.com/png/3941-200.png"
            className="animate-bounce"
            style={{ filter: "invert(1)" }}
            alt="Success Icon"
            width="30"
            height="30"
          />
        ),
        style: {
          padding: "16px",
          color: "white",
          background: "#ff6666",
          fontSize: "14px",
          fontWeight: "bold",
        },
      });



      console.log(error);
    }
  };
  const [err, setErr] = useState(false);
  useEffect(() => {
    if (id) {
      prodById(id);
    }
  }, [id]);

  const fetchReviews = async () => {
    try {
      const reviews = await fetchProductReviews(productDetails._id);
      setReviews(reviews);
      
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddReview = async () => {
    if (productDetails && userId) {
      try {
        if (!newReview.text) {
          setErr(true);

          return;
        }

        const response = await addReview(
          newReview,
          productDetails?._id,
          userId
        );

        if (response.status === 200) {
          toast.success("Review Added", {
            icon: (
              <img
                src="https://static.thenounproject.com/png/29520-200.png"
                className="animate-spin"
                style={{ filter: "invert(1)" }}
                alt="Success Icon"
                width="30"
                height="30"
              />
            ),
            style: {
              border: "1px solid #0f5132",
              padding: "16px",
              color: "white",
              background: "black",
              fontSize: "14px",
              fontWeight: "bold",
            },
          });
        }
        fetchReviews();
        setNewReview((prevReview) => ({ ...prevReview, text: "" }));
      } catch (error) {
        if (error.response.status == 409) {
          toast.error(error.response.data.message, {
            icon: (
              <img
                src="https://static.thenounproject.com/png/3941-200.png"
                className="animate-bounce"
                style={{ filter: "invert(1)" }}
                alt="Success Icon"
                width="30"
                height="30"
              />
            ),
            style: {
              padding: "16px",
              color: "white",
              background: "#ff6666",
              fontSize: "14px",
              fontWeight: "bold",
            },
          });
        }
        setNewReview((prevReview) => ({ ...prevReview, text: "" }));

        console.log(error);
      }
    }
  };

  useEffect(() => {
    if (!productDetails?.category) return;

    const fetchCategoryDetails = async () => {
      try {
        const categoryDetails = await getCategoryName(productDetails.category);
        setCatDetails(categoryDetails);
      } catch (error) {
        console.log(error);
      }
    };

    fetchCategoryDetails();
  }, [productDetails]);

  useEffect(() => {
    if (productDetails && productDetails._id) {
      fetchReviews();
    }
  }, [productDetails]);

  const handleProductView = (product) => {
    prodById(product._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    if (!productDetails) return;

    setLoding(true);

    // Retrieve user info
    const user = localStorage.getItem("user");
    const parsedUser = JSON.parse(user);
    setUserInfo(parsedUser);

    const fetchSimilarProducts = async () => {
      try {
        const similarProducts = await getSimilarProducts(
          productDetails.category._id
        );
        setSimilarProducts(similarProducts);
      } catch (error) {
        console.log(error);
      } finally {
        setLoding(false);
      }
    };

    fetchSimilarProducts();
  }, [productDetails]);

  const [rating, setRating] = useState([
    { _id: 0, averageRating: 0, totalReviews: 0 },
  ]);

  const checkInCart = async () => {
    try {
      {
        const response = await checkInCartApi(
          productDetails?._id,
          selectedVariant?._id
        );
        setIsCarted(response.inCart);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    checkInCart();
  }, [selectedVariant, productDetails]);
  const addToCart = async () => {
    if (!userDetails) {
      toast.error("Please Login First", {
        icon: (
          <img
            src="https://static.thenounproject.com/png/217675-200.png"
            className="animate-pulse"
            style={{ filter: "invert(1)" }}
            alt="Success Icon"
            width="30"
            height="30"
          />
        ),
        style: {
          border: "1px solid #0f5132",
          padding: "16px",
          color: "white",
          background: "#ff5252",
          fontSize: "14px",
          fontWeight: "bold",
        },
      });
      return;
    }

    if (!selectedVariant) {
      alert("Please select a variant.");
      return;
    }
    // Assume quantity is 1 (or you can have an input for quantity)
    const quantity = 1;
    try {
      const response = await addToCartApi(
        productDetails._id,
        selectedVariant._id,
        quantity
      );
      console.log(response.message);
      toast.success("Added to Cart", {
        icon: (
          <img
            src="https://static.thenounproject.com/png/247537-200.png"
            className="animate-spin"
            style={{ filter: "invert(1)" }}
            alt="Success Icon"
            width="30"
            height="30"
          />
        ),
        style: {
          border: "1px solid #0f5132",
          padding: "16px",
          color: "white",
          background: "black",
          fontSize: "14px",
          fontWeight: "bold",
        },
        autoClose: 5000,
      });

      checkInCart();
    } catch (error) {
      toast.error(error.message, {
        icon: (
          <img
            src="https://static.thenounproject.com/png/217675-200.png"
            className="animate-pulse"
            style={{ filter: "invert(1)" }}
            alt="Success Icon"
            width="30"
            height="30"
          />
        ),
        style: {
          border: "1px solid #0f5132",
          padding: "16px",
          color: "white",
          background: "#ff5252",
          fontSize: "14px",
          fontWeight: "bold",
        },
      });
    }
  };

  useEffect(() => {
    const fetchRating = async () => {
      try {
        const productRating = await getProductRating(productDetails._id);
        setRating(productRating);
      } catch (error) {
        console.log(error);
      }
    };
    if (productDetails) {
      fetchRating();
    }
  }, []);

  const [isOutOfStock, setIsOutOfStock] = useState(false);

  useEffect(() => {
    if (productDetails) {
      const stockNumber = selectedVariant?.stock;

      if (stockNumber === 0) {
        // Check for 0 first
        setStockMessage("Out of Stock");
        setStockMessageColor("red");
        setIsOutOfStock(true);
      } else if (stockNumber < 5) {
        setStockMessage("Only a few left, hurry up!");
        setStockMessageColor("orange");
        setIsOutOfStock(false);
      } else {
        setStockMessage("In Stock");
        setStockMessageColor("green");
        setIsOutOfStock(false);
      }
    }
  }, [productDetails, selectedVariant, selectedVariant?.stock]); // Add dependency array

  const variantsByColor = useMemo(() => {
    return (
      productDetails?.variants.reduce((acc, variant) => {
        if (!acc[variant.color]) {
          acc[variant.color] = [];
        }
        acc[variant.color].push(variant);
        return acc;
      }, {}) || {}
    );
  }, [productDetails]);

  // Once productDetails and variantsByColor are available, set the initial selected color.
  useEffect(() => {
    if (productDetails && Object.keys(variantsByColor).length > 0) {
      const initialColor = Object.keys(variantsByColor)[0];
      setSelectedColor(initialColor);
      const uniqueSizes = [
        ...new Set(variantsByColor[initialColor].map((v) => v.size)),
      ];
      if (uniqueSizes.length > 0) {
        setSelectedSize(uniqueSizes[0]);
      }
    }
  }, [productDetails, variantsByColor]);

  const [showAlert, setShowAlert] = useState(false);

  const handleSubmitReview = () => {
    if (isAuthenticated) {
      handleAddReview();
    } else {
      setShowAlert(true);
    }
  };
  const dispatch = useDispatch();

  useEffect(() => {
    if (selectedColor && selectedSize && variantsByColor[selectedColor]) {
      const variant = variantsByColor[selectedColor].find(
        (v) => v.size === selectedSize
      );
      setSelectedVariant(variant);
      
    }
  }, [selectedColor, selectedSize, variantsByColor]);

  if (!productDetails) {
    return <div>Loading...</div>;
  }
  // Return a loading state until productDetails is available
  if (!productDetails) {
    return <ProductDetailShimmer />;
  }

  const stockColors = {
    green: "text-green-500",
    orange: "text-orange-500",
    red: "text-red-500",
  };
  const rat =
    rating.length > 0 && rating[0]?.averageRating
      ? rating[0].averageRating.toFixed(1)
      : "N/A";

  const handleCrumbsByCat = () => {
    navigate(`/products?category=${encodeURIComponent(catDetails._id)}`);
  };
  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      {showWishlistAlert && (
        <AlertDialog
          title="Sign In Required"
          message="Please log in to add items to your wishlist"
          onClose={() => setShowWishlistAlert(false)}
        />
      )}
  
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center text-xs mb-4 text-gray-500">
        <a onClick={() => navigate("/products")} className="cursor-pointer hover:text-black transition-colors">
          Shop
        </a>
        <span className="mx-2">&gt;</span>
        <a onClick={handleCrumbsByCat} className="cursor-pointer hover:text-black transition-colors">
          {catDetails?.name}
        </a>
        <span className="mx-2">&gt;</span>
        <a className="text-gray-800">
          {productDetails?.subCategory}
        </a>
      </nav>
  
      {/* Product Main Section */}
      <div className="flex flex-col lg:flex-row bg-white rounded-md shadow-md overflow-hidden border border-gray-100">
        {/* Product Images - Keeping original positioning */}
        <div className="flex flex-col gap-4 items-center lg:w-1/2 p-6 bg-gray-50">
          <div className="h-100 w-95 relative">
            <ReactImageMagnify
              {...{
                smallImage: {
                  alt: "Main product image",
                  height: 400,
                  width: 309,
                  src: selectedImage || productDetails?.variants[0]?.productImages[0],
                },
                largeImage: {
                  src: selectedImage || productDetails?.variants[0]?.productImages[0],
                  width: 1200,
                  height: 1200,
                },
                enlargedImageContainerDimensions: {
                  width: "270%",
                  height: "150%",
                },
                lensStyle: { backgroundColor: "rgba(0,0,0,0.2)" },
              }}
            />
          </div>
          
          <div className="flex gap-3">
            {selectedVariant?.productImages?.map((productImage, index) => (
              <div
                key={index}
                onClick={() => setSelectedImage(productImage)}
                className={`cursor-pointer transition-all ${selectedImage === productImage ? 'ring-1 ring-black' : ''}`}
              >
                <img
                  alt={`Product view ${index + 1}`}
                  className="w-16 h-16 object-cover rounded-sm"
                  src={productImage}
                />
              </div>
            ))}
          </div>
        </div>
  
        {/* Product Details */}
        <div className="lg:w-1/2 p-6">
          <h1 className="text-xl font-semibold mb-2 text-gray-900">{productDetails?.name}</h1>
          
          {/* Pricing Section */}
          <div className="flex items-end gap-2 mb-3">
            <span className="text-2xl font-bold text-black">₹{selectedVariant?.discount_price}</span>
            <span className="text-sm text-gray-400 line-through">₹{selectedVariant?.base_price}</span>
            <span className="text-sm font-medium text-green-600 ml-1">
              ({selectedVariant?.discount_percentage}% OFF)
            </span>
          </div>
  
          {/* Rating Section */}
          <div className="flex items-center mb-4">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => {
                if (i < Math.floor(rat)) {
                  return <i key={i} className="fas fa-star text-xs"></i>; // Full star
                } else if (i === Math.floor(rat) && rat % 1 !== 0) {
                  return <i key={i} className="fas fa-star-half-alt text-xs"></i>; // Half star
                } else {
                  return <i key={i} className="far fa-star text-xs"></i>; // Empty star
                }
              })}
            </div>
            <span className="ml-2 text-xs text-gray-700">{rat}</span>
            <span className="ml-1 text-xs text-gray-500">({rating[0]?.totalReviews} Reviews)</span>
          </div>
  
          {/* Size Selection */}
          {selectedColor && (
            <div className="mb-4">
              <h2 className="text-sm font-medium mb-2 flex items-center">
                <span className="mr-2">Select Size</span>
                <button className="text-xs text-gray-500 underline hover:text-black">Size Guide</button>
              </h2>
              <div className="flex flex-wrap gap-2">
                {[...new Set(variantsByColor[selectedColor]?.map((v) => v.size))].map((size, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedSize(size)}
                    className={`px-3 py-1 text-xs border transition-all ${
                      selectedSize === size
                        ? "bg-black text-white border-black"
                        : "bg-white text-gray-700 border-gray-300 hover:border-black"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}
  
          {/* Color Selection */}
          <div className="mb-4">
            <h2 className="text-sm font-medium mb-2">Select Color</h2>
            <div className="flex flex-wrap gap-2">
              {Object.keys(variantsByColor).map((color) => (
                <button
                  key={color}
                  onClick={() => {
                    setSelectedColor(color);
                    const defaultImage = variantsByColor[color][0]?.productImages[0];
                    setSelectedImage(defaultImage);
  
                    const uniqueSizes = [...new Set(variantsByColor[color].map((v) => v.size))];
                    if (uniqueSizes.length > 0) {
                      setSelectedSize(uniqueSizes[0]);
                    }
                  }}
                  className={`w-8 h-8 rounded-full transition-transform hover:scale-105 ${
                    selectedColor === color ? "ring-2 ring-offset-1 ring-black" : "border border-gray-300"
                  }`}
                  style={{ backgroundColor: color }}
                  aria-label={color}
                ></button>
              ))}
            </div>
          </div>
  
          {/* Stock Message */}
          <h2 className={`font-medium text-xs mb-4 ${stockColors[stockMessageColor]}`}>
            {stockMessage}
          </h2>
  
          {/* Action Buttons */}
          <div className="flex items-center mb-6 gap-3">
            {isCarted ? (
              <button
                className="flex items-center justify-center gap-1 px-6 py-2 rounded-sm bg-black text-white text-sm font-medium transition-opacity hover:opacity-80"
                onClick={() => {
                  dispatch(setSelectedTab("cart"));
                  navigate("/user/account");
                }}
              >
                View Cart
                <ShoppingCart size={16} />
              </button>
            ) : (
              <button
                onClick={addToCart}
                disabled={isOutOfStock}
                className={`flex items-center justify-center gap-1 px-6 py-2 rounded-sm text-sm font-medium transition-all ${
                  isOutOfStock
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-black text-white hover:bg-gray-900"
                }`}
              >
                Add to Cart
                <ShoppingCart size={16} />
              </button>
            )}
            
            <button
              onClick={handleWishlist}
              className="group p-2 rounded-sm border border-gray-200 hover:border-gray-900 transition-colors"
              aria-label="Add to wishlist"
            >
              <Heart
                className="text-pink-500"
                style={{ fill: "none" }}
                size={18}
              />
            </button>
          </div>
  
          {/* Product Features */}
          <div className="grid grid-cols-2 gap-y-2 gap-x-4 border-t pt-4 border-gray-200">
            <div className="flex items-center">
              <i className="fas fa-shield-alt text-gray-800 mr-2 text-sm"></i>
              <span className="text-xs text-gray-700">Secure Payment</span>
            </div>
            <div className="flex items-center">
              <i className="fas fa-ruler-combined text-gray-800 mr-2 text-sm"></i>
              <span className="text-xs text-gray-700">Size & Fit Guide</span>
            </div>
            <div className="flex items-center">
              <i className="fas fa-truck text-gray-800 mr-2 text-sm"></i>
              <span className="text-xs text-gray-700">Free Express Shipping</span>
            </div>
            <div className="flex items-center">
              <i className="fas fa-undo text-gray-800 mr-2 text-sm"></i>
              <span className="text-xs text-gray-700">30-Day Returns</span>
            </div>
          </div>
        </div>
      </div>
  
      {/* Product Information Tabs */}
      <div className="bg-white rounded-md shadow-md mt-6 overflow-hidden border border-gray-100">
        <div className="border-b border-gray-200">
          <div className="flex">
            {["Description", "Reviews", "Question&Answer"].map((tab, indx) => (
              <button
                key={indx}
                onClick={() => setSelectedTabSmall(tab)}
                className={`py-3 px-4 text-sm font-medium transition-colors ${
                  tab === selectedTabSmall
                    ? "text-black border-b-2 border-black"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
  
        <div className="p-4">
          {/* Description Tab */}
          {selectedTabSmall === "Description" && (
            <div className="text-sm text-gray-700">
              <p className="leading-relaxed">{productDetails.description}</p>
              
              <div className="mt-6">
                <h3 className="text-sm font-semibold mb-3">Product Specifications</h3>
                <div className="bg-gray-50 rounded-sm p-3">
                  <table className="w-full text-left text-xs text-gray-700">
                    <tbody>
                      <tr className="border-b border-gray-200">
                        <th className="py-2 pr-4 font-medium">Fabric</th>
                        <td className="py-2 pr-6">Bio-washed Cotton</td>
                        <th className="py-2 pr-4 font-medium">Pattern</th>
                        <td className="py-2 pr-6">Printed</td>
                        <th className="py-2 pr-4 font-medium">Fit</th>
                        <td className="py-2">Regular-fit</td>
                      </tr>
                      <tr>
                        <th className="py-2 pr-4 font-medium">Neck</th>
                        <td className="py-2 pr-6">Round Neck</td>
                        <th className="py-2 pr-4 font-medium">Sleeve</th>
                        <td className="py-2 pr-6">Half-sleeves</td>
                        <th className="py-2 pr-4 font-medium">Style</th>
                        <td className="py-2">Casual Wear</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
  
          {/* Reviews Tab */}
          {selectedTabSmall === "Reviews" && (
            <div>
              <h2 className="text-base font-semibold mb-4">Customer Reviews</h2>
  
              {/* Review List */}
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div
                    key={review._id}
                    className="flex gap-3 p-3 border border-gray-100 rounded-sm"
                  >
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                      <img
                        src={review?.userId?.profileImage}
                        alt="Reviewer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={12}
                            className={
                              i < review.rating
                                ? "text-yellow-500 fill-yellow-500"
                                : "text-gray-300"
                            }
                          />
                        ))}
                      </div>
                      <p className="text-xs text-gray-700 mt-1 mb-2">{review.comment}</p>
                      <div className="flex justify-between items-center text-xxs text-gray-500">
                        <p>{review.userId.email}</p>
                        <p>{review.updatedAt.split("T")[0]}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
  
              {/* Add New Review */}
              <div className="mt-6 p-4 border border-gray-200 rounded-sm">
                <h3 className="text-sm font-semibold mb-3">Write a Review</h3>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 flex items-center justify-center">
                    {user?.profileImage ? (
                      <img
                        src={user.profileImage}
                        alt="Your Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-500 text-xs">You</span>
                    )}
                  </div>
  
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setNewReview({ ...newReview, rating: i + 1 })}
                        className="focus:outline-none"
                      >
                        <Star
                          size={16}
                          className={
                            i < newReview.rating
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300 hover:text-gray-400"
                          }
                        />
                      </button>
                    ))}
                  </div>
                </div>
                
                <textarea
                  className="w-full p-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-black"
                  placeholder="Share your experience with this product..."
                  rows={3}
                  value={newReview.text}
                  onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
                ></textarea>
                
                {err && (
                  <p className="text-red-500 text-xs mt-1">
                    Please write your review before submitting
                  </p>
                )}
                
                <button
                  className="mt-3 px-4 py-2 bg-black text-white text-xs font-medium rounded-sm hover:bg-gray-900 transition-colors"
                  onClick={handleSubmitReview}
                >
                  Submit Review
                </button>
              </div>
            </div>
          )}
  
          {/* Q&A Tab */}
          {selectedTabSmall === "Question&Answer" && (
            <div className="py-4">
              <div className="flex flex-col items-center justify-center py-6 text-gray-600">
                <i className="fas fa-comments text-3xl mb-3 text-gray-400"></i>
                <p className="text-sm">No questions yet. Be the first to ask!</p>
                <button className="mt-3 px-4 py-2 bg-black text-white text-xs rounded-sm hover:bg-gray-900 transition-colors">
                  Ask a Question
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
  
      {/* Similar Products */}
      <div className="bg-white rounded-md shadow-md mt-6 p-4 border border-gray-100">
        <h2 className="text-base font-bold mb-4">You May Also Like</h2>
        {loading ? (
          <SimilarProductsShimmer />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {similarProducts.map((product, index) => (
              <div
                key={index}
                onClick={() => handleProductView(product)}
                className="bg-white overflow-hidden border border-gray-100 transition-all hover:shadow-md cursor-pointer"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    alt={product?.name}
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                    src={product?.variants[0]?.productImages[0]}
                  />
                </div>
                <div className="p-3">
                  <h3 className="text-xs font-medium text-gray-800 mb-1 truncate">{product?.name}</h3>
                  <p className="text-xs text-gray-500 mb-1">{product?.brand}</p>
                  <p className="text-sm font-bold text-black">₹{product?.variants[0]?.discount_price}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;

const ProductDetailShimmer = () => {
  return (
    <div className="container mx-auto p-4">
      {/* Breadcrumb */}
      <nav className="mb-4">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-2 animate-pulse"></div>
      </nav>
      <div className="flex flex-col lg:flex-row bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col items-center lg:w-1/2">
          <div className="w-full h-64 bg-gray-200 rounded-lg mb-4 animate-pulse"></div>
          <div className="flex space-x-2">
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="w-16 h-16 bg-gray-200 rounded-lg animate-pulse"
                ></div>
              ))}
          </div>
        </div>
        {/* Product Details */}
        <div className="lg:w-1/2 lg:pl-8">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-4 animate-pulse"></div>
          <div className="flex items-center mb-4 space-x-2">
            <div className="flex space-x-1">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className="h-4 w-4 bg-gray-200 rounded-full animate-pulse"
                  ></div>
                ))}
            </div>
            <div className="h-4 bg-gray-200 rounded w-10 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
          </div>
          <div className="mb-4">
            <div className="h-5 bg-gray-200 rounded w-1/4 mb-2 animate-pulse"></div>
            <div className="flex space-x-2">
              {["XS", "S", "M", "L", "XL"].map((_, index) => (
                <div
                  key={index}
                  className="h-8 w-8 bg-gray-200 rounded animate-pulse"
                ></div>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <div className="h-5 bg-gray-200 rounded w-1/3 mb-2 animate-pulse"></div>
            <div className="flex space-x-2">
              {Array(4)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"
                  ></div>
                ))}
            </div>
          </div>
          <div className="flex items-center mb-4">
            <div className="bg-gray-200 rounded px-6 py-2 mr-4 animate-pulse w-32"></div>
            <div className="flex flex-col space-y-2">
              <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded w-20 animate-pulse"></div>
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            {[
              "Secure payment",
              "Size & Fit",
              "Free shipping",
              "Free Shipping & Returns",
            ].map((item, index) => (
              <div key={index} className="flex items-center">
                <div className="h-4 w-4 bg-gray-200 rounded-full animate-pulse mr-2"></div>
                <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Product Description */}
      <div className="bg-white p-6 rounded-lg shadow-md mt-6">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4 animate-pulse"></div>
        <div className="flex space-x-4 mb-4">
          {["Description", "Reviews", "Question & Answer"].map((tab, index) => (
            <div
              key={index}
              className="h-4 bg-gray-200 rounded w-20 animate-pulse"
            ></div>
          ))}
        </div>
        <div className="h-20 bg-gray-200 rounded mb-4 animate-pulse"></div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <tbody>
              <tr>
                <td className="py-2">
                  <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                </td>
                <td className="py-2">
                  <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                </td>
                <td className="py-2">
                  <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                </td>
                <td className="py-2">
                  <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                </td>
                <td className="py-2">
                  <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                </td>
                <td className="py-2">
                  <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                </td>
              </tr>
              <tr>
                <td className="py-2">
                  <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                </td>
                <td className="py-2">
                  <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                </td>
                <td className="py-2">
                  <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                </td>
                <td className="py-2">
                  <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                </td>
                <td className="py-2">
                  <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                </td>
                <td className="py-2">
                  <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const SimilarProductsShimmer = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-6">
      {/* Shimmer for section title */}
      <div className="h-6 bg-gray-200 rounded w-1/3 mb-4 animate-pulse"></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array(4)
          .fill(0)
          .map((_, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-md">
              {/* Shimmer for product image */}
              <div className="w-full h-40 bg-gray-200 rounded-lg mb-4 animate-pulse"></div>
              {/* Shimmer for product title */}
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
              {/* Shimmer for product brand */}
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-2 animate-pulse"></div>
              {/* Shimmer for product price */}
              <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
            </div>
          ))}
      </div>
    </div>
  );
};
