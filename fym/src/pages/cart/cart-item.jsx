import React, { useState } from "react";
import "./cart-item.css"; // Import CSS file

const CartItem = (props) => {
    const { _id: id, productName, productBudget: price, cat, productImage } = props.data;
    const setAmount = props.setTotalAmount;
    const [count, setCount] = useState(Number(props.count));
    const [error, setError] = useState(null);
    
    const handleAddToCart = async () => {
        try {
            const response = await fetch(`https://projectfym-1.onrender.com/api/customer/cart/${id}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${props.customerUser.token}`
                },
            });

            if (!response.ok) {
                throw new Error("Failed to add to cart");
            }

            // Update the local count state or re-fetch cart details as needed
            setCount(count + 1);

            // Update the total amount
            setAmount((prevAmount) => prevAmount + Number(price));

            // Dispatch an action to update Redux store if you're using Redux

        } catch (error) {
            console.error("Error adding to cart:", error.message);
            setError("Failed to add to cart. Please try again.");
        }
    };

    const handleRemoveFromCart = async () => {
        try {
            const response = await fetch(`https://projectfym-1.onrender.com/api/customer/removeFromCart/${id}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${props.customerUser.token}`
                },
            });

            if (!response.ok) {
                throw new Error("Failed to remove from cart");
            }

            // Update the local count state or re-fetch cart details as needed
            setCount(count - 1);

            // If count becomes zero, handle the removal (you can implement your logic here)

            // Update the total amount
            setAmount((prevAmount) => prevAmount - Number(price));

            // Dispatch an action to update Redux store if you're using Redux

        } catch (error) {
            console.error("Error removing from cart:", error.message);
            setError("Failed to remove from cart. Please try again.");
        }
    };

    // Render the component only if the count is greater than 0
    const imageUrl = productImage.startsWith('productImage-') ? require(`../../../../uploads/${productImage}`) :productImage; 

    return count > 0 ? (
        <div className="cartItem">
            <img src={imageUrl} alt="Loading" />
            <div className="description">
                <p>
                    <b>{productName}</b>
                </p>
                <p>{cat}</p>
                <p> Price: ₹{price}</p>
                {cat === "food" && (
                    <div className="countHandler">
                        <button onClick={handleRemoveFromCart}> - </button>
                        <input
                            value={count}
                            onChange={(e) => setCount(Number(e.target.value))}
                        />
                        <button onClick={handleAddToCart}> + </button>
                    </div>
                )}
                {cat !== "food" && (
                    <button onClick={handleRemoveFromCart}>Delete</button>
                )}
                {error && <p style={{ color: "red" }}>{error}</p>}
            </div>
        </div>
    ) : null;
};

export default CartItem;
