import React, { useState, useEffect } from 'react';
import AddProduct from './elements/AddProduct';
import EditProduct from './elements/EditProduct';
import ProductsList from './elements/ProductsList';
import RemovedProducts from './elements/RemovedProducts';

const Products = () => {
  const [showAddProduct, setShowAddProduct] = useState(
    localStorage.getItem('showAddProduct') === 'true'
  );
  const [showRemoved, setShowRemoved] = useState(
    localStorage.getItem('showRemoved') === 'true'
  );
  const [showEditProduct, setShowEditProduct] = useState(
    localStorage.getItem('showEditProduct') === 'true'
  );

  useEffect(() => {
    localStorage.setItem('showAddProduct', showAddProduct);
  }, [showAddProduct]);

  useEffect(() => {
    localStorage.setItem('showRemoved', showRemoved);
  }, [showRemoved]);

  useEffect(() => {
    localStorage.setItem('showEditProduct', showEditProduct);
  }, [showEditProduct]);

  return showEditProduct ? (
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
