const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
      '/question-generator',
      createProxyMiddleware({
        target: process.env.REACT_APP_NCLOUD_HYPERCLOVAX_URL,
        changeOrigin: true
      })
    );
};