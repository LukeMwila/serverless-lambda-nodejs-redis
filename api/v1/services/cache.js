const mongoose = require('mongoose');
const redis = require('redis');
const util = require('util');
const redisUrl = process.env.REDIS_URL;
const client = redis.createClient(redisUrl);

client.auth(process.env.REDIS_AUTH);
client.hget = util.promisify(client.hget);

// This stores a reference to the original exec function
const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function (options = {}) {
  // this is equal to the query instance
  this.useCache = true;
  // cache key for top level property
  this.hashKey = JSON.stringify(options.key || 'default');
  // to make this a chainable function call, return this
  return this;
};

// Override the exec function
mongoose.Query.prototype.exec = async function () {
  // if useCache is not set to true, then don't run any of the logic below
  if (!this.useCache) {
    return exec.apply(this, arguments);
  }

  // Run the following before any query is executed by Mongo
  const key = JSON.stringify(
    Object.assign({}, this.getQuery(), {
      collection: this.mongooseCollection.name,
    })
  );

  // See if we have a value for 'key' in redis
  const cacheValue = await client.hget(this.hashKey, key);

  // If we do, return the cached value
  if (cacheValue) {

    const document = JSON.parse(cacheValue);
    // Anything that comes out of Redis is in JSON form
    // so we need to parse it
    // and then return a Mongoose model instance

    // this.model represents the model that this query is attached to
    // we can create a new instance of it
    return Array.isArray(document)
      ? document.map((doc) => {
          // Hyrdate values
          return new this.model(doc);
        })
      : new this.model(document);
  }
  // Otherwise, issue the query and store the result in redis
  const result = await exec.apply(this, arguments);
  // Set cache expiration
  client.hset(this.hashKey, key, JSON.stringify(result));

  return result;
};

module.exports = {
  clearHash(hashKey) {
    client.del(JSON.stringify(hashKey));
  },
};
