// Routes autoloader

var fs = require('fs')
var debug = require('debug')('api-gateway:routesLoader')

module.exports = function(app){
  fs.readdirSync(__dirname)
    .filter(function(file) {
      return (file.indexOf('.') !== 0) && (file !== 'index.js')
    })
    .forEach(function(file){
      require(file)(app)
      debug('Route', file, 'loaded')
    })
}
