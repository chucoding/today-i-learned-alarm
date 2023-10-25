const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
      process.env.REACT_APP_NCLOUD_PUSH_API_ENDPOINT,
      createProxyMiddleware({
        target: 'https://sens.apigw.ntruss.com',
        changeOrigin: true
      })
    );
};