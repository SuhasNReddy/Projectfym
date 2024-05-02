import React, { useState } from "react";
import { useSelector } from "react-redux";
import "./wishlist-item.css";

const WishItem = (props) => {
  const { _id: id, productName, productBudget: price, cat: productCategory, productImage } = props.data.productDetails;
  const imageUrl = productImage.startsWith('productImage-') ? require(`../../../../uploads/${productImage}`) :productImage; 
  const customerUser = useSelector((state) => state.customerUser);
  const handleRemoveFromWish = () => {
    props.removeFromWish(id);
  };

  const handleAddToCart = async () => {
    console.log("iasjc")
    try {
      const response = await fetch(`/api/customer/cart/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${customerUser.token}`,
        },
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || 'Error adding to cart on the server');
      }

      // Dispatch an action or update state as needed
      // For example, you can display a success message or update the cart state

      console.log('Item added to cart successfully');
    } catch (error) {
      console.error('Error adding to cart:', error);
      // Handle the error appropriately
    }
  };

  return (
    <div className="wishItem">
      <div className="image-container">
        <img src={imageUrl} alt="Loading" />
        <div className="icons-container">
          <button className="cross-icon" onClick={handleRemoveFromWish}>✖️</button>
          <button className="add-to-cart-icon" onClick={handleAddToCart}>🛒</button>
        </div>
      </div>
      <div className="description">
        <p><b>{productName}</b></p>
        <p>{productCategory}</p>
        <p>Price: ₹{price}</p>
      </div>
    </div>
  );
};

export default WishItem;
