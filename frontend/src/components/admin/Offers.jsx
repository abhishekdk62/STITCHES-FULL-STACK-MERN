import React, { useEffect } from "react";
import { toast } from "react-hot-toast";
const Offers = () => {
  const [tab, setTab] = useState("main");
  const [selectedCatId, setSelectedCatId] = useState("");

  return (
    <div>
      {tab == "main" ? (
        <Main setTab={setTab} setSelectedCatId={setSelectedCatId} />
      ) : null}
      {tab == "prods" ? (
        <Prods setTab={setTab} selectedCatId={selectedCatId} />
      ) : null}
    </div>
  );
};

export default Offers;

import {
  Package,
  ChartBarStacked,
  Edit,
  Trash2,
  BadgeDollarSign,
  CircleArrowLeft,
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchCategoriesAdmin } from "../../services/categoryService";
import { getProductsByCatApi } from "../../services/productService";
import { applyProdOfferApi, applyCatOffer } from "../../services/offerServices";

const Main = ({ setTab, setSelectedCatId }) => {
  const [Categories, setCategories] = useState([]);
  const [catId, setCatId] = useState();
  const [listOpen, setListOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [offer, setOffer] = useState("");
  const [err, setErr] = useState("");



  
  const getCategories = async () => {
    try {
      const response = await fetchCategoriesAdmin();
      setCategories(response);

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);



  const applyOffers = async () => {
    if (offer <= 0 || offer >= 100) {
      setErr("Please enter valid offer value");
      return;
    }
    try { 

      
      const response = await applyCatOffer(catId, offer);
      toast.success("Offer applied", {
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
      setErr("");
      setOffer("")

      getCategories();
    } catch (error) {
      console.log(error);
      toast.error(error.response.data, {
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

    setModalOpen(false);
  };


  return (
    <div className="bg-gray-50 min-h-screen">
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 bg-opacity-50"
          >
            <div className="bg-white text-black w-80 rounded-lg p-6 shadow-lg border border-gray-700">
              <h2 className="text-lg font-bold mb-4 text-center">
                Set Offer Percentage
              </h2>

              <input
                type="number"
                placeholder="Enter %"
                onClick={() => setListOpen(true)}
                value={offer}
                onChange={(e) => setOffer(e.target.value)}
                className="w-full px-3 py-2 border rounded-md text-black font-semibold focus:outline-none focus:ring-2 focus:ring-gray-300"
              />

              {err && <p className="text-red-500 text-sm text-center">{err}</p>}
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => {
                    setErr("");
                    setModalOpen(false);
                  }}
                  className="px-4 py-2 rounded-md bg-white text-black font-semibold hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={applyOffers}
                  className="px-4 py-2 rounded-md bg-white text-black font-semibold hover:bg-gray-200 transition"
                >
                  Apply
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto p-6 pb-20">
        {/* Header */}
        <div className="mb-8 flex items-center">
          <div className="bg-black text-white p-3 rounded-full mr-4">
            <BadgeDollarSign size={24} />
          </div>
          <h1 className="text-3xl font-bold">Offers Management</h1>
        </div>

        {/* Products Section */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="border-b border-gray-200 bg-gray-50 py-4 px-6">
            <h2 className="font-semibold text-lg">Category List</h2>
          </div>

          <div className="divide-y divide-gray-200">
            {Categories.map((product) => (
              <div
                key={product._id}
                className="p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                  <div className="flex items-center gap-3 mb-2 md:mb-0">
                    <div className="bg-black text-white p-1.5 rounded-full">
                      <ChartBarStacked size={16} />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-500">ID: {product._id}</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      DISCOUNT PERCENTAGE: {product.discount}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedCatId(product._id);
                          setTab("prods");
                        }}
                        className="text-xs bg-yellow-400 text-white p-2 rounded-md hover:bg-yellow-500 transition-colors"
                        title="Edit Product"
                      >
                        APPLY PRODUCTS OFFER
                      </button>
                      <button
                        onClick={() => {
                          setCatId(product._id);
                          setModalOpen(true);
                        }}
                        className="text-xs bg-green-400 text-white p-2 rounded-md hover:bg-green-500 transition-colors"
                        title=""
                      >
                        APPLY CATEGORY OFFER
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Prods = ({ setTab, selectedCatId }) => {
  const [modal, setModal] = useState(false);
  const [selectedId, setSelectedId] = useState({ pid: "", vid: "" });
  const [err, setErr] = useState("");
  const [products, setProducts] = useState([]);
  const [offer, setOffer] = useState("");
  const applyOffersP = async () => {
    if (offer <= 0 || offer >= 100) {
      return setErr("Enter Valid Offer Value");
    }
    try {
      const response = await applyProdOfferApi(offer, selectedId);
      toast.success("Offer applied", {
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

      getProductsByCat();
      setModal(false);
    } catch (error) {
      toast.error(error.response.data, {
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

      setModal(false);
    }
  };

  const getProductsByCat = async () => {
    try {
      const response = await getProductsByCatApi(selectedCatId);
      console.log(response);
      setProducts(response);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getProductsByCat();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      <AnimatePresence>
        {modal && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 bg-opacity-50"
          >
            <div className="bg-white text-black w-80 rounded-lg p-6 shadow-lg border border-gray-700">
              <h2 className="text-lg font-bold mb-4 text-center">
                Set Offer Percentage
              </h2>

              <input
                type="number"
                placeholder="Enter %"
                value={offer}
                onChange={(e) => setOffer(e.target.value)}
                className="w-full px-3 py-2 border rounded-md text-black font-semibold focus:outline-none focus:ring-2 focus:ring-gray-300"
              />

              {err && <p className="text-red-500 text-sm text-center">{err}</p>}
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => {
                    setErr("");
                    setModal(false);
                  }}
                  className="px-4 py-2 rounded-md bg-white text-black font-semibold hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={applyOffersP}
                  className="px-4 py-2 rounded-md bg-white text-black font-semibold hover:bg-gray-200 transition"
                >
                  Apply
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto p-6 pb-20">
        {/* Header */}
        <div className="mb-8 flex justify-between">
          <div className="flex items-center">
            <div className="bg-black text-white p-3 rounded-full mr-4">
              <Package size={24} />
            </div>
            <h1 className="text-3xl font-bold">Products Management</h1>
          </div>
          <button>
            <CircleArrowLeft
              size={35}
              className=" cursor-pointer "
              onClick={() => setTab("main")}
            />
          </button>
        </div>

        {/* Products Section */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="border-b border-gray-200 bg-gray-50 py-4 px-6">
            <h2 className="font-semibold text-lg">Product List</h2>
          </div>

          <div className="divide-y divide-gray-200">
            {products.length == 0 ? (
              <div className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-center items-center">
                  <div className="text-black text-2xl flex items-center gap-4 ">
                    <Package size={30} /> NO PRODUCTS FOUND IN THIS CATEGORY
                  </div>
                </div>
              </div>
            ) : (
              products.map((product) => (
                <div>
                  {product.variants.map((v,idx) => (
                    <div
                      key={idx}
                      className="p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                        <div className="flex items-center gap-3 mb-2 md:mb-0">
                          <div className="bg-black text-white p-1.5 rounded-full">
                            <Package size={16} />
                          </div>
                          <div className="flex gap-10">
                            <div>
                              <h3 className="font-medium text-gray-900">
                                {product.name}
                              </h3>
                              <p className="text-sm text-gray-500">
                                ID: {product._id}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">
                                COLOR: {v.color}
                              </p>
                              <p className="text-sm text-gray-500">
                                SIZE: {v.size}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">
                                CURRENT OFFER:{" "}
                                {v.discount_percentage.toFixed(0)} %
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setSelectedId({ vid: v._id, pid: product._id });
                                setModal(true);
                              }}
                              className="text-xs bg-yellow-400 text-white p-2 rounded-md hover:bg-yellow-500 transition-colors"
                              title="Edit Product"
                            >
                              APPLY OFFER
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
