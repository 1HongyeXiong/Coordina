// Jest setup file for global test configuration
// This file runs before each test file

// Mock environment variables
process.env.MONGO_URI = 'mongodb://localhost:27017/test-coordina';
process.env.PORT = '5001';

