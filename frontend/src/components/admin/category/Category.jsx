import React, { useState, useEffect } from 'react';
import CategoryList from './elements/CategoryList';
import AddCategory from './elements/AddCategory';
import EditCategory from './elements/EditCategory';
import RemovedCategory from './elements/RemovedCategory';

const Category = () => {
  const [showAddCategory, setShowAddCategory] = useState(
    localStorage.getItem('showAddCategory') === 'true'
  );
  const [editCategory, setEditCategory] = useState(
    localStorage.getItem('editCategory') === 'true'
  );
  const [showRemovedCategory, setShowRemovedCategory] = useState(
    localStorage.getItem('showRemovedCategory') === 'true'
  );

  useEffect(() => {
    localStorage.setItem('showAddCategory', showAddCategory);
    localStorage.setItem('editCategory', editCategory);
    localStorage.setItem('showRemovedCategory', showRemovedCategory);
  }, [showAddCategory, editCategory, showRemovedCategory]);

  return editCategory ? (
    <EditCategory setEditCategory={setEditCategory} />
  ) : showAddCategory ? (
    <AddCategory setShowAddCategory={setShowAddCategory} />
  ) : showRemovedCategory ? (
    <RemovedCategory
      setShowRemovedCategory={setShowRemovedCategory}
      showRemovedCategory={showRemovedCategory}
    />
  ) : (
    <CategoryList
      setEditCategory={setEditCategory}
      setShowAddCategory={setShowAddCategory}
      setShowRemovedCategory={setShowRemovedCategory}
    />
  );
};

export default Category;
