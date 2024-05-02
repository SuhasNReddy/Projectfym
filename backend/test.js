const assert = require('assert');
const axios = require('axios');


 const baseURL: 'http://localhost:4000/api' // Update with your API's base URL


 async function testRegisterValidUser() {
   try {
    const userData = {
      
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123'
    };
      const response = await axios.post(`${baseURL}/customer/signup`, userData);
      console.log('Register User - Valid Data:', response.data);
    }catch(error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
  }

// Test customer login route
async function testLoginValidUser() {
  try {
    const loginData = {
      email: 'test@example.com',
      password: 'password123'
    };
    const response = await axios.post(`${baseURL}/customer/login`, loginData);
    console.log('Login User - Valid Credentials:', response.data);
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
}
  

  // Add more test cases for other routes as needed

async function runTests() {
  await testRegisterValidUser();
  await testLoginValidUser();
  

}

// Run tests
runTests();
