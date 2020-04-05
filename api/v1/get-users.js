/**
 * Route: GET /api/v1/users
 */
const mongoose = require('mongoose');
const User = require('./models/User');
const util = require('./utils');
require('./services/cache');
const { connectDB } = require('../../config/db');

('use strict');

module.exports.handler = async (event) => {
  try {

    const response = await connectDB().then(async () => {
      const users = await User.find().cache();

      console.log('Successfully fetched users from db');

      return {
        statusCode: 200,
        headers: util.getResponseHeaders(),
        body: JSON.stringify(users),
      };
    });

    mongoose.connection.close();

    return response;  

  } catch (err) {
    console.log('Encountered an error:', err);

    return {
      statusCode: err.statusCode ? err.statusCode : 500,
      headers: util.getResponseHeaders(),
      body: JSON.stringify({
        error: err.name ? err.name : 'Exception',
        message: err.message ? err.message : 'Unknown error',
      }),
    };
  }
};
