const getResponseHeaders = () => {
    return {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    };
  };

module.exports = { getResponseHeaders };