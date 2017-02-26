var debug = require('debug')('api-gateway:incoming')
module.exports = function (req, res, next) {
  var mex = req.protocol+' - '+req.method+' - '+req.url
  debug(process.pid, ':', mex)
  next()
}
