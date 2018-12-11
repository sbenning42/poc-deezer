const proxy = require('express-http-proxy');
const express = require('express');
const app = express();

app.use('/deezer', proxy('https://api.deezer.com', {
  userResHeaderDecorator(headers, userReq, userRes, proxyReq, proxyRes) {
    // recieves an Object of headers, returns an Object of headers.
    return {
      ...headers,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET'
    };
  }
}));

app.listen(5000, '0.0.0.0', function () {
  console.log('Server listening on port 5000!');
});
