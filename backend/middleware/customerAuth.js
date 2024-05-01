const jwt = require('jsonwebtoken');
 // Your configuration file

const customerAuthMiddleware = (req, res, next) => {
    
  // Get the token from the request headers
  const token = req.header('Authorization').split(" ")[1];
    // console.log("inside cusoemr auth",token);
  // Check if the token is present
  if (!token) {
    return res.status(401).json({ message: 'Authorization token is missing' });
  }

  try {
    // Verify the token using your secret key
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // Attach the decoded user information to the request object
    req.customerUser = decoded;
    
    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = customerAuthMiddleware;
