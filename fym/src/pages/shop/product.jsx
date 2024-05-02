import React, { useContext, useState } from "react";
import { useSelector } from "react-redux"; // Import useSelector
import "./product.css";
import { ShoppingCart, Heart } from 'phosphor-react';
import { NavLink } from "react-router-dom/cjs/react-router-dom.min";

const Product = (props) => {
    const { _id, productName, productBudget, cat, subCat, productImage } = props.data;

    // Use useSelector to get the customerUser from the Redux store
    const customerUser = useSelector(state => state.customerUser);
    console.log('Product.js',customerUser);

    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState(''); // Add state for success message

    const addToCart = async (productId) => {
        console.log("inside add to cart", productId, customerUser)
        try {
            const response = await fetch(`https://projectfym-1.onrender.com/api/customer/cart/${productId}`, {
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

            // If successfully added to cart, set success message
            setSuccessMsg('Item added to cart successfully');
            setErrorMsg(''); // Clear any previous error message

            const updatedUser = await response.json();
            // Assuming the server returns the updated user object
            // Dispatch an action to update customerUser in the Redux store if needed

            console.log('Item added to cart successfully');
        } catch (error) {
            console.error('Error adding to cart:', error);
            setErrorMsg(error.message || 'Error adding to cart. Please try again.');
            setSuccessMsg(''); // Clear any previous success message
        }
    };

    const addToWish = async (productId) => {
        try {
            const response = await fetch(`https://projectfym-1.onrender.com/api/customer/wishlist/${productId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${customerUser.token}`,
                },
            });
    
            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(errorMessage || 'Error adding to wishlist on the server');
            }
    
            // If successfully added to wishlist, set success message
            setSuccessMsg('Item added to wishlist successfully');
            setErrorMsg(''); // Clear any previous error message
    
            // Assuming the server returns the updated user object
            // Dispatch an action to update customerUser in the Redux store if needed
    
            console.log('Item added to wishlist successfully');
        } catch (error) {
            console.error('Error adding to wishlist:', error);
            // setErrorMsg(error.message || 'Error adding to wishlist. Please try again.');
            setSuccessMsg('Item already in Wishlist'); // Clear any previous success message
        }
    };
    
    const imageUrl = productImage.startsWith('productImage-') ? require(`../../../../uploads/${productImage}`) :productImage; 
    return (
        <div className="product">
            <NavLink to={`/customer/product/${_id}`}>
                <img src={imageUrl} alt="Loading"></img>
            </NavLink>
            <div className="description">
                <p><b>{productName}</b></p>
                <p>Category: {cat}</p>
                <p><b>Price:</b> ₹{productBudget}</p>
                <p>Subcategory: {subCat}</p>
            </div>
            <div className='btns'>
                <button className="addToCartBttn" onClick={() => addToCart(_id)}>
                    <ShoppingCart size={21} /> 
                </button>
                <button className="addToCartBttn" onClick={() => addToWish(_id)}>
                    <Heart size={21} /> {/* Assuming addToWish is defined elsewhere */}
                </button>
            </div>
            {errorMsg && <div className="error">{errorMsg}</div>}
            {successMsg && <div className="success">{successMsg}</div>}
        </div>
    );
};

export default Product;
