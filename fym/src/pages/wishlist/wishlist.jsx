import React, { useState, useEffect } from "react";
import "./wishlist.css";
import { useSelector } from "react-redux";
import WishItem from "./wishlist-item";
import noprodback from "../../Assets/noprodback.png";
import { useHistory } from "react-router-dom/cjs/react-router-dom";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const history = useHistory();
  const customerUser = useSelector((state) => state.customerUser);
  console.log(customerUser, "inside wish");

  const removeFromWish = async (productId) => {
    try {
      // Make an API call to remove the item from the wishlist in the database
      const response = await fetch(`https://projectfym-1.onrender.com/api/customer/removeFromWishlist/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${customerUser.token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to remove item from wishlist");
      }

      // Update the wishlist in the component state after successful removal
      setWishlist((prevWishlist) => prevWishlist.filter((item) => item.productId !== productId));
    } catch (error) {
      console.error("Error removing item from wishlist:", error.message);
      setError("Failed to remove item from wishlist");
    }
  };

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        // Check if customerUser is not null before making the request
        if (customerUser && customerUser.token) {
          const response = await fetch("https://projectfym-1.onrender.com/api/customer/wishlist", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${customerUser.token}`
            }
          });

          if (!response.ok) {
            throw new Error("Failed to fetch wishlist");
          }

          const wishlistData = await response.json();
          console.log(wishlistData);
          setWishlist(wishlistData.wishlistDetails);
        }
      } catch (error) {
        console.error("Error fetching wishlist:", error.message);
        setError("Failed to fetch wishlist");
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [customerUser]);

  return (
    <div className="wish">
      <div>
        <h1>Your Wishlist</h1>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : wishlist && wishlist.length > 0 ? (
        <div className="wishItem">
          {wishlist.map((item) => (
            <WishItem key={item.productId} data={item} removeFromWish={removeFromWish} />
          ))}
        </div>
      ) : (
        <img src={noprodback} alt="Loading" />
      )}
      <div className="checkout">
        <button onClick={() => history.push("/customer/shop")}> <b>Continue Shopping </b></button>
      </div>
    </div>
  );
};

export default Wishlist;
