const assert = require('assert');
const axios = require('axios');

// Set up Axios instance with base URL for your API
const api = axios.create({
  baseURL: 'http://localhost:4000/api' // Update with your API's base URL
});

describe('Customer API Routes', function() {
  
  // Test customer signup route
  describe('POST /customer/signup', function() {
    it('should register a new customer', async function() {
      const response = await api.post('/customer/signup', {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123'
      });
      assert.strictEqual(response.status, 200);
      assert.strictEqual(response.data.email, 'test@example.com');
      assert.strictEqual(typeof response.data.token, 'string');
    });
  });

  // Test customer login route
  describe('POST /customer/login', function() {
    it('should log in as an existing customer', async function() {
      const response = await api.post('/customer/login', {
        email: 'test@example.com',
        password: 'password123'
      });
      assert.strictEqual(response.status, 200);
    });
  });

  // Test getting all products route
  describe('GET /customer/products', function() {
    it('should retrieve all products available to customers', async function() {
      const response = await api.get('/customer/products');
      assert.strictEqual(response.status, 200);
      assert(Array.isArray(response.data));
      // Add more specific assertions if needed
    });
  });

  // Add more test cases for other routes as needed

});
