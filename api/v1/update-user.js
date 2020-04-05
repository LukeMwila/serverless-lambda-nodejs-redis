/**
 * Route: PUT /api/v1/user
 */
const mongoose = require('mongoose');
const moment = require('moment');
const User = require('./models/User');
const util = require('./utils');
const { clearHash } = require('./services/cache');
const { connectDB } = require('../../config/db');

('use strict');

module.exports.handler = async (event) => {
  try {
    const userId = decodeURIComponent(event.pathParameters.userId);
    const userProps = JSON.parse(event.body);

    const response = await connectDB().then(async () => {

      await User.findByIdAndUpdate(
        { _id: userId },
        { ...userProps, updatedAt: moment().toISOString() }
      );
      const user = await User.findById({ _id: userId });

      console.log(`Successfully updated user in db: ${user._id}`);

      return {
        statusCode: 200,
        headers: util.getResponseHeaders(),
        body: JSON.stringify(user),
      };
    });

    clearHash(userId);
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
