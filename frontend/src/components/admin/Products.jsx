import React, { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Search,
  Edit,
  Trash2,
  CheckCircle,
  RefreshCw,
  Plus,
  ArrowLeft,
  ArrowRight,

  Upload,
  AlertCircle,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import {Filter, FileText, Package, Tag,User,Award } from 'lucide-react';

import Cropper from "react-easy-crop";
import { fetchCategoriesAdmin } from "../../services/categoryService";
import {
  addProduct,
  editProductService,
  fetchProduct,
  fetchProducts,
  fetchProductsService,
  restoreProduct,
  softDeleteProductService,
} from "../../services/productService";


const AddProduct = ({ setShowAddProduct }) => {
  // Product fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [brand, setBrand] = useState("");
  const [productImages, setProductImages] = useState([""]); // Start with one field
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [owner, setOwner] = useState("");
  const [categories, setCategories] = useState([]);

  // Variant fields
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [stock, setStock] = useState("");
  const [variants, setVariants] = useState([]);

  // Image crop states
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(null);
  const [tempImageSrc, setTempImageSrc] = useState(null);

  // Error state for validations
  const [error, setError] = useState("");

  // Static arrays
  const sizes = ["SM", "M", "L", "XL"];
  const colors = [
    "red",
    "blue",
    "white",
    "black",
    "green",
    "yellow",
    "purple",
    "orange",
    "gray",
  ];

  // Fetch categories on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesData = await fetchCategoriesAdmin();
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchData();
  }, []);

  const selectedCategory = categories.find((cat) => cat._id === category);

  // Image upload and crop handling
  const openFileDialog = (index) => {
    document.getElementById(`fileInput${index}`).click();
  };

  const handleFileChange = (index, event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setTempImageSrc(reader.result);
      setCurrentImageIndex(index);
      setCropModalOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCrop = async (croppedBlob) => {
    const formData = new FormData();
    formData.append("file", croppedBlob, "cropped.jpg");
    formData.append("upload_preset", "COSTUMES");

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dv8xenucq/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();
      const newImages = [...productImages];
      newImages[currentImageIndex] = data.secure_url;
      setProductImages(newImages);
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setCropModalOpen(false);
      setTempImageSrc(null);
      setCurrentImageIndex(null);
    }
  };

  const removeImage = (index) => {
    setProductImages((prevImages) => {
      const newImages = [...prevImages];
      newImages.splice(index, 1);
      return newImages;
    });
  };

  const addImageField = () => {
    setProductImages([...productImages, ""]);
  };

  // Validations for variant details
  const handleVariantValidation = () => {
    if (!selectedColor) {
      setError("Error: Please select a color");
      return false;
    }
    if (!selectedSize) {
      setError("Error: Please select a size");
      return false;
    }
    if (!basePrice) {
      setError("Error: Please enter a base price");
      return false;
    }
    if (Number(basePrice) < 5000) {
      setError("Error: Base price must be at least 5000");
      return false;
    }
    if (!discountPrice) {
      setError("Error: Please enter a discount price");
      return false;
    }
    if (Number(discountPrice) > Number(basePrice)) {
      setError("Error: Discount price cannot be more than base price");
      return false;
    }
    if (!stock) {
      setError("Error: Please enter the stock quantity");
      return false;
    }
    if (Number(stock) <= 0) {
      setError("Error: Stock must be greater than 0");
      return false;
    }
    // Ensure at least 2 valid images
    if (
      !productImages ||
      productImages.filter((img) => img && img.trim() !== "").length < 2
    ) {
      setError("Error: Variant must have at least 2 images");
      return false;
    }
    setError(""); // Clear error if validations pass
    return true;
  };

  const addVariant = () => {
    if (handleVariantValidation()) {
      const newVariant = {
        color: selectedColor,
        size: selectedSize,
        base_price: Number(basePrice),
        discount_price: Number(discountPrice),
        stock: Number(stock),
        productImages: productImages,
      };
      setVariants([...variants, newVariant]);
      // Reset variant fields
      setSelectedColor("");
      setSelectedSize("");
      setBasePrice("");
      setDiscountPrice("");
      setStock("");
      setProductImages([""]);
    }
  };

  // Form submission validations
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error

    if (!name.trim()) {
      setError("Product name is required");
      return;
    }
    if (!description.trim()) {
      setError("Product description is required");
      return;
    }
    if (!brand.trim()) {
      setError("Brand is required");
      return;
    }
    if (!category) {
      setError("Category is required");
      return;
    }
    if (!subCategory) {
      setError("Subcategory is required");
      return;
    }
    if (!owner.trim()) {
      setError("Owner is required");
      return;
    }
    if (variants.length === 0) {
      setError("Please add at least one variant");
      return;
    }

    // Validate each variant
    for (let i = 0; i < variants.length; i++) {
      const variant = variants[i];
      if (variant.base_price < 5000) {
        setError(
          `Variant ${i + 1} (${variant.color}, ${variant.size}): Base price must be at least 5000`
        );
        return;
      }
      if (variant.discount_price > variant.base_price) {
        setError(
          `Variant ${i + 1} (${variant.color}, ${variant.size}): Discount price cannot be more than base price`
        );
        return;
      }
    }

    const productData = {
      name,
      description,
      brand,
      category,
      subCategory,
      owner,
      variants,
    };

    try {
      const responseData = await addProduct(productData);


      toast.success(responseData.message, {
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



      // Reset form fields on success
      setName("");
      setDescription("");
      setBrand("");
      setProductImages([""]);
      setBasePrice("");
      setDiscountPrice("");
      setCategory("");
      setSubCategory("");
      setOwner("");
      setVariants([]);
    } catch (error) {
      setError(`Error: ${error.message || "Something went wrong"}`);
      console.error(error);
    }
  };

  const removeVariant = (index) => {
    const updatedVariants = [...variants];
    updatedVariants.splice(index, 1);
    setVariants(updatedVariants);
  };

  return (
    <div className="w-full max-w-6xl mx-auto bg-gray-50 rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div className="bg-gray-900 px-6 py-3 flex justify-between items-center">
        <h1 className="text-xl font-bold text-white">Add New Product</h1>
        <button
          onClick={() => setShowAddProduct(false)}
          className="text-white hover:bg-gray-700 rounded-full p-1 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800 border-b pb-1">
                Product Information
              </h2>
              {/* Product Name */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full px-3 py-2 border border-gray-400 rounded focus:outline-none focus:ring-1 focus:ring-indigo-400 text-sm"
                  type="text"
                  placeholder="Enter product name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              {/* Brand */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Brand <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full px-3 py-2 border border-gray-400 rounded focus:outline-none focus:ring-1 focus:ring-indigo-400 text-sm"
                  type="text"
                  placeholder="Enter brand name"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                />
              </div>
              {/* Description */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Product Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-400 rounded focus:outline-none focus:ring-1 focus:ring-indigo-400 text-sm"
                  placeholder="Write detailed product description..."
                  rows="4"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>
              {/* Category */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-400 rounded focus:outline-none text-sm"
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setSubCategory("");
                  }}
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              {/* Subcategory */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Subcategory <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-400 rounded focus:outline-none text-sm"
                  value={subCategory}
                  onChange={(e) => setSubCategory(e.target.value)}
                  disabled={!selectedCategory}
                >
                  <option value="">Select Subcategory</option>
                  {selectedCategory &&
                    selectedCategory.subCategories.map((subCat, index) => (
                      <option key={index} value={subCat}>
                        {subCat}
                      </option>
                    ))}
                </select>
              </div>
              {/* Owner */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Owner <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full px-3 py-2 border border-gray-400 rounded focus:outline-none focus:ring-1 focus:ring-indigo-400 text-sm"
                  type="text"
                  placeholder="Enter product owner"
                  value={owner}
                  onChange={(e) => setOwner(e.target.value)}
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800 border-b pb-1">
                Product Images
              </h2>
              {/* Image Upload */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Upload Images <span className="text-red-500">*</span>
                  <span className="text-xs text-gray-500 ml-1">
                    (Min 2 images)
                  </span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {productImages.map((img, index) => (
                    <div
                      key={index}
                      className={`relative border-2 ${
                        img ? "border-indigo-500" : "border-dashed border-gray-300"
                      } rounded overflow-hidden group transition-all hover:shadow-sm`}
                      style={{ aspectRatio: "309/400" }}
                    >
                      {img ? (
                        <>
                          <img
                            src={img}
                            alt={`Uploaded ${index}`}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <input
                            id={`fileInput${index}`}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleFileChange(index, e)}
                          />
                          <div
                            onClick={() => openFileDialog(index)}
                            className="w-full h-full flex flex-col items-center justify-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors p-2"
                          >
                            <Upload size={20} className="text-gray-400 mb-1" />
                            <span className="text-xs text-gray-500 text-center">
                              Upload
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addImageField}
                  className="mt-2 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium px-3 py-1 rounded border border-gray-300 transition-colors"
                >
                  <Plus size={16} className="mr-1" /> Add Image
                </button>

                {cropModalOpen && tempImageSrc && (
                  <CropModal
                    imageSrc={tempImageSrc}
                    onCrop={handleCrop}
                    onClose={() => setCropModalOpen(false)}
                    aspect={309 / 400}
                  />
                )}
              </div>

              <h2 className="text-lg font-semibold text-gray-800 border-b pb-1 mt-4">
                Variant Information
              </h2>
              {/* Variant Details */}
              <div className="space-y-3 p-3 bg-white rounded border border-gray-200">
                <div className="grid grid-cols-2 gap-3">
                  {/* Color */}
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                      Color <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={selectedColor}
                      onChange={(e) => setSelectedColor(e.target.value)}
                      className="w-full px-2 py-1 border border-gray-400 rounded focus:outline-none text-sm"
                    >
                      <option value="">Select Color</option>
                      {colors.map((color) => (
                        <option key={color} value={color}>
                          {color.charAt(0).toUpperCase() + color.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* Size */}
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                      Size <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={selectedSize}
                      onChange={(e) => setSelectedSize(e.target.value)}
                      className="w-full px-2 py-1 border border-gray-400 rounded focus:outline-none text-sm"
                    >
                      <option value="">Select Size</option>
                      {sizes.map((size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {/* Base Price */}
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                      Base Price <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-gray-500 text-sm">
                        ₹
                      </span>
                      <input
                        type="number"
                        placeholder="Min 5000"
                        className="w-full pl-6 pr-2 py-1 border border-gray-400 rounded focus:outline-none focus:ring-1 focus:ring-indigo-400 text-sm"
                        value={basePrice}
                        onChange={(e) => setBasePrice(e.target.value)}
                      />
                    </div>
                  </div>
                  {/* Discount Price */}
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                      Discount Price <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-gray-500 text-sm">
                        ₹
                      </span>
                      <input
                        type="number"
                        placeholder="Discount price"
                        className="w-full pl-6 pr-2 py-1 border border-gray-400 rounded focus:outline-none focus:ring-1 focus:ring-indigo-400 text-sm"
                        value={discountPrice}
                        onChange={(e) => setDiscountPrice(e.target.value)}
                      />
                    </div>
                  </div>
                  {/* Stock */}
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                      Stock <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      placeholder="Stock"
                      className="w-full px-2 py-1 border border-gray-400 rounded focus:outline-none focus:ring-1 focus:ring-indigo-400 text-sm"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                    />
                  </div>
                </div>

                {/* Add Variant Button */}
                <button
                  type="button"
                  onClick={addVariant}
                  className="mt-2 w-full bg-black hover:bg-gray-800 text-white text-sm font-medium px-3 py-1 rounded flex items-center justify-center transition-colors"
                >
                  <Plus size={16} className="mr-1" /> Add Variant
                </button>
              </div>
            </div>
          </div>

          {/* Display Added Variants */}
          {variants.length > 0 && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-gray-800 border-b pb-1">
                Product Variants ({variants.length})
              </h2>
              <div className="mt-3 bg-white rounded border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left font-medium text-gray-600 uppercase">
                        Color
                      </th>
                      <th className="px-3 py-2 text-left font-medium text-gray-600 uppercase">
                        Size
                      </th>
                      <th className="px-3 py-2 text-left font-medium text-gray-600 uppercase">
                        Base Price
                      </th>
                      <th className="px-3 py-2 text-left font-medium text-gray-600 uppercase">
                        Discount Price
                      </th>
                      <th className="px-3 py-2 text-left font-medium text-gray-600 uppercase">
                        Stock
                      </th>
                      <th className="px-3 py-2 text-left font-medium text-gray-600 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {variants.map((variant, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-3 py-2 whitespace-nowrap">
                          <div className="flex items-center">
                            <div
                              className="h-3 w-3 rounded-full mr-1"
                              style={{ backgroundColor: variant.color }}
                            ></div>
                            <span className="text-gray-800">
                              {variant.color.charAt(0).toUpperCase() +
                                variant.color.slice(1)}
                            </span>
                          </div>
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-gray-800">
                          {variant.size}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-gray-800">
                          ₹{variant.base_price.toLocaleString()}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-gray-800">
                          ₹{variant.discount_price.toLocaleString()}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-gray-800">
                          {variant.stock}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => removeVariant(index)}
                            className="text-red-600 hover:text-red-800 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Form Buttons and Error */}
          <div className="flex justify-end items-center space-x-4 mt-6">
            {error && <p className="text-red-500 text-xs">{error}</p>}
            <button
              type="submit"
              className="px-4 py-1 bg-black hover:bg-gray-800 rounded text-white text-sm font-medium transition-colors flex items-center"
            >
              <CheckCircle size={16} className="mr-1" /> Save Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};



//!croping comppo
const getCroppedImg = (imageSrc, croppedAreaPixels) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.src = imageSrc;
    image.onload = () => {
      const outputWidth = 309;
      const outputHeight = 400;
      const canvas = document.createElement("canvas");
      canvas.width = outputWidth;
      canvas.height = outputHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        outputWidth,
        outputHeight
      );
      canvas.toBlob((blob) => {
        if (!blob) return reject(new Error("Canvas is empty"));
        resolve(blob);
      }, "image/jpeg");
    };
    image.onerror = () => reject(new Error("Image load failed"));
  });

// Crop Modal Component
const CropModal = ({ imageSrc, onCrop, onClose, aspect = 1 }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleCrop = async () => {
    try {
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      onCrop(croppedBlob);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4">
        {/* Container with fixed size */}
        <div className="relative w-[309px] h-[400px]">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
            cropShape="rect"
            showGrid={false}
            style={{
              containerStyle: {
                width: "309px",

                height: "400px",
              },
              cropAreaStyle: {
                border: "2px dashed #fff",
                background: "rgba(0, 0, 0, 0.5)",
                width: "309px",
                height: "400px",
              },
            }}
          />
        </div>
        <div className="mt-2 flex justify-end space-x-2">
          <button
            type="button"
            onClick={handleCrop}
            className="bg-blue-500 text-white px-4 py-2"
          >
            Crop
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-300 px-4 py-2"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

//! Products list component

const ProductsList = ({
  setShowAddProduct,
  setShowEditProduct,
  setShowRemoved,
}) => {
  const [searchInput, setSearchInput] = useState("");
  const [productsList, setProductsList] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isOpen,setIsOpen]=useState(false)

  const fetchProducts = async (query = "", page = 1) => {
    try {
      setLoading(true);
      const data = await fetchProductsService(query, page);
      setProductsList(data.products);
      
      setCurrentPage(data.page);
      setTotalPages(data.totalPages);
      setError("");
    } catch (err) {
      setError("Failed to fetch products. Please try again.");
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };


// const fetchProducts = useCallback(async (query = "", page = 1) => {
//   try {
//     setLoading(true);
//     const data = await debouncedFetchProductsService(query, page);
//     setProductsList(data.products);
//     setCurrentPage(data.page);
//     setTotalPages(data.totalPages);
//     setError("");
//   } catch (err) {
//     setError("Failed to fetch products. Please try again.");
//     console.error("Error fetching products:", err);
//   } finally {
//     setLoading(false);
//   }
// }, []);




  const [deleteProdId,setDeleteProdId]=useState()

  useEffect(() => {
    fetchProducts("", 1);
  }, []);

  useEffect(() => {
    fetchProducts(searchInput.trim(), currentPage);
  }, [currentPage]);

  const handleSearch = () => {
    fetchProducts(searchInput.trim(), 1);
  };

  const softDelete = async () => {
  
      try {
        const response = await softDeleteProductService(deleteProdId);
        if (response.status === 200) {

          toast.success("Product deleted!", {
            icon: (
              <img
                src="https://static.thenounproject.com/png/412945-200.png"
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
    setIsOpen(false)


          await fetchProducts(searchInput.trim(), currentPage);
        } else {

          toast.error("Failed to delete", {
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
      } catch (err) {
        console.error("Error deleting product:", err);

        toast.error(err?.response?.data?.message || "Something went wrong", {
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
    
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      
        

 <AnimatePresence>
 {isOpen && (
   <motion.div
     initial={{ opacity: 0, y: -50 }}
     animate={{ opacity: 1, y: 0 }}
     exit={{ opacity: 0, y: -50 }}
     transition={{
       type: "spring",
       stiffness: 300,
       damping: 30,
     }}
     className="fixed inset-0 z-50 flex items-center justify-center 
"
   >
     <div
       className="fixed text-sm top-6 left-1/2 transform -translate-x-1/2 w-96 bg-black
border-gray-700 p-5 rounded-lg shadow-lg text-center"
     >
       <div className="flex flex-col items-center justify-center gap-2">
         <img
           className="h-8 w-8 animate-bounce"
           src="https://static.thenounproject.com/png/16960-200.png"
           alt=""
           style={{ filter: "invert(1)" }}
         />
         <p className="text-white font-bold text-sm">
           Do you want to remove this product?
         </p>
       </div>

       <div className="mt-4 flex justify-center gap-4">
         <button
           onClick={softDelete}
           className="bg-gray-200 px-3 py-1 rounded-md  text-black cursor-pointer"
         >
           Confirm
         </button>
         <button
           onClick={() => setIsOpen(false)}
           className="bg-red-500 px-4 py-2 rounded text-white font-bold hover:bg-red-700"
         >
           Cancel
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
            <Package size={24} />
          </div>
          <h1 className="text-3xl font-bold">Products Management</h1>
        </div>

        {/* Controls Bar */}
        <div className="bg-white p-5 rounded-lg shadow-md mb-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="w-full md:w-auto flex flex-col md:flex-row items-center gap-4">
              <div className="relative w-full md:w-80">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search products by name, ID or brand..."
                  className="pl-10 pr-10 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black/70"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                {searchInput && (
                  <button
                    onClick={() => {
                      setSearchInput("");
                      fetchProducts("", 1);
                    }}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
              <button
                onClick={handleSearch}
                className="bg-black text-white px-4 py-2 rounded-md flex items-center transition-all hover:bg-gray-800 w-full md:w-auto justify-center"
              >
                <Search size={18} className="mr-2" />
                <span>Search</span>
              </button>
            </div>
            <div className="flex gap-4 w-full md:w-auto">
              <button
                onClick={() => setShowAddProduct(true)}
                className="bg-black text-white px-4 py-2 rounded-md flex items-center transition-all hover:bg-gray-800 w-full md:w-auto justify-center"
              >
                <Plus size={18} className="mr-2" />
                <span>Add Product</span>
              </button>
              <button
                onClick={() => setShowRemoved(true)}
                className="bg-white text-black border border-gray-300 px-4 py-2 rounded-md flex items-center transition-all hover:bg-gray-100 w-full md:w-auto justify-center"
              >
                <Trash2 size={18} className="mr-2" />
                <span>View Removed</span>
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        {/* Products Section */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="border-b border-gray-200 bg-gray-50 py-4 px-6">
            <h2 className="font-semibold text-lg">Product List</h2>
          </div>

          {loading ? (
            // Shimmer UI while loading
            <div className="divide-y divide-gray-200">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="p-6 animate-pulse">
                  <div className="flex justify-between mb-4">
                    <div className="h-6 bg-gray-200 rounded w-32"></div>
                    <div className="h-6 bg-gray-200 rounded w-24"></div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-4/5 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/5"></div>
                </div>
              ))}
            </div>
          ) : productsList.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {productsList.map((product) => (
                <div key={product._id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div className="flex items-center gap-3 mb-2 md:mb-0">
                      <div className="bg-black text-white p-1.5 rounded-full">
                        <Package size={16} />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{product.name}</h3>
                        <p className="text-sm text-gray-500">
                          ID: {product._id ? product._id.substring(0, 8) : "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-sm text-gray-600">
                        Brand: {product.brand || "N/A"}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setShowEditProduct(true);
                            localStorage.setItem("productId", product._id);
                          }}
                          className="p-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                          title="Edit Product"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => {
                            setDeleteProdId(product._id)
                            setIsOpen(true)
                       }}
                          className="p-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                          title="Remove Product"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <Package size={24} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No products found</h3>
              <p className="text-gray-500">Try adjusting your search criteria or add a new product.</p>
              <button 
                onClick={() => setShowAddProduct(true)}
                className="mt-4 text-black font-medium hover:underline"
              >
                Add your first product
              </button>
            </div>
          )}
        </div>

        {/* Fixed Pagination UI at Bottom */}
        <div className="fixed bottom-0 left-0 right-0 p-3 bg-white shadow-lg border-t border-gray-200">
          <div className="flex justify-center items-center space-x-4 max-w-xs mx-auto">
            <button
              onClick={() => {
                if (currentPage > 1) {
                  setCurrentPage(currentPage - 1);
                }
              }}
              disabled={currentPage <= 1}
              className="h-10 w-10 flex items-center justify-center rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:hover:bg-gray-100 transition-colors"
              aria-label="Previous page"
            >
              <ArrowLeft size={18} />
            </button>

            <span className="text-sm font-medium">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => {
                if (currentPage < totalPages) {
                  setCurrentPage(currentPage + 1);
                }
              }}
              disabled={currentPage >= totalPages}
              className="h-10 w-10 flex items-center justify-center rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:hover:bg-gray-100 transition-colors"
              aria-label="Next page"
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

//!edit products

const EditProduct = ({ setShowEditProduct }) => {
  const [productDetails, setProductDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  // Basic product info
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [owner, setOwner] = useState("");

  // Product images - store only URLs
  const [productImages, setProductImages] = useState([]);

  // Categories data
  const [categories, setCategories] = useState([]);

  // Variant-related state
  const [variants, setVariants] = useState([]);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [stock, setStock] = useState("");

  const [variantImages, setVariantImages] = useState([""]);

  // Constants
  const sizes = ["SM", "M", "L", "XL"];
  const colors = [
    "red",
    "blue",
    "white",
    "black",
    "green",
    "yellow",
    "purple",
    "orange",
    "gray",
  ];

  // Fetch product details on mount
  useEffect(() => {
    const id = localStorage.getItem("productId");

    const getProductData = async () => {
      try {
        const productData = await fetchProduct(id);
        setProductDetails(productData);
        console.log("Product data:", productData);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    const getCategoriesData = async () => {
      try {
        const cats = await fetchCategoriesAdmin();
        setCategories(cats);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    getProductData();
    getCategoriesData();
  }, []);

  // Initialize state after fetching productDetails
  useEffect(() => {
    if (productDetails) {
      setName(productDetails.name || "");
      setDescription(productDetails.description || "");
      setBrand(productDetails.brand || "");
      setCategory(productDetails.category || "");
      setSubCategory(productDetails.subCategory || "");
      setOwner(productDetails.owner || "");

      if (
        productDetails.productImages &&
        productDetails.productImages.length > 0
      ) {
        setProductImages(
          productDetails.productImages.filter(
            (img) => img && (img.startsWith("http") || img.startsWith("https"))
          )
        );
      } else {
        setProductImages([]);
      }

      if (productDetails.variants && productDetails.variants.length > 0) {
        setVariants(
          productDetails.variants.map((variant) => ({
            ...variant,
            productImages: variant.productImages || [],
          }))
        );
      }
    }
  }, [productDetails]);

  // Handle image upload to Cloudinary
  const handleImageUpload = async (file) => {
    if (!file) return null;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "COSTUMES");

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dv8xenucq/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();
      setLoading(false);
      return data.secure_url;
    } catch (error) {
      console.error("Error uploading image:", error);
      setLoading(false);
      return null;
    }
  };

  // Add image to product
  const addProductImage = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const imageUrl = await handleImageUpload(file);
    if (imageUrl) {
      setProductImages([...productImages, imageUrl]);
    }
  };
const [error,setError]=useState("")// Add image to variant
  const handleVariantImageUpload = async (variantIndex, file) => {
    if (!file) return null;

    setLoading(true);
    try {
      const imageUrl = await handleImageUpload(file);
      if (imageUrl) {
        const updatedVariants = [...variants];
        if (!updatedVariants[variantIndex].productImages) {
          updatedVariants[variantIndex].productImages = [];
        }
        updatedVariants[variantIndex].productImages = [
          ...updatedVariants[variantIndex].productImages,
          imageUrl,
        ];
        setVariants(updatedVariants);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error uploading variant image:", error);
      setLoading(false);
    }
  };

  // Add image to specific variant
  const addVariantImage = async (variantIndex, event) => {
    const file = event.target.files[0];
    if (!file) return;
    await handleVariantImageUpload(variantIndex, file);
  };

  // Handle variant images for new variant
  const handleProductImageChange = (index, event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const newImages = [...variantImages];
      newImages[index] = reader.result;
      setVariantImages(newImages);

      if (index === newImages.length - 1) {
        setVariantImages([...newImages, ""]);
      }
    };
    reader.readAsDataURL(file);
  };

  // Process variantImages to upload to Cloudinary before adding a new variant
  const uploadVariantImages = async () => {
    const uploadedUrls = [];
    const filledImages = variantImages.filter((img) => img && img !== "");
    if (filledImages.length === 0) return [];

    setLoading(true);
    for (const imageData of filledImages) {
      if (imageData.startsWith("http")) {
        uploadedUrls.push(imageData);
        continue;
      }
      const file = await dataURLtoFile(imageData, "variant-image.jpg");
      const uploadedUrl = await handleImageUpload(file);
      if (uploadedUrl) {
        uploadedUrls.push(uploadedUrl);
      }
    }
    setLoading(false);
    return uploadedUrls;
  };

  // Utility function to convert dataURL to File
  const dataURLtoFile = (dataurl, filename) => {
    return new Promise((resolve) => {
      const arr = dataurl.split(",");
      const mime = arr[0].match(/:(.*?);/)[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      resolve(new File([u8arr], filename, { type: mime }));
    });
  };

  // Remove image from product
  const removeProductImage = (index) => {
    const newImages = [...productImages];
    newImages.splice(index, 1);
    setProductImages(newImages);
  };

  // Remove variant image
  const removeVariantImage = (variantIndex, imageIndex) => {
    const updatedVariants = [...variants];
    if (updatedVariants[variantIndex].productImages.length <= 2) {

      toast.error("Each variant must have at least 2 images.", {
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

      return;
    }
    updatedVariants[variantIndex].productImages.splice(imageIndex, 1);
    setVariants(updatedVariants);
  };

  const removeNewVariantImage = (index) => {
    const newImages = [...variantImages];
    newImages.splice(index, 1);
    setVariantImages(newImages);
  };

  // Variant functions
  const handleVariantChange = (index, field, value) => {
    const updatedVariants = [...variants];
    updatedVariants[index] = { ...updatedVariants[index], [field]: value };
    setVariants(updatedVariants);
  };

  const addVariant = async () => {
    const uploadedImages = await uploadVariantImages();
    if (uploadedImages.length < 2) {
      setError("Add at least two product images");
      return;
    }
    if (!(selectedColor && selectedSize && basePrice && discountPrice && stock)) {
      setError("Please fill in all variant fields");
      return;
    }
    setLoading(true);
    const newVariant = {
      color: selectedColor,
      size: selectedSize,
      base_price: Number(basePrice),
      discount_price: Number(discountPrice),
      stock: Number(stock),
      productImages: uploadedImages,
    };
    setVariants([...variants, newVariant]);
    setSelectedColor("");
    setSelectedSize("");
    setBasePrice("");
    setDiscountPrice("");
    setStock("");
    setVariantImages([""]);
    setError(""); // Clear any previous error
    setLoading(false);
  };
  

  const removeVariant = (index) => {
    const updatedVariants = [...variants];
    updatedVariants.splice(index, 1);
    setVariants(updatedVariants);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
  
    // Validate overall form fields
    if (loading) {
      setError("Please wait for images to finish uploading");
      return;
    }
    if (!name.trim()) {
      setError("Error: Product name is required");
      return;
    }
    if (!description.trim()) {
      setError("Error: Product description is required");
      return;
    }
    if (!brand.trim()) {
      setError("Error: Brand is required");
      return;
    }
    if (!category) {
      setError("Error: Category is required");
      return;
    }
    if (!subCategory) {
      setError("Error: Subcategory is required");
      return;
    }
    if (!owner.trim()) {
      setError("Error: Owner is required");
      return;
    }
    if (variants.length === 0) {
      setError("Error: Please add at least one variant");
      return;
    }
  
    // Validate each variant
    for (let i = 0; i < variants.length; i++) {
      const variant = variants[i];
      if (!variant.color || !variant.size) {
        setError(`Error: Variant ${i + 1} is missing color or size information`);
        return;
      }
      if (variant.base_price < 5000) {
        setError(
          `Error: Variant ${i + 1} (${variant.color}, ${variant.size}): Base price must be at least 5000`
        );
        return;
      }
      if (variant.discount_price > variant.base_price) {
        setError(
          `Error: Variant ${i + 1} (${variant.color}, ${variant.size}): Discount price cannot be more than base price`
        );
        return;
      }
      const variantImgs = variant.productImages || [];
      if (variantImgs.filter((img) => img && img.trim() !== "").length < 2) {
        setError(
          `Error: Variant ${i + 1} (${variant.color}, ${variant.size}) must have at least 2 images`
        );
        return;
      }
      if (variant.stock <= 0) {
        setError(
          `Error: Variant ${i + 1} (${variant.color}, ${variant.size}): Stock must be greater than 0`
        );
        return;
      }
    }
  
    // All validations passed, construct payload
    try {
      const payload = {
        name,
        description,
        brand,
        category,
        subCategory,
        owner,
        variants: variants.map((variant) => ({
          color: variant.color,
          size: variant.size,
          base_price: variant.base_price,
          discount_price: variant.discount_price,
          stock: variant.stock,
          productImages: variant.productImages || [],
        })),
      };
  
      const data = await editProductService(productDetails._id, payload);
      setError(""); // Clear error on success
      // Optionally display a success message elsewhere
      setShowEditProduct(false);
      localStorage.removeItem("productId");
    } catch (error) {
      console.log("Error updating product:", error);
      setError(
        `Error updating product: ${error.response?.data?.message || error.message}`
      );
    }
  };
  
  

  useEffect(() => {
    if (productDetails) {
      setCategory(productDetails.category ? productDetails.category._id : "");
    }
  }, [productDetails]);

  return (
    <div className="w-full max-w-6xl mx-auto bg-gray-50 rounded-lg shadow-md overflow-hidden">

      <div className="bg-black px-6 py-3 flex justify-between items-center">
        <h1 className="text-xl font-bold text-white">Edit Product</h1>
        <button
          onClick={() => {
            setShowEditProduct(false);
            localStorage.removeItem("productId");
          }}
          className="text-white hover:bg-gray-700 rounded-full p-1 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="p-6">
        {loading && (
          <div className="mb-4 p-2 bg-blue-100 text-blue-700 rounded text-sm">
            Uploading images... Please wait.
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Basic Product Information */}
          <div className="grid grid-cols-1 gap-6 mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-800 border-b pb-1 mb-3">
                Product Information
              </h2>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full px-3 py-2 border border-gray-500 rounded focus:outline-none focus:ring-1 focus:ring-indigo-400 text-sm"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Product Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-500 rounded focus:outline-none focus:ring-1 focus:ring-indigo-400 text-sm"
                  rows="4"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Brand <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full px-3 py-2 border border-gray-500 rounded focus:outline-none focus:ring-1 focus:ring-indigo-400 text-sm"
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Category Selection */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-500 rounded focus:outline-none text-sm"
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setSubCategory("");
                }}
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Subcategory <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-500 rounded focus:outline-none text-sm"
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
              >
                <option value="">Select Subcategory</option>
                {categories
                  .find((cat) => cat._id === category)
                  ?.subCategories.map((subCat, index) => (
                    <option key={index} value={subCat}>
                      {subCat}
                    </option>
                  ))}
              </select>
            </div>
            <div className="lg:col-span-2">
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Owner <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full px-3 py-2 border border-gray-500 rounded focus:outline-none focus:ring-1 focus:ring-indigo-400 text-sm"
                type="text"
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
              />
            </div>
          </div>

          {/* Current Variants */}
          {variants.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 border-b pb-1 mb-3">
                Product Variants ({variants.length})
              </h2>
              <div className="space-y-4">
                {variants.map((variant, variantIndex) => (
                  <div
                    key={variantIndex}
                    className="bg-white p-4 rounded shadow-sm border border-gray-200"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4">
                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-1">
                          Color <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={variant.color}
                          onChange={(e) =>
                            handleVariantChange(
                              variantIndex,
                              "color",
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 rounded border border-gray-500 focus:outline-none text-sm"
                        >
                          <option value="">Select Color</option>
                          {colors.map((col) => (
                            <option key={col} value={col}>
                              {col.charAt(0).toUpperCase() + col.slice(1)}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-1">
                          Size <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={variant.size}
                          onChange={(e) =>
                            handleVariantChange(
                              variantIndex,
                              "size",
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 rounded border border-gray-500 focus:outline-none text-sm"
                        >
                          <option value="">Select Size</option>
                          {sizes.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-1">
                          Base Price <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-gray-500 text-sm">
                            ₹
                          </span>
                          <input
                            type="number"
                            value={variant.base_price}
                            onChange={(e) =>
                              handleVariantChange(
                                variantIndex,
                                "base_price",
                                e.target.value
                              )
                            }
                            className="w-full pl-7 pr-2 py-2 border border-gray-500 rounded focus:outline-none focus:ring-1 focus:ring-indigo-400 text-sm"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-1">
                          Discount Price{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-gray-500 text-sm">
                            ₹
                          </span>
                          <input
                            type="number"
                            value={variant.discount_price}
                            onChange={(e) =>
                              handleVariantChange(
                                variantIndex,
                                "discount_price",
                                e.target.value
                              )
                            }
                            className="w-full pl-7 pr-2 py-2 border border-gray-500 rounded focus:outline-none focus:ring-1 focus:ring-indigo-400 text-sm"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-1">
                          Stock <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          value={variant.stock}
                          onChange={(e) =>
                            handleVariantChange(
                              variantIndex,
                              "stock",
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-500 rounded focus:outline-none focus:ring-1 focus:ring-indigo-400 text-sm"
                        />
                      </div>
                    </div>

                    {/* Variant Images */}
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-medium mb-1">
                        Variant Images <span className="text-red-500">*</span>
                      </label>
                      <div className="flex flex-wrap gap-3">
                        {variant.productImages &&
                          variant.productImages.map((img, imgIndex) => (
                            <div
                              key={imgIndex}
                              className="relative border-2 border-indigo-500 rounded overflow-hidden group"
                              style={{ width: "8rem", height: "8rem" }}
                            >
                              <img
                                src={img}
                                alt={`Variant ${variantIndex}-${imgIndex}`}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button
                                  type="button"
                                  onClick={() =>
                                    removeVariantImage(variantIndex, imgIndex)
                                  }
                                  className="bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>
                          ))}
                        {/* Add Variant Image */}
                        <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:shadow-sm">
                          <input
                            id={`addVariantImage-${variantIndex}`}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => addVariantImage(variantIndex, e)}
                          />
                          <button
                            type="button"
                            onClick={() =>
                              document
                                .getElementById(`addVariantImage-${variantIndex}`)
                                .click()
                            }
                            className="text-gray-600 text-sm"
                          >
                            {loading ? "Uploading..." : "Add Image"}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => removeVariant(variantIndex)}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded text-white text-sm font-medium transition-colors flex items-center"
                      >
                        <Trash2 size={16} />
                        <span className="ml-1">Remove Variant</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add New Variant */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 border-b pb-1 mb-3">
              Add New Variant
            </h2>
            <div className="p-4 bg-white rounded border border-gray-200">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">
                    Color <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedColor}
                    onChange={(e) => setSelectedColor(e.target.value)}
                    className="w-full px-3 py-2 rounded border border-gray-500 focus:outline-none text-sm"
                  >
                    <option value="">Select Color</option>
                    {colors.map((col) => (
                      <option key={col} value={col}>
                        {col.charAt(0).toUpperCase() + col.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">
                    Size <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                    className="w-full px-3 py-2 rounded border border-gray-500 focus:outline-none text-sm"
                  >
                    <option value="">Select Size</option>
                    {sizes.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">
                    Base Price <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-gray-500 text-sm">
                      ₹
                    </span>
                    <input
                      type="number"
                      placeholder="Min 5000"
                      value={basePrice}
                      onChange={(e) => setBasePrice(e.target.value)}
                      className="w-full pl-7 pr-2 py-2 border border-gray-500 rounded focus:outline-none focus:ring-1 focus:ring-indigo-400 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">
                    Discount Price <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-gray-500 text-sm">
                      ₹
                    </span>
                    <input
                      type="number"
                      placeholder="Enter discount price"
                      value={discountPrice}
                      onChange={(e) => setDiscountPrice(e.target.value)}
                      className="w-full pl-7 pr-2 py-2 border border-gray-500 rounded focus:outline-none focus:ring-1 focus:ring-indigo-400 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">
                    Stock <span className="text-red-500">*</span>
                  </label>
                  <input
                
                    type="number"
                    placeholder="Enter stock"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-500 rounded focus:outline-none focus:ring-1 focus:ring-indigo-400 text-sm"
                  />
                </div>
              </div>

              {/* New Variant Images */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Variant Images <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-3">
                  {variantImages.map((img, index) => (
                    <div
                      key={index}
                      className="relative border-2 border-dashed border-gray-300 rounded overflow-hidden group"
                      style={{ width: "8rem", height: "8rem" }}
                    >
                      {img ? (
                        <>
                          <img
                            src={img}
                            alt={`New Variant ${index}`}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button
                              type="button"
                              onClick={() => removeNewVariantImage(index)}
                              className="bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </>
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors p-2"
                          onClick={() =>
                            document
                              .getElementById(`newVariantImage-${index}`)
                              .click()
                          }
                        >
                          <input
                            id={`newVariantImage-${index}`}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) =>
                              handleProductImageChange(index, e)
                            }
                          />
                          <span className="text-gray-600 text-xs">
                            {loading ? "Uploading..." : "Add Image"}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={addVariant}
                  className="px-4 py-2 bg-black hover:bg-gray-800 rounded text-white text-sm font-medium transition-colors flex items-center"
                  disabled={loading}
                >
                  <Plus size={16} className="mr-1" /> Add Variant
                </button>
              </div>
            </div>
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          {/* Form Actions */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => {
                setShowEditProduct(false);
                localStorage.removeItem("productId");
              }}
              className="px-4 py-2 bg-white border border-gray-400 rounded text-gray-700 text-sm font-medium hover:bg-gray-100 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-black hover:bg-gray-800 rounded text-white text-sm font-medium transition-colors flex items-center"
              disabled={loading}
            >
              <CheckCircle size={16} className="mr-1" /> Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );

};
const RemovedProducts = ({ setShowRemoved }) => {
  const [loading, setLoading] = useState(false);
  const [productsList, setProductsList] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProductsHandler = async (query = "", page = 1) => {
    try {
      setLoading(true);
      const data = await fetchProducts(query, page);
      setProductsList(data.data || []);
      setCurrentPage(data.page || 1);
      setTotalPages(data.totalPages || 1);
      setError("");
    } catch (error) {
      console.log(error);
      setError("Failed to fetch removed products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClick = async (id) => {
    try {
      const response = await restoreProduct(id);
      if (response.status === 200) {
        toast.success("Product Activated!", {
          icon: (
            <img
              src="https://static.thenounproject.com/png/412945-200.png"
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
  

        await fetchProductsHandler(searchInput.trim(), currentPage);
      }
    } catch (error) {
      console.log(error);

      toast.error("Failed to restore product", {
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
  };

  const handleSearch = () => {
    fetchProductsHandler(searchInput.trim(), 1);
  };

  useEffect(() => {
    fetchProductsHandler("", 1);
  }, []);

  useEffect(() => {
    fetchProductsHandler(searchInput.trim(), currentPage);
  }, [currentPage]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto p-6 pb-20">
        {/* Header */}
        <div className="mb-8 flex items-center">
          <div className="bg-black text-white p-3 rounded-full mr-4">
            <Trash2 size={24} />
          </div>
          <h1 className="text-3xl font-bold">Removed Products</h1>
        </div>

        {/* Controls Bar */}
        <div className="bg-white p-5 rounded-lg shadow-md mb-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="w-full md:w-auto flex flex-col md:flex-row items-center gap-4">
              <div className="relative w-full md:w-80">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search removed products..."
                  className="pl-10 pr-10 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black/70"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                {searchInput && (
                  <button
                    onClick={() => {
                      setSearchInput("");
                      fetchProductsHandler("", 1);
                    }}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
              <button
                onClick={handleSearch}
                className="bg-black text-white px-4 py-2 rounded-md flex items-center transition-all hover:bg-gray-800 w-full md:w-auto justify-center"
              >
                <Search size={18} className="mr-2" />
                <span>Search</span>
              </button>
            </div>
            <div className="flex gap-4 w-full md:w-auto">
              <button
                onClick={() => fetchProductsHandler(searchInput.trim(), currentPage)}
                className="bg-white text-black border border-gray-300 px-4 py-2 rounded-md flex items-center transition-all hover:bg-gray-100 w-full md:w-auto justify-center"
              >
                <RefreshCw size={18} className="mr-2" />
                <span>Refresh</span>
              </button>
              <button
                onClick={() => setShowRemoved(false)}
                className="bg-black text-white px-4 py-2 rounded-md flex items-center transition-all hover:bg-gray-800 w-full md:w-auto justify-center"
              >
                <CheckCircle size={18} className="mr-2" />
                <span>View Active</span>
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        {/* Products Section */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="border-b border-gray-200 bg-gray-50 py-4 px-6">
            <h2 className="font-semibold text-lg">Removed Product List</h2>
          </div>

          {loading ? (
            // Shimmer UI while loading
            <div className="divide-y divide-gray-200">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="p-6 animate-pulse">
                  <div className="flex justify-between mb-4">
                    <div className="h-6 bg-gray-200 rounded w-32"></div>
                    <div className="h-6 bg-gray-200 rounded w-24"></div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-4/5 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/5"></div>
                </div>
              ))}
            </div>
          ) : productsList.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {productsList.map((product) => (
                <div key={product._id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div className="flex items-center gap-3 mb-2 md:mb-0">
                      <div className="bg-black text-white p-1.5 rounded-full">
                        <Package size={16} />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{product.name}</h3>
                        <p className="text-sm text-gray-500">
                          ID: {product._id ? product._id.substring(0, 8) : "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-sm text-gray-600">
                        ${product.discount_price || "0.00"} | {product.color || "N/A"} | {product.size || "N/A"}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleClick(product._id)}
                          className="p-2 bg-green-50 text-green-600 rounded-md hover:bg-green-100 transition-colors"
                          title="Restore Product"
                        >
                          <CheckCircle size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <Trash2 size={24} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No removed products found</h3>
              <p className="text-gray-500">All products are currently active or try refreshing the list.</p>
            </div>
          )}
        </div>

        {/* Fixed Pagination UI at Bottom */}
        <div className="fixed bottom-0 left-0 right-0 p-3 bg-white shadow-lg border-t border-gray-200">
          <div className="flex justify-center items-center space-x-4 max-w-xs mx-auto">
            <button
              onClick={() => {
                if (currentPage > 1) {
                  setCurrentPage(currentPage - 1);
                }
              }}
              disabled={currentPage <= 1}
              className="h-10 w-10 flex items-center justify-center rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:hover:bg-gray-100 transition-colors"
              aria-label="Previous page"
            >
              <ArrowLeft size={18} />
            </button>

            <span className="text-sm font-medium">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => {
                if (currentPage < totalPages) {
                  setCurrentPage(currentPage + 1);
                }
              }}
              disabled={currentPage >= totalPages}
              className="h-10 w-10 flex items-center justify-center rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:hover:bg-gray-100 transition-colors"
              aria-label="Next page"
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

//! Products component
const Products = () => {
  const [showAddProduct, setShowAddProduct] = useState(
    localStorage.getItem("showAddProduct") === "true"
  );
  const [showRemoved, setShowRemoved] = useState(
    localStorage.getItem("showRemoved") === "true"
  );
  useEffect(() => {
    localStorage.setItem("showAddProduct", showAddProduct);
  }, [showAddProduct]);

  useEffect(() => {
    localStorage.setItem("showRemoved", showRemoved);
  }, [showRemoved]);
  const [showEditPRoduct, setShowEditProduct] = useState(
    localStorage.getItem("showEditPRoduct") === "true"
  );

  useEffect(() => {
    localStorage.setItem("showEditPRoduct", showEditPRoduct);
  }, [showEditPRoduct]);

  return showEditPRoduct ? (
    <EditProduct setShowEditProduct={setShowEditProduct} />
  ) : showAddProduct ? (
    <AddProduct setShowAddProduct={setShowAddProduct} />
  ) : showRemoved ? (
    <RemovedProducts setShowRemoved={setShowRemoved} />
  ) : (
    <ProductsList
      setShowEditProduct={setShowEditProduct}
      setShowAddProduct={setShowAddProduct}
      setShowRemoved={setShowRemoved}
    />
  );
};

export default Products;
