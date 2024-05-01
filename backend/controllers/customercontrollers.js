const jwt = require('jsonwebtoken');
require('dotenv').config();
const bcrypt = require('bcrypt');
const db = require('../db');
const { ObjectId } = require('mongodb');
const createToken = (id) => {
    return jwt.sign({ id }, process.env.SECRET_KEY, { expiresIn: 3 * 24 * 60 * 60 })
}

const customerSignUp_post = async (req, res) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.password, salt);

    try {
        const dbobj = db.getDb();
        const result = await dbobj.collection('customers').findOne({ email: req.body.email });

        if (result) {
            throw new Error('User Already Exists');
        } else {
            const result1 = await dbobj.collection('customers').insertOne({
                email: req.body.email,
                name: req.body.name,
                password: hash
            });

            const token = createToken(result1.insertedId);
            res.status(200).json({ email: req.body.email, token });
        }
    } catch (error) {
        console.log(error.message);
        res.status(400).json({ error: error.message });
    }
}

const customerLogin_post = async function (req, res) {
    try {
        const dbobj = db.getDb();
        const result = await dbobj.collection('customers').findOne({ email: req.body.email });

        if (result) {
            const match = await bcrypt.compare(req.body.password, result.password);
            if (match) {
                const token = createToken(result._id);
                res.status(200).json({ email: result.email, token });
            } else {
                throw new Error('Wrong Password');
            }
        } else {
            throw new Error('User Not Found');
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const customer_Products_get = async (req, res) => {
    try {
        const dbobj = db.getDb();
        const products = await dbobj.collection('product').find().toArray();
        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching products:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const addToCart_post = async (req, res) => {
    console.log("inside add to cart")
    try {
        // Extract productId from the request parameters
        const { productId } = req.params;

        // Use req.customerUser to access customer information (e.g., customer ID from the token)
        const customerId = req.customerUser.id;

        // Assuming you have a MongoDB database connection object named db
        const dbobj = db.getDb();

        // Find the customer in the database
        const customer = await dbobj.collection('customers').findOne({ _id: new ObjectId(customerId) });

        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        // Ensure that the customer object has a 'cart' property
        if (!customer.cart) {
            customer.cart = [];
        }

        // Check if the product already exists in the cart
        const existingProductIndex = customer.cart.findIndex(item => item.productId === productId);

        if (existingProductIndex !== -1) {
            // Product already exists, check if the category is "food" and increase the count
            if (customer.cart[existingProductIndex].category === "food") {
                customer.cart[existingProductIndex].count += 1;
            }
        } else {
            // Product doesn't exist, add it to the cart
            const product = await dbobj.collection('product').findOne({ _id: new ObjectId(productId) });

            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            }

            // Add the product to the cart with count 1 if the category is "food"
            const count = product.category === "food" ? 1 : 1;
            customer.cart.push({ productId, count, category: product.cat });
        }

        // Update the customer's cart in the database
        await dbobj.collection('customers').updateOne(
            { _id: new ObjectId(customerId) },
            { $set: { cart: customer.cart } }
        );

        res.json({ message: 'Product added to the cart successfully' });
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const addToWish_post = async (req, res) => {
    console.log("inside add to wishlist")
    try {
        // Extract productId from the request parameters
        const { productId } = req.params;

        // Use req.customerUser to access customer information (e.g., customer ID from the token)
        const customerId = req.customerUser.id;

        // Assuming you have a MongoDB database connection object named db
        const dbobj = db.getDb();

        // Find the customer in the database
        const customer = await dbobj.collection('customers').findOne({ _id: new ObjectId(customerId) });

        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        // Ensure that the customer object has a 'wishlist' property
        if (!customer.wishlist) {
            customer.wishlist = [];
        }

        // Check if the product already exists in the wishlist
        const existingProductIndex = customer.wishlist.findIndex(item => item.productId === productId);

        if (existingProductIndex !== -1) {
            // Product already exists in the wishlist
            return res.status(400).json({ error: 'Product already in the wishlist' });
        }

        // Product doesn't exist, add it to the wishlist
        const product = await dbobj.collection('product').findOne({ _id: new ObjectId(productId) });

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Add the product to the wishlist
        customer.wishlist.push({ productId, category: product.cat });

        // Update the customer's wishlist in the database
        await dbobj.collection('customers').updateOne(
            { _id: new ObjectId(customerId) },
            { $set: { wishlist: customer.wishlist } }
        );

        res.json({ message: 'Product added to the wishlist successfully' });
    } catch (error) {
        console.error('Error adding to wishlist:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const customerhandleCheckout = async (req, res) => {
    try {
        // Access form data from the request body
        const { name, cardNumber, expiryDate, cvv, startDate, endDate, totalAmount } = req.body;
        const customerId = req.customerUser.id;

        // Assuming you have a method to get the database object (dbObj)
        const dbObj = db.getDb(); // Replace with your actual method to get the database object

        // Get the customer details with the cart using the dbObj
        const customer = await dbObj.collection('customers').findOne({ _id: new ObjectId(customerId) });

        // Create a new order for each product in the cart
        const orderPromises = customer.cart.map(async (item) => {
            const product = await dbObj.collection('product').findOne({ _id: new ObjectId(item.productId) });

            const order = {
                cid: customerId,
                bid: product.businessId, // Get businessId from the product
                pid: item.productId,
                startDate,
                endDate,
                name,
                totalAmount,
                productName: product.productName, // Add more product details as needed
                status: 'pending', // Set status as "pending" by default
            };

            // Insert the order into the orders collection using the dbObj
            await dbObj.collection('orders').insertOne(order);
        });

        // Wait for all orders to be created
        await Promise.all(orderPromises);

        // Clear the customer's cart
        await dbObj.collection('customers').updateOne({ _id: new ObjectId(customerId) }, { $set: { cart: [] } });

        res.status(200).json({ message: 'Checkout successful' });
    } catch (error) {
        // Handle errors and send an appropriate response
        console.error('Error processing checkout:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getCustomerOrders = async (req, res) => {
    try {
        // Assuming you have a method to get the database object (dbObj)
        const dbObj = db.getDb(); // Replace with your actual method to get the database object

        // Get customer ID from the authenticated user
        const customerId = req.customerUser.id;

        // Fetch orders for the customer from the database
        const orders = await dbObj.collection('orders').find({ cid: customerId }).toArray();
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching customer orders:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getProductDetails = async (req, res) => {
    try {
        // console.log('asjabhbsj')
        const { id } = req.params;
        const dbobj = db.getDb();
        const product = await dbobj.collection('product').findOne({ _id: new ObjectId(id) });
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        
        res.status(200).json(product);
    } catch (error) {
        console.error('Error fetching product details:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const submitReview = async (req, res) => {
    try {
        console.log("inside subreview")
        const { productId } = req.params;
        const { rating, text } = req.body;
        const userId = req.customerUser.id; // Correctly using `req.customerUser` based on your context

        const dbobj = db.getDb();
        const product = await dbobj.collection('product').findOne({ _id: new ObjectId(productId) });

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        const reviews = product.reviews || []; // Safely handle potentially undefined reviews array

        // Prepare the review object
        const review = {
            userId: new ObjectId(userId),
            rating,
            text,
            date: new Date() // Optionally add a date if not automatically added
        };

        // Calculate the new average rating considering the case when there are no existing reviews
        const newAverageRating = (
            reviews.reduce((acc, cur) => acc + cur.rating, 0) + rating // Start sum with 0, add current rating
        ) / (reviews.length + 1); // Divide by total number of reviews after adding the new one

        // Update the product document to add the new review and update the average rating
        const updatedInfo = await dbobj.collection('product').updateOne(
            { _id: new ObjectId(productId) },
            {
                $push: { reviews: review },
                $set: { averageRating: newAverageRating.toFixed(1) } // Moved toFixed() here for clarity
            }
        );

        if (updatedInfo.modifiedCount === 0) {
            throw new Error('Unable to update product reviews.');
        }

        res.status(201).json({ message: 'Review added successfully', review: review });
    } catch (error) {
        console.error('Error submitting review:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getReviews = async (req, res) => {
    console.log('asfasfaf00')
    try {
        const { productId } = req.params;  // Get the product ID from the request parameters
        const dbobj = db.getDb();
        
        // Fetch only the reviews subdocument array from the product document
        const product = await dbobj.collection('product').findOne({ _id: new ObjectId(productId) }, {
            projection: { reviews: 1, _id: 0 } // Projection to fetch only the reviews
        });

        if (!product || !product.reviews) {
            return res.status(404).json({ message: 'No reviews found for this product' });
        }

        res.status(200).json(product.reviews);  // Send the reviews array as a response
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    getProductDetails,
    getCustomerOrders,
    customerhandleCheckout,
    customerSignUp_post,
    customerLogin_post,
    customer_Products_get,
    addToCart_post,
    addToWish_post,
    submitReview,
    getReviews
};