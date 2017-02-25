var debug = require('debug')('api-gateway:server')
var argv = require('./lib/argv')
var express = require('express')
var proxy = require('http-proxy-middleware')
var morgan = require('morgan')
var rfs = require('rotating-file-stream')
// var https = require('https')
var fs = require('fs')
var path = require('path')
var app = express()

// set server port
app.set('port', argv.port)

var logDirectory = path.join(__dirname, 'logs')

// ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)

// create a rotating write stream
var accessLogStream = rfs('access.log', {
  size: '10M',
  interval: '1d', // rotate daily
  compress: 'gzip',
  path: logDirectory
})

// setup the logger
app.use(morgan('combined', {stream: accessLogStream}))

// Routes middlewares autoloader
require('./routes/index')(app)

// 404 Middleware
app.use(function (req, res, next) {
  res.status(404)
  // respond with json
  if (req.accepts('json')) {
    return res.send({ error: 'Not found' })
  }
  // default to plain-text. send()
  res.type('txt').send('Not found')
})

// start the server
var srv = app.listen(app.get('port'), function () {
  debug(process.pid + ': Server listening on port', srv.address().port)
})

/*
// SSL Certificate
var options = {
  key: fs.readFileSync(__dirname+'/SSL/cert.key'),
  cert: fs.readFileSync(__dirname+'/SSL/cert.crt')
}
// Create an HTTPS service identical to the HTTP service.
https.createServer(options, app).listen(443)
*/
