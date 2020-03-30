module.exports = {
  CORS_DEBUG: process.env.CORS_DEBUG || 'localhost:8080',
  REDIS_ADDR: process.env.REDIS_ADDR || 'localhost:6379',
  FRONTEND_ADDR: process.env.FRONTEND_ADDR || 'http://localhost:8080',
};
