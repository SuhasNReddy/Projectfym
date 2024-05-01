// redisClient.js
const Redis = require('ioredis');

// You can specify the Redis connection details through environment variables or directly in the code
const redis = new Redis({
  port: 4000,          // Redis port
  host: '127.0.0.1',   // Redis host
  family: 4,           // 4 (IPv4) or 6 (IPv6)
  password: 'auth',    // set your password
  db: 0                // specify the database number
});

module.exports = redis;
