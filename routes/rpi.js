var proxy = require('http-proxy-middleware')

module.exports = function (app) {
  // app.use('/iot', proxy({target: 'http://192.168.88.111:8080', changeOrigin: true, ws: true}))
  app.use('/rpi', proxy({target: 'http://192.168.88.111', onError: function onError (err, req, res) {
    res.writeHead(500, {'Content-Type': 'text/plain'})
    res.end(err.toString())
  }}))
  // app.use('/rpi', function(req, res, next){ res.end('ciaooo');})
}
