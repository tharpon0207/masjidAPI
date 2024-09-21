'use strict';

var SwaggerExpress = require('swagger-express-mw');
var app = require('express')();
var cors = require('cors')
module.exports = app; // for testing

var config = {
  appRoot: __dirname // required config
};

SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

  // install middleware
  swaggerExpress.register(app);

  var port = process.env.PORT || 10010;

  app.use(cors());
  const { createProxyMiddleware } = require('http-proxy-middleware');
  app.use('/*', createProxyMiddleware({
      target: 'http://localhost:3000/', //original url
      changeOrigin: true,
      //secure: false,
      onProxyRes: function (proxyRes, req, res) {
         proxyRes.headers['Access-Control-Allow-Origin'] = '*';
      }
  }));

  app.listen(port);

  if (swaggerExpress.runner.swagger.paths['/hello']) {
    console.log('try this:\ncurl http://127.0.0.1:' + port + '/hello?name=Scott');
  }
});
