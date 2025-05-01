import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  Package,
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

import CropModal from './CropModal';
import { fetchCategoriesAdmin } from '../../../../services/categoryService';
import { addProduct } from '../../../../services/productService';
const AddProduct = ({ setShowAddProduct }) => {
  // Product fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [brand, setBrand] = useState('');
  const [productImages, setProductImages] = useState(['']); // Start with one field
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [owner, setOwner] = useState('');
  const [categories, setCategories] = useState([]);

  // Variant fields
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [basePrice, setBasePrice] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [stock, setStock] = useState('');
  const [variants, setVariants] = useState([]);

  // Image crop states
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(null);
  const [tempImageSrc, setTempImageSrc] = useState(null);

  // Error state for validations
  const [error, setError] = useState('');

  // Static arrays
  const sizes = ['SM', 'M', 'L', 'XL'];
  const colors = [
    'red',
    'blue',
    'white',
    'black',
    'green',
    'yellow',
    'purple',
    'orange',
    'pink',
    'gray',
  ];

  // Fetch categories on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesData = await fetchCategoriesAdmin();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching categories:', error);
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
    formData.append('file', croppedBlob, 'cropped.jpg');
    formData.append('upload_preset', 'COSTUMES');

    try {
      const res = await fetch(
        'https://api.cloudinary.com/v1_1/dv8xenucq/image/upload',
        {
          method: 'POST',
          body: formData,
        }
      );
      const data = await res.json();
      const newImages = [...productImages];
      newImages[currentImageIndex] = data.secure_url;
      setProductImages(newImages);
    } catch (error) {
      console.error('Error uploading image:', error);
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
    setProductImages([...productImages, '']);
  };

  // Validations for variant details
  const handleVariantValidation = () => {
    if (!selectedColor) {
      setError('Error: Please select a color');
      return false;
    }
    if (!selectedSize) {
      setError('Error: Please select a size');
      return false;
    }
    if (!basePrice) {
      setError('Error: Please enter a base price');
      return false;
    }
    if (Number(basePrice) < 0) {
      setError('Error: Base price must be greater than 0');
      return false;
    }
    if (!discountPrice) {
      setError('Error: Please enter a discount price');
      return false;
    }
    if (Number(discountPrice) > Number(basePrice)) {
      setError('Error: Discount price cannot be more than base price');
      return false;
    }
    if (Number(discountPrice) < 0) {
      setError('Error: Discount price must be more than 0');
      return false;
    }
    if (!stock) {
      setError('Error: Please enter the stock quantity');
      return false;
    }
    if (Number(stock) <= 0) {
      setError('Error: Stock must be greater than 0');
      return false;
    }
    if (
      !productImages ||
      productImages.filter((img) => img && img.trim() !== '').length < 2
    ) {
      setError('Error: Variant must have at least 2 images');
      return false;
    }
    setError('');
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
      setSelectedColor('');
      setSelectedSize('');
      setBasePrice('');
      setDiscountPrice('');
      setStock('');
      setProductImages(['']);
    }
  };

  // Form submission validations
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Reset error

    if (!name.trim()) {
      setError('Product name is required');
      return;
    }
    if (!description.trim()) {
      setError('Product description is required');
      return;
    }
    if (!brand.trim()) {
      setError('Brand is required');
      return;
    }
    if (!category) {
      setError('Category is required');
      return;
    }
    if (!subCategory) {
      setError('Subcategory is required');
      return;
    }
    if (!owner.trim()) {
      setError('Owner is required');
      return;
    }
    if (variants.length === 0) {
      setError('Please add at least one variant');
      return;
    }

    // Validate each variant
    for (let i = 0; i < variants.length; i++) {
      const variant = variants[i];
      if (variant.base_price < 0) {
        setError(
          `Variant ${i + 1} (${variant.color}, ${variant.size}): Base price must be greater than 0`
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
            style={{ filter: 'invert(1)' }}
            alt="Success Icon"
            width="30"
            height="30"
          />
        ),
        style: {
          border: '1px solid #0f5132',
          padding: '16px',
          color: 'white',
          background: 'black',
          fontSize: '14px',
          fontWeight: 'bold',
        },
        autoClose: 5000,
      });

      // Reset form fields on success
      setName('');
      setDescription('');
      setBrand('');
      setProductImages(['']);
      setBasePrice('');
      setDiscountPrice('');
      setCategory('');
      setSubCategory('');
      setOwner('');
      setVariants([]);
    } catch (error) {
      setError(`Error: ${error.message || 'Something went wrong'}`);
      console.error(error);
    }
  };

  const removeVariant = (index) => {
    const updatedVariants = [...variants];
    updatedVariants.splice(index, 1);
    setVariants(updatedVariants);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 pb-24">
   



      <div className="mb-8 flex items-center">
                  <div className="bg-black text-white p-3 rounded-full mr-4">
                    <Package size={20} sm:size={24} />
                  </div>
                  <h1 className="text-lg sm:text-2xl font-bold">Add New Product</h1>
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
                    setSubCategory('');
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
                        img
                          ? 'border-indigo-500'
                          : 'border-dashed border-gray-300'
                      } rounded overflow-hidden group transition-all hover:shadow-sm`}
                      style={{ aspectRatio: '309/400' }}
                    >
                      {img ? (
                        <>
                          <img
                            src={img}
                            alt={`Uploaded ${index}`}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 w-full h-full bg-black bg-opacity-40 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity flex items-center justify-center">
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
                      </span>
                      <input
                        type="number"
                        placeholder="Min 0"
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
          <div className="flex justify-between  space-x-4 mt-6">
            {error && <p className="text-red-500 text-xs">{error}</p>}
            <button
              onClick={() => setShowAddProduct(false)}
              className="px-4 py-1 bg-black hover:bg-gray-800 rounded text-white text-sm font-medium transition-colors flex items-center"
            >
              Cancel
            </button>
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

export default AddProduct;
