import React from 'react';
import ProductDetails from '../../components/user/product/ProductDetails';
import Header from '../../components/user/common/Header';
import Footer from '../../components/user/common/Footer';
import { useState } from 'react';
import PromotionalBanner from '../../components/user/common/PromotionalBanner';

const ProductView = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <div>
      <PromotionalBanner />
      <Header
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      <div className="px-6 md:px-12 lg:px-20 space-y-12">
        <ProductDetails />
      </div>
      <Footer />
    </div>
  );
};

export default ProductView;
