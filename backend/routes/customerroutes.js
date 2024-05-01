const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();


const customerControllers=require("../controllers/customercontrollers");
const customerAuthMiddleware = require('../middleware/customerAuth');
const db = require('../db');
const { ObjectId } = require('mongodb');


/**
 * @swagger
 * tags:
 *   name: Customer
 *   description: Customer operations
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       required:
 *         - cid
 *         - bid
 *         - pid
 *         - startDate
 *         - endDate
 *         - name
 *         - totalAmount
 *         - productName
 *         - status
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier for the order
 *         cid:
 *           type: string
 *           description: Customer ID
 *         bid:
 *           type: string
 *           description: Business ID
 *         pid:
 *           type: string
 *           description: Product ID
 *         startDate:
 *           type: string
 *           format: date
 *           description: Start date of the service or product usage
 *         endDate:
 *           type: string
 *           format: date
 *           description: End date of the service or product usage
 *         name:
 *           type: string
 *           description: Name of the customer
 *         totalAmount:
 *           type: number
 *           format: double
 *           description: Total amount of the order
 *         productName:
 *           type: string
 *           description: Name of the product ordered
 *         status:
 *           type: string
 *           description: Status of the order (e.g., completed, pending)
 *     Review:
 *       type: object
 *       required:
 *         - userId
 *         - rating
 *         - text
 *         - date
 *       properties:
 *         userId:
 *           type: string
 *           description: Unique identifier of the user who wrote the review
 *         rating:
 *           type: integer
 *           description: Numeric rating given by the user
 *         text:
 *           type: string
 *           description: Review text
 *         date:
 *           type: string
 *           format: date-time
 *           description: Date when the review was submitted
 */



/**
 * @swagger
 * /customer/signup:
 *   post:
 *     summary: Register a new customer
 *     description: Register a new customer with email, name, and password.
 *     tags: [Customer]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               name:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Customer registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *                 token:
 *                   type: string
 *       400:
 *         description: Error registering customer
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */

router.post('/signup', customerControllers.customerSignUp_post);

/**
 * @swagger
 * /customer/login:
 *   post:
 *     summary: Customer login
 *     description: Log in as an existing customer.
 *     tags: [Customer]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Customer logged in successfully
 *       400:
 *         description: Invalid credentials
 */
router.post('/login', customerControllers.customerLogin_post);

/**
 * @swagger
 * /customer/products:
 *   get:
 *     summary: Get all products
 *     description: Retrieve all products available to customers.
 *     tags: [Customer]
 *     responses:
 *       200:
 *         description: List of products
 *       500:
 *         description: Internal server error
 */
router.get("/products", customerControllers.customer_Products_get);

/**
 * @swagger
 * /customer/products/{id}:
 *   get:
 *     summary: Get product details
 *     description: Retrieve details of a specific product by its ID.
 *     tags: [Customer]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the product
 *     responses:
 *       200:
 *         description: Product details
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
router.get("/products/:id", customerControllers.getProductDetails);

/**
 * @swagger
 * /customer/cart/{productId}:
 *   post:
 *     summary: Add product to cart
 *     description: Add a product to the customer's cart.
 *     tags: [Customer]
 *     parameters:
 *       - in: path
 *         name: productId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the product to add to cart
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Product added to the cart successfully
 *       400:
 *         description: Error adding product to cart
 */
router.post('/cart/:productId', customerAuthMiddleware, customerControllers.addToCart_post);

/**
 * @swagger
 * /customer/cart:
 *   get:
 *     summary: Get customer's cart
 *     description: Retrieve the customer's cart.
 *     tags: [Customer]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Customer's cart details
 *       404:
 *         description: Customer not found
 *       500:
 *         description: Internal server error
 */
