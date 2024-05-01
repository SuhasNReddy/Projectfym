const jwt = require('jsonwebtoken');
require('dotenv').config();
const bcrypt = require('bcrypt');
const db = require('../db');
const { ObjectId } = require('mongodb');

// const redis=require("../redis/redisClient");
const createToken = (id) => {
    return jwt.sign({ id }, process.env.SECRET_KEY, { expiresIn: 3 * 24 * 60 * 60 })
}

const businessSignUp_post = async (req, res) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.password, salt);

    try {
        const dbobj = db.getDb();
        const result = await dbobj.collection('business').findOne({ email: req.body.email });

        if (result) {
            throw new Error('User Already Exists');
        } else {
            const result1 = await dbobj.collection('business').insertOne({
                email: req.body.email,
                username: req.body.name,
                password: hash
            });

            const token = createToken(result1.insertedId);
            res.status(200).json({ email: req.body.email, token, status: 'pending' });

        }
    } catch (error) {
        console.log(error.message)
        res.status(400).json({ error: error.message });
    }
}

const businessLogin_post = async function (req, res) {
    try {
        const dbobj = db.getDb();
        const result = await dbobj.collection('business').findOne({ email: req.body.email });

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

const getBusinessLocations = async function(req, res) {
  console.log("business loc")
  const dbobj = db.getDb();
  const businessId = new ObjectId(req.user); // Assuming the business ID is stored in req.user._id

  try {
      const business = await dbobj.collection('business').findOne({ _id: businessId  }, { projection: { locations: 1 } });
      if (business && business.locations) {
        console.log(business.locations,"bocsss")
          res.status(200).json(business.locations);
      } else {
          res.status(404).json({ message: "No locations found for this business" });
      }
  } catch (error) {
      console.error("Failed to fetch locations:", error);
      res.status(500).json({ message: error.message });
  }
};



const addBusinessLocation = async function(req, res) {
  const dbobj = db.getDb();
  const businessId = new ObjectId(req.user);
  const { name, lat, lng } = req.body;
    
  // Validate the incoming location data
  if (!name || typeof lat !== 'number' || typeof lng !== 'number') {
      return res.status(400).json({ message: "Invalid location data provided" });
  }

  const location = req.body;
  console.log("asfsaf",location,businessId)

  try {
      const result = await dbobj.collection('business').updateOne(
          { _id: businessId },
          { $push: { locations: location } }
      );

      if (result.modifiedCount === 0) {
          res.status(404).json({ message: "Business not found or location not added" });
      } else {
          res.status(201).json({ message: "Location added successfully" });
      }
  } catch (error) {
      console.error("Error adding location:", error);
      res.status(500).json({ message: error.message });
  }
};


const deleteBusinessLocation = async function(req, res) {
  const dbobj = db.getDb();
  
  const locationId = req.params.location;
  const businessId = new ObjectId(req.user);
  console.log(locationId,"inside dele",req.user)

  try {
      const result = await dbobj.collection('business').updateOne(
          { _id: businessId },
          { $pull: { locations: { _id: locationId } } }
      );

      if (result.modifiedCount === 0) {
        console.log("adad")
          res.status(404).json({ message: "Location not found or delete failed" });
      } else {
        console.log("asdasdsuccess")
          res.status(200).json({ message: "Location deleted successfully" });
      }
  } catch (error) {
      console.error("Error deleting location:", error);
      res.status(500).json({ message: error.message });
  }
};


const businessinsertProduct_post = async (req, res) => {
  const dbobj = db.getDb();
  const product = { ...req.body, businessId: req.user };
  // console.log(product, req.file.filename, "hbs");
  try {
    // Check if the request contains a file
    if (req.file) {
      // If a file is present, add the file path to the product object
      product.productImage = req.file.filename;
    }

    const collection = dbobj.collection('product');
    const result = await collection.insertOne(product);

    
    if (result.acknowledged) {
      // Successfully inserted the product
      return res.status(200).json({ message: 'Product inserted successfully.' });
    } else {
      // No product inserted, possibly due to a database issue
      return res.status(404).json({ message: 'Product not inserted.' });
    }
  } catch (error) {
    console.error('Error inserting product:', error);
    return res.status(500).json({ message: 'Error inserting product.' });
  }
};
 


const businessProducts_get = async (req, res) => {
  const dbobj = db.getDb();
  const Businessid = req.user;
  // console.log("inside", Businessid);
  try {
    const collection = dbobj.collection('product');
    const resultCursor = await collection.find({ businessId: Businessid });
    
    // Convert the cursor to an array
    const result = await resultCursor.toArray();
    
    // console.log(result);

    if (!result || result.length === 0) {
      // throw new Error('No products for this user');
      res.status(200).json({message:"No products for this user"})
    } else {
      res.status(200).json({ ProductList: result });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const businessdeleteproduct_delete = async (req, res) => {
  const dbobj = db.getDb();
  const id = req.params.productid;

  try {
    const collection = dbobj.collection('product');

    // Use deleteOne to delete a single document by its _id
    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 1) {
      res.status(200).json({ message: 'Product deleted successfully' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }

  } catch (e) {
    console.error('Error deleting product:', e);
    res.status(500).json({ message: 'Internal server error' });
  }
}

const businessUpdateProduct_put_id=async (req,res)=>{
  console.log("inside update product")
  try {
    const { productId } = req.params;
    const { productBudget, productDescription ,productDiscount ,productQuantity} = req.body;
    const dbobj = db.getDb();
    console.log(req.body);

    const collection = dbobj.collection('product'); // Replace 'products' with your actual collection name

    // Update the product by ID and set its properties
    const result = await collection.updateOne(
      
      { _id: new ObjectId(productId) },
      {
        $set: {
          productBudget: productBudget,
          productDiscount: productDiscount,
          productDescription: productDescription,
          productQuantity

        },
      }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Retrieve the updated product
    

    res.json(result);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

const businessorders_updatestatus_put_id=async (req, res) => {
  try {
      const dbObj = db.getDb();
      const ordersCollection = dbObj.collection('orders');
      const { id } = req.params;
      const businessId = req.user;
      console.log("Received request to update order with id:", id, "for businessId:", businessId);
      
      const updatedOrder = await ordersCollection.findOneAndUpdate(
        { _id: new ObjectId(id), bid: businessId },
        { $set: { status: 'completed' } },
        { returnDocument: 'after' }
      );
      
      console.log("Updated order:", updatedOrder);
      
      if (updatedOrder.status!='completed') {
        return res.status(404).json({ message: 'Order not found or unauthorized' });
      }
      
      res.status(200).json({ message: 'Order status updated successfully' });
      
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Error updating order status' });
  }
}

const getBusinessOrders = async (req, res) => {
  try {
    const dbObj = db.getDb();
    const ordersCollection = dbObj.collection('orders');

    // Assuming 'businessId' is stored in req.user (from authentication middleware)
    const businessId = req.user;

    // Fetch orders for the given businessId
    console.log(businessId);
    const orders = await ordersCollection.find({ bid:businessId }).toArray();
    console.log("inside orders",orders);
    res.status(200).json({ orders });
  } catch (error) {
    console.error('Error fetching business orders:', error);
    res.status(500).json({ message: 'Error fetching business orders.' });
  }
};

const getBusinessOrdersmetrics = async (req, res) => {
  try {
      const dbObj = db.getDb();
      const ordersCollection = dbObj.collection('orders');
      const productsCollection = dbObj.collection('product');

      // Assuming the businessId is passed securely through your auth mechanism
      const businessId = req.user; // Ensure this is available and secured

      // Fetch all orders for the given businessId
      const orders = await ordersCollection.find({ bid: businessId }).toArray();

      // Calculate metrics directly while fetching orders
      const metrics = {
          totalOrders: orders.length,
          totalMoney: orders.reduce((acc, order) => acc + order.totalAmount, 0),
          pendingOrders: orders.filter(order => order.status === "pending").length,
          completedOrders: orders.filter(order => order.status === "completed").length,
      };

      // Aggregate product counts
      const productCountMap = orders.reduce((acc, order) => {
          acc[order.pid] = (acc[order.pid] || 0) + 1;
          return acc;
      }, {});

      // Fetch only required product details using $in query for all product IDs in the orders
      const productIds = Object.keys(productCountMap).map(id => new ObjectId(id)); // Convert string to ObjectId
      const products = await productsCollection.find(
          { _id: { $in: productIds } },
          { projection: { productName: 1 } }
      ).toArray();

      // Debugging
      // console.log("Products fetched:", products);

      // Create a map of products for quick lookup
      const productMap = products.reduce((acc, product) => {
          acc[product._id.toString()] = product.productName;
          return acc;
      }, {});

      // Create a list of products with the count of how many times each was ordered
      const productCounts = Object.entries(productCountMap).map(([productId, count]) => ({
          productId,
          productName: productMap[productId], // Ensure product names are mapped correctly
          count
      }));

      // Find the most ordered product
      const mostOrderedProduct = productCounts.reduce((max, product) => max.count > product.count ? max : product, productCounts[0] || null);

      // Send back a JSON response containing metrics and simplified product details
      res.json({
          metrics,
          mostOrderedProduct,
          productCounts
      });

  } catch (error) {
      console.error('Error fetching business metrics:', error);
      res.status(500).json({ message: 'Error fetching business metrics.' });
  }
};


module.exports={getBusinessOrdersmetrics,addBusinessLocation,deleteBusinessLocation,getBusinessLocations,businessorders_updatestatus_put_id,getBusinessOrders,businessSignUp_post,businessLogin_post,businessinsertProduct_post,businessProducts_get,businessdeleteproduct_delete,businessUpdateProduct_put_id};