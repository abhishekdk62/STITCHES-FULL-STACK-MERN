import React, { useState, useEffect } from 'react';
import ReactImageMagnify from 'react-image-magnify';

const ProductImageGallery = ({ productDetails, selectedVariant }) => {
  const [selectedImage, setSelectedImage] = useState('');
  
  useEffect(() => {
    // Set initial image when component mounts or variant changes
    if (productDetails?.variants[0]?.productImages[0]) {
      setSelectedImage(productDetails?.variants[0]?.productImages[0]);
    }
  }, [productDetails]);

  useEffect(() => {
    // Update selected image when variant changes
    if (selectedVariant?.productImages?.length > 0) {
      setSelectedImage(selectedVariant.productImages[0]);
    }
  }, [selectedVariant]);

  return (
    <div className="flex flex-col gap-4 items-center lg:w-1/2 p-6 bg-gray-50">
      <div className="lg:h-100 md:h-80 md:w-75 lg:w-95 relative">
        <ReactImageMagnify
          {...{
            smallImage: {
              alt: "Main product image",
              height: 400,
              width: 309,
              src:
                selectedImage ||
                productDetails?.variants[0]?.productImages[0],
            },
            largeImage: {
              src:
                selectedImage ||
                productDetails?.variants[0]?.productImages[0],
              width: 1200,
              height: 1200,
            },
            enlargedImageContainerDimensions: {
              width: "270%",
              height: "150%",
            },
            lensStyle: { backgroundColor: "rgba(0,0,0,0.2)" },
            isHintEnabled: true,
            shouldHideHintAfterFirstActivation: false,
            hintTextMouse: 'Hover to zoom',
            hintTextTouch: 'Tap to zoom',
            enlargedImageContainerStyle: { zIndex: 9999 },
            hintStyle: {
              color: '#333',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '4px',
              padding: '2px 6px',
              fontSize: '8px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
            }
          }}
        />
      </div>
      
      <div className="flex gap-3">
        {selectedVariant?.productImages?.map((productImage, index) => (
          <div
            key={index}
            onClick={() => setSelectedImage(productImage)}
            className={`cursor-pointer transition-all ${
              selectedImage === productImage ? "ring-1 ring-black" : ""
            }`}
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
  );
};

export default ProductImageGallery;