var proxy = require('http-proxy-middleware')
var transformerProxy = require('transformer-proxy')

function isPathAbsolute(path) {
  return /^(?:\/|[a-z]+:\/\/)/.test(path);
}

function transformerFunction(data, req, res){
  console.log(data.toString()); return data
  var page = data.toString().replace(/href="\//g, 'href="/iot/')
  page = page.toString().replace(/src="\//g, 'src="/iot/')
  return new Buffer(page)
}

module.exports = function (app) {
  app.use(transformerProxy(transformerFunction))
  app.use('/iot', proxy({target: 'http://192.168.88.111:8080', pathRewrite: {'^/iot' : '/'}, changeOrigin: true, ws: true, logProvider: function(){ return require('debug')('api-gateway:proxyLog')}}))
  app.use('/rpi', proxy({target: 'http://192.168.88.111', pathRewrite: {'^/rpi' : '/'}, changeOrigin: true }))
  // app.use('/rpi', function(req, res, next){ res.end('ciaooo');})
}
