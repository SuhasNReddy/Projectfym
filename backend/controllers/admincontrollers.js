const { ObjectId } = require("mongodb");
const db = require("../db");

const customersDetails_getAll = async (req, res) => {
    const dbobj = db.getDb();
  
    try {
      const customersCollection = dbobj.collection('customers');
      const ordersCollection = dbobj.collection('orders');
  
      const customers = await customersCollection.find({}).toArray();
  
      if (!customers || customers.length === 0) {
        res.status(404).json({ message: 'No customers found' });
      } else {
        // Avoid sending sensitive information like passwords
        const customersDetails = await Promise.all(customers.map(async (customer) => {
          const { password, ...customerDetails } = customer;
  
          // Fetch the number of bookings for each customer
          
          const numBookings = await ordersCollection.countDocuments({ cid: String(customerDetails._id) });
  
          return {
            ...customerDetails,
            numBookings,
          };
        }));
        // console.log(customersDetails);
        res.status(200).json(customersDetails);
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
  

  const allProductDetails = async (req, res) => {
    const dbobj = db.getDb();
  
    try {
      const collection = dbobj.collection('product'); // Update with your collection name
      const products = await collection.find({}).toArray();
  
      if (!products || products.length === 0) {
        res.status(404).json({ message: 'No products found' });
      } else {
        // Avoid sending sensitive information like passwords
        
        res.status(200).json(products);
        // console.log(products);
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
  
  const getAllOrders = async (req, res) => {
    try {
        const dbobj=db.getDb();
      const ordersCollection = dbobj.collection('orders');
      const orders = await ordersCollection.find().toArray();
      res.json(orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  const getStatistics = async (req, res) => {
    console.log("inside stat")
    const dbobj = db.getDb();
  
    try {
      // Fetch all orders
      const ordersCollection = dbobj.collection('orders');
      const orders = await ordersCollection.find({}).toArray();
  
      // Fetch the number of customers
      const customersCollection = dbobj.collection('customers');
      const customerCount = await customersCollection.countDocuments({});
  
      // Fetch the number of businesses
      const businessesCollection = dbobj.collection('business');
      const businessCount = await businessesCollection.countDocuments({});
  
      // Fetch the number of products
      const productsCollection = dbobj.collection('product');
      const productCount = await productsCollection.countDocuments({});
  
      res.json({
        orders,
        customerCount,
        businessCount,
        productCount,
      });
    } catch (error) {
      console.error('Error fetching statistics:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  const insertQuery_post = async (req, res) => {
    const dbobj = db.getDb();
    // Assuming you're using an authenticated user's ID if your setup involves user sessions
    const query = { ...req.body };
  
    try {
      const collection = dbobj.collection('queries');
      const result = await collection.insertOne(query);
  
      if (result.acknowledged) {
        // Successfully inserted the query
        return res.status(200).json({ message: 'Query submitted successfully.' });
      } else {
        // Query not inserted, possibly due to a database issue
        return res.status(404).json({ message: 'Query not submitted.' });
      }
    } catch (error) {
      console.error('Error submitting query:', error);
      return res.status(500).json({ message: 'Error submitting query.' });
    }
  };

  const getAllQueries = async (req, res) => {
    const dbobj = db.getDb();
    try {
        const queries = await dbobj.collection('queries').find({}).toArray();
        res.status(200).json(queries);
    } catch (error) {
        console.error('Error fetching queries:', error);
        res.status(500).json({ message: 'Failed to fetch queries.' });
    }
};

const deleteQuery = async (req, res) => {

  const dbobj = db.getDb();
  const { id } = req.params;
  
  try {
      const result = await dbobj.collection('queries').deleteOne({ _id: new ObjectId(id) });
      if (result.deletedCount === 1) {
          res.status(200).json({ message: 'Query deleted successfully.' });
      } else {
          res.status(404).json({ message: 'Query not found.' });
      }
  } catch (error) {
      console.error('Error deleting query:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
};

  module.exports = {
    customersDetails_getAll,
    allProductDetails,
    getAllOrders,
    getStatistics,
    insertQuery_post,
    getAllQueries,
    deleteQuery
  };
  
