const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  console.log('is default been call')
  app.use(
    'https://suggest.taobao.com/',
    createProxyMiddleware({
      target: 'https://suggest.taobao.com/',
      changeOrigin: true,
    })
  );
};