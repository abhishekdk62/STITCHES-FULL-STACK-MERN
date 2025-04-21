import React, { useState } from "react";
import ListProducts from "../../components/user/product/ListProducts";
import Header from "../../components/user/common/Header";
import Footer from "../../components/user/common/Footer";

const ProductsView = () => {
    const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <div>
    <Header selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory}  />
      <div className="px-6 md:px-12 lg:px-20 space-y-12">
        <ListProducts selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
      </div>
      <Footer />
    </div>  
  );
};

export default ProductsView;
