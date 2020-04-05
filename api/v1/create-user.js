/**
 * Route: POST /api/v1/user
 */
const mongoose = require('mongoose');
const moment = require('moment');
const User = require('./models/User');
const util = require('./utils');
const { connectDB } = require('../../config/db');

('use strict');

module.exports.handler = async (event) => {
  try {
    const userProps = JSON.parse(event.body);

    const response = await connectDB().then(async () => {
      const user = await User.create({
        ...userProps,
        createdAt: moment().toISOString(),
        updatedAt: moment().toISOString(),
        timestamp: moment().unix(),
      });

      console.log(`Successfully created user in db with id ${user._id}`);

      return {
        statusCode: 201,
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
