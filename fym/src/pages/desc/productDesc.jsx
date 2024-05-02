import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './productDesc.css';
import { ShoppingCart, Heart } from 'phosphor-react';
import { useSelector } from 'react-redux';
import { FaStar } from 'react-icons/fa';

const ProductDesc = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [rating, setRating] = useState(null);
    const [reviewText, setReviewText] = useState('');
    const [productReviews, setProductReviews] = useState([]);

    const customerUser = useSelector(state => state.customerUser);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`https://projectfym-1.onrender.com/api/customer/products/${id}`);
                if (!response.ok) {
                    throw new Error('Error fetching product details');
                }

                const data = await response.json();
                setProduct(data);
                setProductReviews(data.reviews || []);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching product details:', error.message);
                setError('Error fetching product details. Please try again later.');
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const addToCart = async () => {
        try {
            const response = await fetch(`https://projectfym-1.onrender.com/api/customer/cart/${id}`, {
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

            setSuccessMsg('Item added to cart successfully');
            setErrorMsg('');
        } catch (error) {
            console.error('Error adding to cart:', error);
            setErrorMsg(error.message || 'Error adding to cart. Please try again.');
            setSuccessMsg('');
        }
    };

    const addToWish = async () => {
        try {
            const response = await fetch(`https://projectfym-1.onrender.com/api/customer/wishlist/${id}`, {
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

            setSuccessMsg('Item added to wishlist successfully');
            setErrorMsg('');
        } catch (error) {
            console.error('Error adding to wishlist:', error);
            setErrorMsg(error.message || 'Error adding to wishlist. Please try again.');
            setSuccessMsg('');
        }
    };

    const handleStarClick = (ratingValue) => {
        if (rating === ratingValue) {
            setRating(null);
        } else {
            setRating(ratingValue);
        }
    };

    const submitReview = async () => {
        if (!rating) {
            setErrorMsg('Please select a rating');
            return;
        }
    
        try {
            const reviewData = {
                rating,
                text: reviewText,
            };
    
            const response = await fetch(`https://projectfym-1.onrender.com/api/customer/reviews/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${customerUser.token}`,
                },
                body: JSON.stringify(reviewData),
            });
    
            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(errorMessage || 'Error submitting review on the server');
            }
    
            const newReview = await response.json(); // Assuming this response includes the review just added
            setProductReviews(prevReviews => [...prevReviews, reviewData]); // Add the new review to the existing reviews
            setSuccessMsg('Review submitted successfully');
            setErrorMsg('');
            setRating(null);
            setReviewText('');
        } catch (error) {
            console.error('Error submitting review:', error);
            setErrorMsg(error.message || 'Error submitting review. Please try again.');
            setSuccessMsg('');
        }
    };
    

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    const imageUrl = product?.productImage.startsWith('productImage-')
        ? require(`../../../../uploads/${product.productImage}`)
        : product.productImage;

    return (
        <div className="product-desc">
            <div className="product-details">
                <div className="product-image">
                    {imageUrl && <img src={imageUrl} alt="product" />}
                </div>
                <div className="product-info">
                    <h2>{product.productName}</h2>
                    <p><b>Category</b>:  {product.cat}</p>
                    <p><b>Subcategory</b>:  {product.subCat}</p>
                    <p  className='price'><b>Price</b>: <span>&nbsp; ₹ &nbsp;{product.productBudget} &nbsp;</span></p>
                    <p><b>Description</b>: {product.productDescription}</p>
                    <div className="btns">
                        <button className="addToCartBttn" onClick={addToCart}>
                            <ShoppingCart size={21} />
                        </button>
                        <button className="addToCartBttn" onClick={addToWish}>
                            <Heart size={21} />
                        </button>
                    </div>
                    {errorMsg && <div className="error">{errorMsg}</div>}
                    {successMsg && <div className="success">{successMsg}</div>}
                    <div className="star-rating">
                        <p><b className='review-bold'>Want to leave a review?</b></p>
                        {[...Array(5)].map((star, index) => {
                            const ratingValue = index + 1;
                            return (
                                <label key={index}>
                                    <input
                                        type="radio"
                                        name="rating"
                                        value={ratingValue}
                                        onClick={() => handleStarClick(ratingValue)}
                                    />
                                    <FaStar
                                        className="star"
                                        color={ratingValue <= rating ? '#ffc107' : '#e4e5e9'}
                                        size={30}
                                    />
                                </label>
                            );
                        })}
                        <input
                            type="text"
                            placeholder="Write your review here..."
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                        />
                        <button className="submit-review-btn" onClick={submitReview}>
                            Submit Review
                        </button>
                    </div>
                </div>
            </div>
            {/* Review Display Section */}
            <div className="reviews-section">
                <h3>Customer Reviews</h3>
                {productReviews && productReviews.length > 0 ? (
                    productReviews.map((review, index) => (
                        <div key={index} className="review">
                            <p><strong>Rating:</strong> {review.rating} Stars</p>
                            <p><strong>Review:</strong> {review.text}</p>
                        </div>
                    ))
                ) : (
                    <p>No reviews yet.</p>
                )}
            </div>
        </div>
    );
};

export default ProductDesc;
