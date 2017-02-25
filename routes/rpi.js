var proxy = require('http-proxy-middleware')

module.exports = function(app){
  app.use('/api', proxy({target: 'http://192.168.88.111:8080', changeOrigin: true, ws: true}))
}
