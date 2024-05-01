const express = require('express');

const router = express.Router();
const admincontrollers=require('../controllers/admincontrollers');
const db = require('../db');
const { ObjectId } = require('mongodb');

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin operations
 */

/**
 * @swagger
 * /admin/customerdetails:
 *   get:
 *     summary: Retrieve all customer details
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: List of all customers
 *       500:
 *         description: Internal server error
 */

router.get('/customerdetails',admincontrollers.customersDetails_getAll);

/**
 * @swagger
 * /admin/allproductdetails:
 *   get:
 *     summary: Retrieve details of all products
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: List of all products
 *       404:
 *         description: No products found
 *       500:
 *         description: Internal server error
 */

router.get('/allproductdetails',admincontrollers.allProductDetails);

/**
 * @swagger
 * /admin/orders:
 *   get:
 *     summary: Retrieve all orders
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: List of all orders
 *       500:
 *         description: Internal server error
 */

router.get('/orders', admincontrollers.getAllOrders);

/**
 * @swagger
 * /admin/statistics:
 *   get:
 *     summary: Get statistical data
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Statistical data including order, customer, business, and product counts
 *       500:
 *         description: Internal server error
 */

router.get("/statistics",admincontrollers.getStatistics);

/**
 * @swagger
 * /admin/businessdetails:
 *   get:
 *     summary: Retrieve all business details
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: List of all businesses
 *       500:
 *         description: Internal server error
 */

router.get('/businessdetails', async (req, res) => {
    try {
      // Get the database object
      
      const dbobj = db.getDb();
  
      // Get the collection
      const collection = dbobj.collection('business');
  
      // Find all documents in the collection
      const businessDetails = await collection.find().toArray();
  
      // Return the business details as JSON response
      res.json(businessDetails);
      console.log(businessDetails);
    } catch (error) {
      console.error('Error fetching business details:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });


  /**
 * @swagger
 * /admin/business/{id}:
 *   patch:
 *     summary: Update the status of a business
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Business ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Status updated successfully
 *       404:
 *         description: Business not found
 *       500:
 *         description: Internal server error
 */

  router.patch('/business/:id', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    // Get the database object
    
    const dbObj = db.getDb();
    

    try {
        // Find the business with the provided ID in the database
        const business = await dbObj.collection('business').findOne({ _id: new ObjectId(id) });

        // If business is not found, return 404 Not Found
        if (!business) {
            return res.status(404).json({ message: 'Business not found' });
        }

        // Update the status of the business
        await dbObj.collection('business').updateOne(
            { _id: new ObjectId(id) },
            { $set: { status: status } }
        );

        return res.status(200).json({ message: 'Status updated successfully' });
    } catch (error) {
        console.error('Error updating status:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});


/**
 * @swagger
 * /admin/queries:
 *   post:
 *     summary: Insert a new query
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               question:
 *                 type: string
 *               details:
 *                 type: string
 *     responses:
 *       200:
 *         description: Query submitted successfully
 *       500:
 *         description: Error submitting query
 */

router.post('/queries',admincontrollers.insertQuery_post);


/**
 * @swagger
 * /admin/queries:
 *   get:
 *     summary: Retrieve all queries
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: List of all queries
 *       500:
 *         description: Internal server error
 */

router.get('/queries', admincontrollers.getAllQueries);

/**
 * @swagger
 * /admin/queries/{id}:
 *   delete:
 *     summary: Delete a specific query
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Query ID
 *     responses:
 *       200:
 *         description: Query deleted successfully
 *       404:
 *         description: Query not found
 *       500:
 *         description: Internal server error
 */

router.delete('/queries/:id', admincontrollers.deleteQuery);

/**
 * @swagger
 * /admin/login:
 *   post:
 *     summary: Admin login
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Authentication successful
 *       401:
 *         description: Incorrect credentials
 *       500:
 *         description: Server error during authentication
 */

router.post('/login', async (req, res) => {
  const { userId, email, password } = req.body;
  const dbObj = db.getDb();

  try {
    const user = await dbObj.collection('admin').findOne({ userId, email });

    if (!user) {
      return res.status(401).json({ authenticated: false, message: 'User not found.' });
    }

    if (password === user.password) {
      res.json({ authenticated: true });
    } else {
      res.status(401).json({ authenticated: false, message: 'Incorrect password.' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during authentication.' });
  }
});


/**
 * @swagger
 * /admin/add:
 *   post:
 *     summary: Add a new admin
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Admin added successfully
 *       400:
 *         description: All fields are required
 *       409:
 *         description: An admin with the same User ID or Email already exists
 *       500:
 *         description: Failed to add admin
 */

router.post('/add', async (req, res) => {
  const { userId, email, password } = req.body;

  if (!userId || !email || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
  }

  const dbObj = db.getDb();

  try {
      // Check if an admin with the same userId or email already exists
      const existingAdmin = await dbObj.collection('admin').findOne({
          $or: [{ userId }, { email }]
      });

      if (existingAdmin) {
          return res.status(409).json({ message: 'An admin with the same User ID or Email already exists.' });
      }

      // Proceed to insert the new admin since no duplicates were found
      const result = await dbObj.collection('admin').insertOne({ userId, email, password });

      console.log(result);
      if (result.acknowledged) {
          return res.status(201).json({ message: 'Admin added successfully!' });
      } else {
          // This should ideally never happen if there's no server error, so let's log it
          console.error('Insert operation completed but no records were added.');
          return res.status(500).json({ message: 'Failed to add admin due to an unexpected issue.' });
      }
  } catch (error) {
      console.error('Failed to add admin:', error);
      return res.status(500).json({ message: 'Error adding admin' });
  }
});


/**
 * @swagger
 * /admin/removeCustomer/{customerId}:
 *   delete:
 *     summary: Remove a customer
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: customerId
 *         schema:
 *           type: string
 *         required: true
 *         description: Customer ID
 *     responses:
 *       200:
 *         description: Customer removed successfully
 *       404:
 *         description: Customer not found
 *       500:
 *         description: Error removing customer
 */

router.delete('/removeCustomer/:customerId', async (req, res) => {
  const { customerId } = req.params;
  const dbObj=db.getDb();
  try {
      // Assuming db.collection('customers') is your database setup
      const result = await dbObj.collection('customers').deleteOne({ _id: new ObjectId(customerId) });
      console.log(result,'remove')
      if (result.deletedCount === 1) {
          res.status(200).send({ message: 'Customer removed successfully' });
      } else {
          res.status(404).send({ message: 'Customer not found' });
      }
  } catch (error) {
      console.error('Delete customer error:', error);
      res.status(500).send({ message: 'Error removing customer' });
  }
});

/**
 * @swagger
 * /admin/allCustomers:
 *   get:
 *     summary: Retrieve all customers
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: List of all customers
 *       500:
 *         description: Error fetching customers
 */

router.get('/allCustomers', async (req, res) => {
  const dbObj=db.getDb();
  try {
      const customers = await dbObj.collection('customers').find({}).toArray();
      res.status(200).json(customers.map(customer => ({
          id: customer._id,  // Assuming MongoDB which uses _id
          name: customer.name ,
          email:customer.email // Assuming customers have a 'name' field
      })));
  } catch (error) {
      console.error('Fetch customers error:', error);
      res.status(500).send({ message: 'Error fetching customers' });
  }
});


module.exports = router;