router.get('/cart', customerAuthMiddleware, async (req, res) => {
   
  
    const dbobj = db.getDb();
    try {
      const customerId = req.customerUser.id;
  
      const customer = await dbobj.collection('customers').findOne({ _id: new ObjectId(customerId) });
  
      if (!customer) {
        return res.status(404).json({ error: 'Customer not found' });
      }
  
      // Extract product IDs and counts from the customer's cart
      const cartDetails = customer.cart.map(async (item) => {
        const product = await dbobj.collection('product').findOne({ _id: new ObjectId(item.productId) });
  
        if (!product) {
          console.error(`Product not found for ID: ${item.productId}`);
          return null;
        }
  
        // Set count to 1 if the category is not "food"
        const count = item.count;
  
        return {
          productId: item.productId,
          count: count,
          productDetails: product,
        };
      });
  
      // Wait for all promises to resolve
      const resolvedCartDetails = await Promise.all(cartDetails);
  
      res.json({ cartDetails: resolvedCartDetails.filter(Boolean) });
    } catch (error) {
      console.error('Error fetching cart details:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  

/**
 * @swagger
 * /customer/removeFromCart/{productId}:
 *   post:
 *     summary: Remove product from cart
 *     description: Remove a product from the customer's cart.
 *     tags: [Customer]
 *     parameters:
 *       - in: path
 *         name: productId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the product to remove from cart
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Product removed from the cart successfully
 *       404:
 *         description: Product not found in the cart
 *       500:
 *         description: Internal server error
 */
  router.post('/removeFromCart/:productId', customerAuthMiddleware, async (req, res) => {
    try {
        const customerId = req.customerUser.id;
        const productId = req.params.productId;

        const dbobj = db.getDb();
        const customer = await dbobj.collection('customers').findOne({ _id: new ObjectId(customerId) });

        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        // Find the index of the product in the cart
        const productIndex = customer.cart.findIndex(item => item.productId === productId);

        if (productIndex !== -1) {
            // Reduce the quantity by 1
            customer.cart[productIndex].count -= 1;

            // If the quantity becomes zero, remove the product from the cart
            if (customer.cart[productIndex].count === 0) {
                customer.cart.splice(productIndex, 1);
            }

            // Update the customer's cart in the database
            await dbobj.collection('customers').updateOne(
                { _id: new ObjectId(customerId) },
                { $set: { cart: customer.cart } }
            );

            res.json({ message: 'Product removed from the cart successfully' });
        } else {
            res.status(404).json({ error: 'Product not found in the cart' });
        }
    } catch (error) {
        console.error('Error removing from cart:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/wishlist/:productId',customerAuthMiddleware,customerControllers.addToWish_post);

/**
 * @swagger
 * /customer/wishlist:
 *   get:
 *     summary: Get customer's wishlist
 *     description: Retrieve the customer's wishlist.
 *     tags: [Customer]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Customer's wishlist details
 *       404:
 *         description: Customer not found
 *       500:
 *         description: Internal server error
 */
router.get('/wishlist', customerAuthMiddleware, async (req, res) => {
    const dbobj = db.getDb();
    try {
        const customerId = req.customerUser.id;

        const customer = await dbobj.collection('customers').findOne({ _id: new ObjectId(customerId) });

        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        // Extract product IDs from the customer's wishlist
        const wishlistDetails = customer.wishlist.map(async (item) => {
            const product = await dbobj.collection('product').findOne({ _id: new ObjectId(item.productId) });

            if (!product) {
                console.error(  `Product not found for ID: ${item.productId}`);
                return null;
            }

            // Return product details without count
            return {
                productId: item.productId,
                productDetails: product,
            };
        });

        // Wait for all promises to resolve
        const resolvedWishlistDetails = await Promise.all(wishlistDetails);
       
        res.json({ wishlistDetails: resolvedWishlistDetails.filter(Boolean) });
        // console.log(resolvedWishlistDetails.filter(Boolean))
    } catch (error) {
        console.error('Error fetching wishlist details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * @swagger
 * /customer/removeFromWishlist/{productId}:
 *   delete:
 *     summary: Remove product from wishlist
 *     description: Remove a product from the customer's wishlist.
 *     tags: [Customer]
 *     parameters:
 *       - in: path
 *         name: productId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the product to remove from wishlist
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Product removed from the wishlist successfully
 *       404:
 *         description: Product not found in the wishlist
 *       500:
 *         description: Internal server error
 */
router.delete('/removeFromWishlist/:productId', customerAuthMiddleware, async (req, res) => {
    console.log("inside removefrom wish");
    try {
        const { productId } = req.params;
        const customerId = req.customerUser.id;
        const dbObj=db.getDb();
        // Find the customer in the database
        const customer = await dbObj.collection('customers').findOne({ _id: new ObjectId(customerId) });

        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        // Remove the item from the wishlist based on the productId
        customer.wishlist = customer.wishlist.filter(item => item.productId.toString() !== productId);

        // Update the customer in the database
        await dbObj.collection('customers').updateOne({ _id: new ObjectId(customerId) }, { $set: { wishlist: customer.wishlist } });

        res.json({ message: 'Item removed from wishlist successfully' });
    } catch (error) {
        console.error('Error removing item from wishlist:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * @swagger
 * /customer/updatePassword:
 *   post:
 *     summary: Update customer password
 *     description: Update the password of the logged-in customer.
 *     tags: [Customer]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       400:
 *         description: Error updating password
 */
router.post('/updatePassword', customerAuthMiddleware, async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const userId = req.customerUser.id;
    console.log("update pass", userId,oldPassword);
  
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    const dbobj = db.getDb();
    const usersCollection = dbobj.collection('customers');
  
    try {
      const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
    //   console.log("uase",user.password);
      const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    //   console.log("next1 ",isPasswordValid);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid old password' });
      }
    //   console.log("next2 ",isPasswordValid);
      const hashedNewPassword = bcrypt.hashSync(newPassword, 10);
  
      // Update the password using $set and hashedNewPassword
    //   console.log(hashedNewPassword,"newpass");
      await usersCollection.updateOne({ _id: new ObjectId(userId) }, { $set: { password: hashedNewPassword } });
  
      res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
      console.error('Error updating password:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  /**
 * @swagger
 * /customer/checkout:
 *   post:
 *     summary: Customer checkout
 *     description: Process checkout for the customer's cart.
 *     tags: [Customer]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               cardNumber:
 *                 type: string
 *               expiryDate:
 *                 type: string
 *               cvv:
 *                 type: string
 *               startDate:
 *                 type: string
 *               endDate:
 *                 type: string
 *               totalAmount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Checkout successful
 *       500:
 *         description: Internal server error
 */
  router.post("/checkout",customerAuthMiddleware,customerControllers.customerhandleCheckout);

/**
 * @swagger
 * /customer/orders:
 *   get:
 *     security:
 *       - BearerAuth: []
 *     summary: Retrieve all orders placed by the customer
 *     tags: [Customer]
 *     responses:
 *       200:
 *         description: List of all orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       404:
 *         description: Customer not found
 *       500:
 *         description: Internal server error
 */
  router.get("/orders",customerAuthMiddleware,customerControllers.getCustomerOrders);



  router.post('/wishlist/:productId',customerAuthMiddleware,customerControllers.addToWish_post);

/**
 * @swagger
 * /customer/reviews/{productId}:
 *   get:
 *     security:
 *       - BearerAuth: []
 *     summary: Get reviews for a specific product
 *     tags: [Customer]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: The product ID to get reviews for
 *     responses:
 *       200:
 *         description: An array of reviews for the product
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
  router.get("/reviews/:productId",customerAuthMiddleware,customerControllers.getReviews);

  /**
 * @swagger
 * /customer/reviews/{productId}:
 *   post:
 *     security:
 *       - BearerAuth: []
 *     summary: Submit a review for a product
 *     tags: [Customer]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: integer
 *               text:
 *                 type: string
 *     responses:
 *       201:
 *         description: Review submitted successfully
 *       400:
 *         description: Validation error or missing data
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
  router.post("/reviews/:productId",customerAuthMiddleware,customerControllers.submitReview)
module.exports = router;