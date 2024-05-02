import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Product from './product'; // Assuming you have a Product component
import styles from './Shop.module.css'; // Make sure this path matches your file structure

export const Shop = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState({
        minBudget: 0,
        maxBudget: 1000,
        minRating: 0,
        maxRating: 5,
        category: ''
    });
    const [maxProductBudget, setMaxProductBudget] = useState(0);

    const customerUser = useSelector(state => state.customerUser);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('/api/customer/products');
                if (!response.ok) throw new Error('Error fetching products');
                const data = await response.json();
                setProducts(data);
                if (data.length > 0) {
                    const maxPrice = Math.max(...data.map(p => p.productBudget));
                    setMaxProductBudget(maxPrice);
                }
            } catch (error) {
                console.error('Error fetching products:', error.message);
                setError('Error fetching products. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [customerUser]);

    const handleFilterChange = (type, value) => {
        setFilter(prev => ({ ...prev, [type]: value }));
    };

    const filteredProducts = products.filter(product =>
        product.productBudget >= filter.minBudget &&
        product.productBudget <= filter.maxBudget &&
        (product.averageRating || 0) >= filter.minRating &&
        (product.averageRating || 0) <= filter.maxRating &&
        (filter.category === '' || product.cat === filter.category)
    );

    return (
        <div className={styles.container}>
            <div className={styles.filterPanel}>
                <div className={styles.filterItem}>
                    <label className={styles.label}>Min Budget:</label>
                    <input
                        type="range"
                        min="0"
                        max={maxProductBudget}
                        value={filter.minBudget}
                        onChange={(e) => handleFilterChange('minBudget', parseInt(e.target.value))}
                        className={styles.input}
                    />
                    <span className={styles.valueSpan}>${filter.minBudget}</span>
                </div>
                <div className={styles.filterItem}>
                    <label className={styles.label}>Max Budget:</label>
                    <input
                        type="range"
                        min="0"
                        max={maxProductBudget}
                        value={filter.maxBudget}
                        onChange={(e) => handleFilterChange('maxBudget', parseInt(e.target.value))}
                        className={styles.input}
                    />
                    <span className={styles.valueSpan}>${filter.maxBudget}</span>
                </div>
                <div className={styles.filterItem}>
                    <label className={styles.label}>Min Rating:</label>
                    <input
                        type="range"
                        min="0"
                        max="5"
                        step="0.1"
                        value={filter.minRating}
                        onChange={(e) => handleFilterChange('minRating', parseFloat(e.target.value))}
                        className={styles.input}
                    />
                    <span className={styles.valueSpan}>{filter.minRating.toFixed(1)} Stars</span>
                </div>
                <div className={styles.filterItem}>
                    <label className={styles.label}>Max Rating:</label>
                    <input
                        type="range"
                        min="0"
                        max="5"
                        step="0.1"
                        value={filter.maxRating}
                        onChange={(e) => handleFilterChange('maxRating', parseFloat(e.target.value))}
                        className={styles.input}
                    />
                    <span className={styles.valueSpan}>{filter.maxRating.toFixed(1)} Stars</span>
                </div>
                <div className={styles.filterItem}>
                    <label className={styles.label}>Category:</label>
                    <select
                        value={filter.category}
                        onChange={(e) => handleFilterChange('category', e.target.value)}
                        className={styles.select}
                    >
                        <option value="">All Categories</option>
                        <option value="food">Food</option>
                        <option value="Photography">Photography</option>
                        <option value="Event">Event</option>
                    </select>
                </div>
            </div>
            <div className={styles.productsGrid}>
                {filteredProducts.map(product => (
                    <Product key={product._id} data={product} className={styles.productCard} />
                ))}
            </div>
        </div>
    );
};

export default Shop;
