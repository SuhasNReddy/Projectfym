import React, { useEffect, useState } from "react";
import './cart.css'
import CartItem from "./cart-item";
import { useSelector } from 'react-redux'; // Import useSelector from Redux
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import noprodback from "../../Assets/noprodback.png";
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRupeeSign } from '@fortawesome/free-solid-svg-icons';

library.add(faRupeeSign);

export const Cart = (props) => {
  const [cartDetails, setCartDetails] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0); // State variable for total amount
  const customerUser = useSelector(state => state.customerUser); // Get customerUser from Redux store
  const history = useHistory();
  console.log('inside cart', cartDetails);

  useEffect(() => {
    const fetchCartDetails = async () => {
      try {
        if (!customerUser || !customerUser.token) {
          throw new Error("User is not authorized. Please log in.");
        }

        const response = await fetch("https://projectfym-1.onrender.com/api/customer/cart", {
          headers: {
            Authorization: `Bearer ${customerUser.token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch cart details");
        }

        const data = await response.json();
        setCartDetails(data.cartDetails);

        // Calculate total amount and set it in the state
        const calculatedTotalAmount = data.cartDetails.reduce((total, cartItem) => {
          return total + (cartItem.productDetails.productBudget * cartItem.count);
        }, 0);
        setTotalAmount(calculatedTotalAmount);
      } catch (error) {
        console.error("Error fetching cart details:", error.message);
        // Handle the error appropriately
      }
    };

    fetchCartDetails();
  }, [customerUser]);

  return (
    <div className="cartout">
    <div>
        <h1>Your Cart Items</h1>
      </div>
    <div className="cart">
      
      <div className="cartItems">
        {cartDetails.map((cartItem) => (
          <CartItem key={cartItem.productId} data={cartItem.productDetails}  customerUser={customerUser} count={cartItem.count} totalAmount={totalAmount} setTotalAmount={setTotalAmount} />
        ))}
      </div>

      {totalAmount > 0 ? (
        <div className="checkout">
          <p> <b> Subtotal: Rs.{totalAmount} </b></p>
          <button onClick={() => history.push("/customer/shop")}> <b>Continue Shopping </b></button>
          <button className="butt2"
            onClick={() => {
              // Your checkout logic here
              // console.log(totalAmount,"checkout button");
              props.settotalAmountCustomer(totalAmount);
              history.push("/customer/checkout");
            }}
          >
            {" "}
            <b>Checkout</b>{" "}
          </button>
        </div>
      ) : (
        <img src={noprodback} alt="Loading" />
      )}
    </div>
    </div>
  );
};
