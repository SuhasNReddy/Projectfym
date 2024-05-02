// ProductForm component

import React, { useState, useEffect } from 'react';

const ProductForm = ({ product, handleUpdate, handleCancel }) => {
  const [editedProduct, setEditedProduct] = useState({ ...product });

  useEffect(() => {
    setEditedProduct({ ...product });
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleUpdate(editedProduct);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Product Name:
        <input type="text" name="productName" value={editedProduct.productName} onChange={handleChange} />
      </label>
      <label>
        Description:
        <textarea name="productDescription" value={editedProduct.productDescription} onChange={handleChange} />
      </label>
      {/* Add other fields based on your product structure */}
      <button type="submit">Update</button>
      <button type="button" onClick={handleCancel}>
        Cancel
      </button>
    </form>
  );
};

export default ProductForm;
