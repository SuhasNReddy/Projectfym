const businesscontrollers = require("../controllers/businesscontrollers");
const express = require('express');
const multer = require('multer');
const path=require('path');
// console.log(path.join(__dirname, '..', '..', 'uploads'),"b iasfi");
// Create a Multer storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, path.join(__dirname, '..', '..', 'uploads'));
  },
  filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

const router = express.Router();

const requireAuth = require("../middleware/requireAuth");

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:             
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT    
 * security:
 *   - bearerAuth: []
 */


/**
 * @swagger
 * /business/business_signup_post:
 *   post:
 *     summary: Register a new business
 *     tags: [Business]
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
 *         description: Business registered successfully
 *       400:
 *         description: Error registering business
 */

router.post('/business_signup_post', businesscontrollers.businessSignUp_post);

/**
 * @swagger
 * /business/business_login_post:
 *   post:
 *     summary: Login as a business
 *     tags: [Business]
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
 *         description: Business logged in successfully
 *       400:
 *         description: Error logging in business
 */

router.post("/business_login_post", businesscontrollers.businessLogin_post);



router.get("/business_get", (req, res) => {
  res.json({ message: "business get route" });
});

router.use(requireAuth);

/**
 * @swagger
 * /business/businesslocations_get:
 *   get:
 *     summary: Get business locations
 *     tags: [Business]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns business locations
 *       404:
 *         description: No locations found
 *       500:
 *         description: Internal server error
 */
router.get("/businesslocations_get", businesscontrollers.getBusinessLocations);


/**
 * @swagger
 * /business/businesslocationdelete_post/{location}:
 *   delete:
 *     summary: Delete business location
 *     tags: [Business]
 *     parameters:
 *       - in: path
 *         name: location
 *         required: true
 *         description: The location to delete
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Location deleted successfully
 *       404:
 *         description: Location not found
 *       500:
 *         description: Internal server error
 */

router.delete("/businesslocationdelete_post/:location", businesscontrollers.deleteBusinessLocation);


/**
 * @swagger
 * /business/businessinsertProduct_post:
 *   post:
 *     summary: Insert product for business
 *     tags: [Business]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               productImage:
 *                 type: string
 *                 format: binary
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               quantity:
 *                 type: number
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Product inserted successfully
 *       404:
 *         description: Product not inserted
 *       500:
 *         description: Internal server error
 */

router.post("/businessinsertProduct_post", upload.single('productImage'), businesscontrollers.businessinsertProduct_post);


/**
 * @swagger
 * /business/businessproducts_get:
 *   get:
 *     summary: Get business products
 *     tags: [Business]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns business products
 *       404:
 *         description: No products found
 *       500:
 *         description: Internal server error
 */

router.get("/businessproducts_get", businesscontrollers.businessProducts_get);


/**
 * @swagger
 * /business/businessdeleteproduct/{productid}:
 *   delete:
 *     summary: Delete business product
 *     tags: [Business]
 *     parameters:
 *       - in: path
 *         name: productid
 *         required: true
 *         description: The ID of the product to delete
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */

router.delete("/businessdeleteproduct/:productid", businesscontrollers.businessdeleteproduct_delete);

/**
 * @swagger
 * /business/businessupdateproduct_put/{productId}:
 *   put:
 *     summary: Update business product
 *     tags: [Business]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         description: The ID of the product to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productBudget:
 *                 type: number
 *               productDescription:
 *                 type: string
 *               productDiscount:
 *                 type: number
 *               productQuantity:
 *                 type: number
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */

router.put('/businessupdateproduct_put/:productId', businesscontrollers.businessUpdateProduct_put_id);


/**
 * @swagger
 * /business/businessorders_get:
 *   get:
 *     summary: Get business orders
 *     tags: [Business]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns business orders
 *       500:
 *         description: Internal server error
 */

router.get("/businessorders_get",businesscontrollers.getBusinessOrders);


/**
 * @swagger
 * /business/businessorders_updatestatus/{id}:
 *   put:
 *     summary: Update business order status
 *     tags: [Business]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the order to update
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *       404:
 *         description: Order not found or unauthorized
 *       500:
 *         description: Internal server error
 */

router.put('/businessorders_updatestatus/:id', businesscontrollers.businessorders_updatestatus_put_id);



/**
 * @swagger
 * /business/metric/orders:
 *   get:
 *     summary: Get metrics on business orders
 *     tags: [Business]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns metrics related to orders
 *       500:
 *         description: Internal server error
 */

router.get("/business/metric/orders",businesscontrollers.getBusinessOrdersmetrics);

/**
 * @swagger
 * /business/businesslocationadd_post:
 *   post:
 *     summary: Add a location to a business
 *     tags: [Business]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               lat:
 *                 type: number
 *               lng:
 *                 type: number
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Location added successfully
 *       400:
 *         description: Invalid location data provided
 *       404:
 *         description: Business not found
 *       500:
 *         description: Internal server error
 */

router.post("/businesslocationadd_post", businesscontrollers.addBusinessLocation);
module.exports = router;
