import React, { useState, useEffect } from 'react';
import { X, Trash2, CheckCircle, Plus, Package, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchCategoriesAdmin } from '../../../../services/categoryService';
import {
  editProductService,
  fetchProduct,
} from '../../../../services/productService';
import CropModal from './CropModal';
const EditProduct = ({ setShowEditProduct }) => {
  const [productDetails, setProductDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [owner, setOwner] = useState('');
  const [productImages, setProductImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [variants, setVariants] = useState([]);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [basePrice, setBasePrice] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [stock, setStock] = useState('');
  const [variantImages, setVariantImages] = useState(['']);
  // Add these with your other state declarations
const [cropModalOpen, setCropModalOpen] = useState(false);
const [currentImageIndex, setCurrentImageIndex] = useState(null);
const [tempImageSrc, setTempImageSrc] = useState(null);
const [currentVariantIndex, setCurrentVariantIndex] = useState(null); // For variant images
// Add these functions in your component

// For product images
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

// For variant images
const handleVariantFileChange = (variantIndex, imgIndex, event) => {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    setTempImageSrc(reader.result);
    setCurrentImageIndex(imgIndex);
    setCurrentVariantIndex(variantIndex);
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
    
    if (currentVariantIndex !== null) {
      // Handle variant image crop
      const updatedVariants = [...variants];
      if (!updatedVariants[currentVariantIndex].productImages) {
        updatedVariants[currentVariantIndex].productImages = [];
      }
      
      const newImages = [...updatedVariants[currentVariantIndex].productImages];
      newImages[currentImageIndex] = data.secure_url;
      updatedVariants[currentVariantIndex].productImages = newImages;
      setVariants(updatedVariants);
    } else {
      // Handle product image crop
      const newImages = [...productImages];
      newImages[currentImageIndex] = data.secure_url;
      setProductImages(newImages);
    }
  } catch (error) {
    console.error('Error uploading image:', error);
    toast.error('Failed to upload image');
  } finally {
    setCropModalOpen(false);
    setTempImageSrc(null);
    setCurrentImageIndex(null);
    setCurrentVariantIndex(null);
  }
};
  const sizes = ['SM', 'M', 'L', 'XL'];
  const colors = [
    'red',
    'blue',
    'white',
    'pink',
    'black',
    'green',
    'yellow',
    'purple',
    'orange',
    'gray',
  ];
  useEffect(() => {
    const id = localStorage.getItem('productId');
    const getProductData = async () => {
      try {
        const productData = await fetchProduct(id);
        setProductDetails(productData);
        console.log('Product data:', productData);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    const getCategoriesData = async () => {
      try {
        const cats = await fetchCategoriesAdmin();
        setCategories(cats);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    getProductData();
    getCategoriesData();
  }, []);
  useEffect(() => {
    if (productDetails) {
      setName(productDetails.name || '');
      setDescription(productDetails.description || '');
      setBrand(productDetails.brand || '');
      setCategory(productDetails.category || '');
      setSubCategory(productDetails.subCategory || '');
      setOwner(productDetails.owner || '');
      if (
        productDetails.productImages &&
        productDetails.productImages.length > 0
      ) {
        setProductImages(
          productDetails.productImages.filter(
            (img) => img && (img.startsWith('http') || img.startsWith('https'))
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
    formData.append('file', file);
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
      setLoading(false);
      return data.secure_url;
    } catch (error) {
      console.error('Error uploading image:', error);
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
  const [error, setError] = useState('');
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
      console.error('Error uploading variant image:', error);
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
        setVariantImages([...newImages, '']);
      }
    };
    reader.readAsDataURL(file);
  };

  const uploadVariantImages = async () => {
    const uploadedUrls = [];
    const filledImages = variantImages.filter((img) => img && img !== '');
    if (filledImages.length === 0) return [];

    setLoading(true);
    for (const imageData of filledImages) {
      if (imageData.startsWith('http')) {
        uploadedUrls.push(imageData);
        continue;
      }
      const file = await dataURLtoFile(imageData, 'variant-image.jpg');
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
      const arr = dataurl.split(',');
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
      toast.error('Each variant must have at least 2 images.', {
        icon: (
          <img
            src="https://static.thenounproject.com/png/3941-200.png"
            className="animate-bounce"
            style={{ filter: 'invert(1)' }}
            alt="Success Icon"
            width="30"
            height="30"
          />
        ),
        style: {
          padding: '16px',
          color: 'white',
          background: '#ff6666',
          fontSize: '14px',
          fontWeight: 'bold',
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
    // First validate all required fields are filled
    if (!(selectedColor && selectedSize && basePrice && discountPrice && stock)) {
      setError('Please fill in all variant fields');
      return;
    }
  
    // Validate prices and stock
    if (Number(basePrice) <= 0) {
      setError('Base price must be greater than 0');
      return;
    }
    if (Number(discountPrice) <= 0) {
      setError('Discount price must be greater than 0');
      return;
    }
    if (Number(discountPrice) > Number(basePrice)) {
      setError('Discount price cannot be more than base price');
      return;
    }
    if (Number(stock) <= 0) {
      setError('Stock must be greater than 0');
      return;
    }
  
    // Check we have at least 2 images (already cropped and uploaded)
    const filledImages = variantImages.filter(img => img && img !== '');
    if (filledImages.length < 2) {
      setError('Add at least two product images');
      return;
    }
  
    setLoading(true);
  
    try {
      const newVariant = {
        color: selectedColor,
        size: selectedSize,
        base_price: Number(basePrice),
        discount_price: Number(discountPrice),
        stock: Number(stock),
        productImages: filledImages, // Use the already uploaded/cropped images
      };
  
      setVariants([...variants, newVariant]);
      
      // Reset form fields
      setSelectedColor('');
      setSelectedSize('');
      setBasePrice('');
      setDiscountPrice('');
      setStock('');
      setVariantImages(['']); // Reset with one empty field
      setError('');
    } catch (error) {
      console.error('Error adding variant:', error);
      setError('Failed to add variant. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const removeVariant = (index) => {
    const updatedVariants = [...variants];
    updatedVariants.splice(index, 1);
    setVariants(updatedVariants);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (loading) {
      setError('Please wait for images to finish uploading');
      return;
    }
    if (!name.trim()) {
      setError('Error: Product name is required');
      return;
    }
    if (!description.trim()) {
      setError('Error: Product description is required');
      return;
    }
    if (!brand.trim()) {
      setError('Error: Brand is required');
      return;
    }
    if (!category) {
      setError('Error: Category is required');
      return;
    }
    if (!subCategory) {
      setError('Error: Subcategory is required');
      return;
    }
    if (!owner.trim()) {
      setError('Error: Owner is required');
      return;
    }
    if (variants.length === 0) {
      setError('Error: Please add at least one variant');
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
      if (variantImgs.filter((img) => img && img.trim() !== '').length < 2) {
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
      setError(''); // Clear error on success
      // Optionally display a success message elsewhere
      setShowEditProduct(false);
      localStorage.removeItem('productId');
    } catch (error) {
      console.log('Error updating product:', error);
      setError(
        `Error updating product: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  useEffect(() => {
    if (productDetails) {
      setCategory(productDetails.category ? productDetails.category._id : '');
    }
  }, [productDetails]);

  return (
    <div className="max-w-7xl bg-gray-50 mx-auto p-4 sm:p-6 pb-24">
          
    {cropModalOpen && tempImageSrc && (
      <CropModal
        imageSrc={tempImageSrc}
        onCrop={handleCrop}
        onClose={() => setCropModalOpen(false)}
        aspect={309 / 400}
      />
    )}
      <div className=" flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
      <div className="mb-8 flex items-center">
                  <div className="bg-black text-white p-3 rounded-full mr-4">
                    <Package size={20} sm:size={24} />
                  </div>
                  <h1 className="text-lg sm:text-2xl font-bold">Add New Product</h1>
                </div>
        <button
          onClick={() => {
            setShowEditProduct(false);
            localStorage.removeItem('productId');
          }}
          className="text-white hover:bg-gray-700 rounded-full p-1 transition-colors self-end"
        >
          <X size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="p-4  sm:p-6 lg:p-8">
        {loading && (
          <div className="mb-4 p-2 bg-blue-100 text-blue-700 rounded text-xs sm:text-sm">
            Uploading images... Please wait.
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Basic Product Information */}
          <div className="grid p-3 bg-white rounded-xl grid-cols-1 gap-4 sm:gap-6 mb-6">
            <h2 className="text-base sm:text-lg font-semibold text-gray-800 border-b pb-1 mb-3">
              Product Information
            </h2>
            <div>
              <label className="block text-gray-700 text-xs sm:text-sm font-medium mb-1">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-500 rounded focus:outline-none focus:ring-1 focus:ring-indigo-400"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-gray-700 text-xs sm:text-sm font-medium mb-1">
                Product Description <span className="text-red-500">*</span>
              </label>
              <textarea
                className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-500 rounded focus:outline-none focus:ring-1 focus:ring-indigo-400"
                rows="4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>
            <div>
              <label className="block text-gray-700 text-xs sm:text-sm font-medium mb-1">
                Brand <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-500 rounded focus:outline-none focus:ring-1 focus:ring-indigo-400"
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              />
            </div>
          </div>

          {/* Category Selection */}
          <div className="grid p-3 bg-white rounded-xl grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
            <div>
              <label className="block text-gray-700 text-xs sm:text-sm font-medium mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-500 rounded focus:outline-none focus:ring-1 focus:ring-indigo-400"
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
            <div>
              <label className="block text-gray-700 text-xs sm:text-sm font-medium mb-1">
                Subcategory <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-500 rounded focus:outline-none focus:ring-1 focus:ring-indigo-400"
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
              >
                <option value="">Select Subcategory</option>
                {categories
                  .find((cat) => cat._id === category)
                  ?.subCategories.map((subCat, i) => (
                    <option key={i} value={subCat}>
                      {subCat}
                    </option>
                  ))}
              </select>
            </div>
            <div className="lg:col-span-2">
              <label className="block text-gray-700 text-xs sm:text-sm font-medium mb-1">
                Owner <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-500 rounded focus:outline-none focus:ring-1 focus:ring-indigo-400"
                type="text"
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
              />
            </div>
          </div>

          {/* Current Variants */}
          {variants.length > 0 && (
            <div className="mb-6 p-3 bg-white rounded-xl">
              <h2 className="text-base sm:text-lg font-semibold text-gray-800 border-b pb-1 mb-3">
                Product Variants ({variants.length})
              </h2>
              <div className="space-y-4">
                {variants.map((variant, idx) => (
                  <div
                    key={idx}
                    className="bg-white p-4 sm:p-6 rounded   border-gray-200"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4">
                      {/** Color / Size / Prices / Stock */}
                      {['color', 'size'].map((field, i) => (
                        <div key={i}>
                          <label className="block text-gray-700 text-xs sm:text-sm font-medium mb-1">
                            {field.charAt(0).toUpperCase() + field.slice(1)}{' '}
                            <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={variant[field]}
                            onChange={(e) =>
                              handleVariantChange(idx, field, e.target.value)
                            }
                            className="w-full px-2 sm:px-3 py-2 text-xs sm:text-sm rounded border border-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                          >
                            <option value="">Select {field}</option>
                            {(field === 'color' ? colors : sizes).map((opt) => (
                              <option key={opt} value={opt}>
                                {field === 'color'
                                  ? opt.charAt(0).toUpperCase() + opt.slice(1)
                                  : opt}
                              </option>
                            ))}
                          </select>
                        </div>
                      ))}
                      {['base_price', 'discount_price', 'stock'].map(
                        (field, i) => (
                          <div key={i}>
                            <label className="block text-gray-700 text-xs sm:text-sm font-medium mb-1">
                              {field
                                .replace('_', ' ')
                                .replace(/\b\w/g, (c) => c.toUpperCase())}{' '}
                              <span className="text-red-500">*</span>
                            </label>
                            <div
                              className={field !== 'stock' ? 'relative' : ''}
                            >
                              {field !== 'stock' && (
                                <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-gray-500 text-xs sm:text-sm">
                                </span>
                              )}
                              <input
                                type="number"
                                value={variant[field]}
                                onChange={(e) =>
                                  handleVariantChange(
                                    idx,
                                    field,
                                    e.target.value
                                  )
                                }
                                className={`w-full px-${
                                  field !== 'stock'
                                    ? field === 'stock'
                                      ? '3'
                                      : '7'
                                    : '3'
                                } py-2 text-xs sm:text-sm border border-gray-500 rounded focus:outline-none focus:ring-1 focus:ring-indigo-400`}
                              />
                            </div>
                          </div>
                        )
                      )}
                    </div>

                    {/* Variant Images */}
                    <div className="mb-4">
                      <label className="block text-gray-700 text-xs sm:text-sm font-medium mb-1">
                        Variant Images <span className="text-red-500">*</span>
                      </label>
                      <div className="flex flex-wrap gap-3">
  {variant.productImages?.map((img, imgIndex) => (
    <div
      key={imgIndex}
      className="relative border-2 border-indigo-500 rounded overflow-hidden group w-24 h-24 sm:w-32 sm:h-32"
    >
      <img
        src={img}
        alt={`Variant ${idx}-${imgIndex}`}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 w-full h-full bg-black bg-opacity-50 opacity-100 lg:opacity-0 sm:group-hover:opacity-100 flex items-center justify-center transition-opacity">
        <button
          type="button"
          onClick={() => removeVariantImage(idx, imgIndex)}
          className="bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  ))}
  <div className="w-24 h-24 sm:w-32 sm:h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:shadow-sm">
    <input
      id={`addVariantImage-${idx}`}
      type="file"
      accept="image/*"
      className="hidden"
      onChange={(e) => handleVariantFileChange(idx, variant.productImages?.length || 0, e)}
    />
    <button
      type="button"
      onClick={() => document.getElementById(`addVariantImage-${idx}`).click()}
      className="text-gray-600 text-xs sm:text-sm flex flex-col items-center"
    >
      <Upload size={20} className="text-gray-400 mb-1" />
      <span>Add Image</span>
    </button>
  </div>
</div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => removeVariant(idx)}
                        className="px-3 sm:px-4 py-2 bg-red-500 hover:bg-red-600 rounded text-white text-xs sm:text-sm font-medium flex items-center transition-colors"
                      >
                        <Trash2 size={14} className="mr-1" />
                        <span>Remove Variant</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add New Variant */}
          <div className="mb-6">
            <h2 className="text-base sm:text-lg font-semibold text-gray-800 border-b pb-1 mb-3">
              Add New Variant
            </h2>
            <div className="p-4 sm:p-6 bg-white rounded border border-gray-200">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4">
                {['Color', 'Size'].map((field, i) => (
                  <div key={i}>
                    <label className="block text-gray-700 text-xs sm:text-sm font-medium mb-1">
                      {field} <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={field === 'Color' ? selectedColor : selectedSize}
                      onChange={(e) =>
                        field === 'Color'
                          ? setSelectedColor(e.target.value)
                          : setSelectedSize(e.target.value)
                      }
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded border border-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                    >
                      <option value="">Select {field}</option>
                      {(field === 'Color' ? colors : sizes).map((opt) => (
                        <option key={opt} value={opt}>
                          {field === 'Color'
                            ? opt.charAt(0).toUpperCase() + opt.slice(1)
                            : opt}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
                {['basePrice', 'discountPrice', 'stock'].map((field, i) => (
                  <div key={i}>
                    <label className="block text-gray-700 text-xs sm:text-sm font-medium mb-1">
                      {field.replace(/([A-Z])/g, ' $1')}{' '}
                      <span className="text-red-500">*</span>
                    </label>
                    <div className={field !== 'stock' ? 'relative' : ''}>
                      {field !== 'stock' && (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-gray-500 text-xs sm:text-sm">
                        </span>
                      )}
                      <input
                        type="number"
                        placeholder={
                          field === 'basePrice'
                            ? 'Min 0'
                            : field === 'discountPrice'
                              ? 'Enter discount price'
                              : 'Enter stock'
                        }
                        value={
                          field === 'basePrice'
                            ? basePrice
                            : field === 'discountPrice'
                              ? discountPrice
                              : stock
                        }
                        onChange={(e) =>
                          field === 'basePrice'
                            ? setBasePrice(e.target.value)
                            : field === 'discountPrice'
                              ? setDiscountPrice(e.target.value)
                              : setStock(e.target.value)
                        }
                        className={`w-full px-${
                          field !== 'stock'
                            ? field === 'stock'
                              ? '3'
                              : '7'
                            : '3'
                        } py-2 text-xs sm:text-sm border border-gray-500 rounded focus:outline-none focus:ring-1 focus:ring-indigo-400`}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* New Variant Images */}
              <div className="mb-4">
                <label className="block text-gray-700 text-xs sm:text-sm font-medium mb-1">
                  Variant Images <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-3">
  {variantImages.map((img, index) => (
    <div
      key={index}
      className={`relative border-2 ${
        img ? 'border-indigo-500' : 'border-dashed border-gray-300'
      } rounded overflow-hidden group w-24 h-24 sm:w-32 sm:h-32`}
    >
      {img ? (
        <>
          <img
            src={img}
            alt={`Product ${index}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 flex items-center justify-center transition-opacity">
            <button
              type="button"
              onClick={() => removeProductImage(index)}
              className="bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
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
            className="w-full h-full flex items-center justify-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors p-2 text-xs sm:text-sm"
          >
            <Upload size={20} className="text-gray-400 mb-1" />
            <span>Upload</span>
          </div>
        </>
      )}
    </div>
  ))}
  <button
    type="button"
    onClick={() => setProductImages([...productImages, ''])}
    className="w-24 h-24 sm:w-32 sm:h-32 flex items-center justify-center border-2 border-dashed border-gray-300 rounded hover:bg-gray-50"
  >
    <Plus size={24} className="text-gray-400" />
  </button>
</div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={addVariant}
                  className="px-3 sm:px-4 py-2 bg-black hover:bg-gray-800 rounded text-white text-xs sm:text-sm font-medium transition-colors flex items-center"
                  disabled={loading}
                >
                  <Plus size={16} className="mr-1" /> Add Variant
                </button>
              </div>
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-xs sm:text-sm mt-2">{error}</p>
          )}

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row justify-end sm:space-x-4 space-y-2 sm:space-y-0 mt-4">
            <button
              type="button"
              onClick={() => {
                setShowEditProduct(false);
                localStorage.removeItem('productId');
              }}
              className="w-full sm:w-auto px-4 py-2 bg-white border border-gray-400 rounded text-gray-700 text-xs sm:text-sm font-medium hover:bg-gray-100 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-4 py-2 bg-black hover:bg-gray-800 rounded text-white text-xs sm:text-sm font-medium transition-colors flex items-center justify-center"
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
