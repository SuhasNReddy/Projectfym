import React, { useState, createContext, useContext } from "react";
import PRODUCTS from "../products";

export const ShopContext = createContext(null);

const getDefaultCart = () => {
  let cart = {};

  for (let i = 0; i <= PRODUCTS.length; i++) {
    cart[i] = 0;
  }
  return cart;
};

const getDefaultWish = () => {
  let wish = {};

  for (let j = 0; j <= PRODUCTS.length; j++) {
    wish[j] = 0;
  }
  return wish;
};

export const ShopContextProvider = (props) => {
  const [cartItems, setCartItems] = useState(getDefaultCart());
  const [wishItems, setWishItems] = useState(getDefaultWish());
  const [customerUser, setCustomerUser] = useState({ token: null }); // Added customerUser state

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = PRODUCTS.find((product) => product._id === Number(item));
        totalAmount += cartItems[item] * itemInfo.price;
      }
    }
    return totalAmount;
  };

  const getTotalWishAmount = () => {
    let Amount = 0;
    for (const item in wishItems) {
      if (wishItems[item] > 0) {
        let itemInfo = PRODUCTS.find((product) => product._id === Number(item));
        Amount += wishItems[item] * itemInfo.price;
      }
    }
    return Amount;
  };

  const addToCart = (itemId) => {
    console.log('Adding to cart:', itemId);
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
  };

  const addToWish = (itemId) => {
    console.log('Adding to wish:', itemId);
    setWishItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
  };

  const removeFromCart = (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
  };

  const updateCartItemCount = (newAmount, itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: newAmount }));
  };

  const checkout = () => {
    setCartItems(getDefaultCart());
  };

  const removeFromWish = (itemId) => {
    setWishItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
  };

  const contextValue = {
    cartItems,
    addToCart,
    removeFromCart,
    updateCartItemCount,
    getTotalCartAmount,
    checkout,
    wishItems,
    addToWish,
    removeFromWish,
    getTotalWishAmount,
    customerUser, // Include customerUser in the context
    setCustomerUser
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};
