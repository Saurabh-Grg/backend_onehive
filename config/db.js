// config/db.js
const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Create a new Sequelize instance
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql', // Specify the database dialect
});

// Test the connection
sequelize.authenticate()
  .then(() => {
    console.log('Connected to MySQL Database using Sequelize');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = sequelize; // Export the Sequelize instance


//saurabh