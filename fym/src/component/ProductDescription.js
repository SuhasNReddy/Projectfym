// ProductDescription component

import React from 'react';
import ProductForm from './ProductForm';
// import image from '../../../uploads'

const ProductDescription = ({ product, isEditing, handleEdit, handleUpdate }) => {
  
    const productDetailsStyle = {
        display: 'flex',
        marginTop: '20px',
        border: '1px solid #e0e0e0',
        borderRadius: '10px',
        padding: '20px',
        margin: 'auto',
        width: '400px',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
      };
    
      const productImageStyle = {
        width: '150px',
        height: '150px',
        objectFit: 'cover',
        borderRadius: '8px',
        marginRight: '20px',
      };
    
      const detailsStyle = {
        flex: '1',
      };
    
      const priceStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '15px',
      };
    
      const descriptionStyle = {
        marginTop: '15px',
        fontSize: '14px',
        lineHeight: '1.4',
        color: '#555',
      };
    
      const categorySubcategoryStyle = {
        marginTop: '15px',
        fontSize: '12px',
        color: '#777',
      };
      const imageUrl = product.productImage.startsWith('productImage-') ? require(`../../../uploads/${product.productImage}`) :product.productImage; 

  return (
    <div style={productDetailsStyle}>
      {isEditing ? (
        <ProductForm product={product} handleUpdate={handleUpdate} handleCancel={handleEdit} />
      ) : (
        <>  
          <img
        src={imageUrl || "./images/default-image.jpg"}
        alt={product.productName}
        style={productImageStyle}
      />
      <div style={detailsStyle}>
        <h2 style={{ fontSize: '18px', marginBottom: '10px' }}>{product.productName}</h2>
        <p style={descriptionStyle}>{product.productDescription}</p>
        <div style={priceStyle}>
          <p><strong>Cost:</strong> ${product.productBudget}</p>
          <p><strong>Discount:</strong> {product.productDiscount}%</p>
        </div>
        <p style={categorySubcategoryStyle}><strong>Category:</strong> {product.cat}</p>
        <p style={categorySubcategoryStyle}><strong>Subcategory:</strong> {product.subCat}</p>
      </div>
          <button onClick={handleEdit}>Edit</button>
        </>
      )}
    </div>
  );
};

export default ProductDescription;
