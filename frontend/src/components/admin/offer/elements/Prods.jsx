import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Package, CircleArrowLeft } from "lucide-react";
import { toast } from "react-hot-toast";
import { getProductsByCatApi } from "../../../../services/productService";
import { applyProdOfferApi } from "../../../../services/offerServices";
const Prods = ({ setTab, selectedCatId }) => {
  const [modal, setModal] = useState(false);
  const [selectedId, setSelectedId] = useState({ pid: "", vid: "" });
  const [err, setErr] = useState("");
  const [products, setProducts] = useState([]);
  const [offer, setOffer] = useState("");

  const applyOffersP = async () => {
    if (offer <= 0 || offer >= 100) {
      return setErr("Enter valid offer value");
    }
    try {
      await applyProdOfferApi(offer, selectedId);
      toast.success("Offer applied successfully!");
      getProductsByCat();
      setModal(false);
    } catch (error) {
      toast.error(error.response?.data || "Failed to apply offer");
      setModal(false);
    }
  };

  const getProductsByCat = async () => {
    try {
      const response = await getProductsByCatApi(selectedCatId);
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
            <div className="bg-white text-black w-72 sm:w-80 rounded-lg p-4 sm:p-6 shadow-lg border border-gray-700">
              <h2 className="text-sm sm:text-base font-bold mb-3 sm:mb-4 text-center">
                Set Offer Percentage
              </h2>
              <input
                type="number"
                placeholder="Enter %"
                value={offer}
                onChange={(e) => setOffer(e.target.value)}
                className="w-full px-2 sm:px-3 py-1 sm:py-2 border rounded-md text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gray-300"
              />
              {err && <p className="text-red-500 text-xs sm:text-sm text-center">{err}</p>}
              <div className="mt-3 sm:mt-4 flex justify-end gap-2 sm:gap-3">
                <button
                  onClick={() => {
                    setErr("");
                    setModal(false);
                  }}
                  className="px-3 sm:px-4 py-1 sm:py-2 rounded-md bg-white text-black font-semibold hover:bg-gray-200 transition text-xs sm:text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={applyOffersP}
                  className="px-3 sm:px-4 py-1 sm:py-2 rounded-md bg-white text-black font-semibold hover:bg-gray-200 transition text-xs sm:text-sm"
                >
                  Apply
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto p-4 sm:p-6 pb-12 sm:pb-16">
        <div className="mb-4 sm:mb-6 flex justify-between">
          <div className="flex items-center">
            <div className="bg-black text-white p-2 sm:p-3 rounded-full mr-2 sm:mr-3">
              <Package size={20} sm:size={24} />
            </div>
            <h1 className="text-base sm:text-lg font-bold">Products Management</h1>
          </div>
          <button onClick={() => setTab("main")}>
            <CircleArrowLeft size={28} sm:size={32} className="cursor-pointer" />
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="border-b border-gray-200 bg-gray-50 py-2 sm:py-3 px-3 sm:px-4">
            <h2 className="font-semibold text-sm sm:text-base">Product List</h2>
          </div>

          <div className="divide-y divide-gray-200">
            {products.length === 0 ? (
              <div className="p-3 sm:p-4 text-center">
                <div className="text-sm sm:text-base text-black flex items-center gap-2 sm:gap-3">
                  <Package size={20} sm:size={24} />
                  No products found in this category
                </div>
              </div>
            ) : (
              products.map((product) =>
                product.variants.map((variant, idx) => (
                  <div key={idx} className="p-3 sm:p-4 hover:bg-gray-50">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-medium text-xs sm:text-sm text-gray-900">
                          {product.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-500">
                          ID: {product._id}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500">
                          Color: {variant.color}, Size: {variant.size}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500">
                          Current Offer: {variant.discount_percentage.toFixed(0)}%
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedId({ vid: variant._id, pid: product._id });
                          setModal(true);
                        }}
                        className="text-xs sm:text-sm bg-yellow-400 text-white px-2 sm:px-3 py-1 sm:py-2 rounded-md hover:bg-yellow-500 transition-colors"
                      >
                        Apply Offer
                      </button>
                    </div>
                  </div>
                ))
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Prods;