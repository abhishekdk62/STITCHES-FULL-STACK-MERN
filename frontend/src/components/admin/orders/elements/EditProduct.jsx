import React, { useState, useEffect } from "react";
import { X, Trash2, CheckCircle, Plus } from "lucide-react";
import toast from "react-hot-toast";
import { fetchCategoriesAdmin } from "../../../../services/categoryService";
import {
  editProductService,
  fetchProduct,
} from "../../../../services/productService";
const EditProduct = ({ setShowEditProduct }) => {
  const [productDetails, setProductDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [owner, setOwner] = useState("");
  const [productImages, setProductImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [variants, setVariants] = useState([]);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [stock, setStock] = useState("");
  const [variantImages, setVariantImages] = useState([""]);
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
  const [error, setError] = useState("");
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

  const addVariantImage = async (variantIndex, event) => {
    const file = event.target.files[0];
    if (!file) return;
    await handleVariantImageUpload(variantIndex, file);
  };

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
    if (
      !(selectedColor && selectedSize && basePrice && discountPrice && stock)
    ) {
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
    setError("");
    setLoading(false);
  };

  const removeVariant = (index) => {
    const updatedVariants = [...variants];
    updatedVariants.splice(index, 1);
    setVariants(updatedVariants);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

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

    for (let i = 0; i < variants.length; i++) {
      const variant = variants[i];
      if (!variant.color || !variant.size) {
        setError(
          `Error: Variant ${i + 1} is missing color or size information`
        );
        return;
      }
      if (variant.base_price < 0) {
        setError(
          `Error: Variant ${i + 1} (${variant.color}, ${
            variant.size
          }): Base price must be greater than 0`
        );
        return;
      }
      if (variant.discount_price > variant.base_price) {
        setError(
          `Error: Variant ${i + 1} (${variant.color}, ${
            variant.size
          }): Discount price cannot be more than base price`
        );
        return;
      }
      const variantImgs = variant.productImages || [];
      if (variantImgs.filter((img) => img && img.trim() !== "").length < 2) {
        setError(
          `Error: Variant ${i + 1} (${variant.color}, ${
            variant.size
          }) must have at least 2 images`
        );
        return;
      }
      if (variant.stock <= 0) {
        setError(
          `Error: Variant ${i + 1} (${variant.color}, ${
            variant.size
          }): Stock must be greater than 0`
        );
        return;
      }
    }

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
        `Error updating product: ${
          error.response?.data?.message || error.message
        }`
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
                          Discount Price <span className="text-red-500">*</span>
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
                                .getElementById(
                                  `addVariantImage-${variantIndex}`
                                )
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
                            onChange={(e) => handleProductImageChange(index, e)}
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

export default EditProduct;
