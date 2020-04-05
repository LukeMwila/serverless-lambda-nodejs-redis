/**
 * Route: GET /api/v1/user
 */
const mongoose = require('mongoose');
const User = require('./models/User');
const util = require('./utils');
require('./services/cache');
const { connectDB } = require('../../config/db');

('use strict');

module.exports.handler = async (event) => {
  try {
    const userId = decodeURIComponent(event.pathParameters.userId);

    const response = await connectDB().then(async () => {
      const user = await User.findById({
        _id: userId,
      }).cache({ key: userId });

      console.log(`Successfully fetched user from db: ${user._id}`);

      return {
        statusCode: 200,
        headers: util.getResponseHeaders(),
        body: JSON.stringify(user),
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
