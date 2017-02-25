var debug = require('debug')('api-gateway:server')
var proxy = require('http-proxy-middleware')
var morgan = require('morgan')
var argv = require('./lib/argv')
var https = require('https')
var fs = require('fs')
var express = require('express')
var app = express()

// set server port
app.set('port', argv.port)

app.use('/api', proxy({target: 'http://192.168.88.111:8080/info', changeOrigin: true, ws: true}))

// Routes middlewares
app.use('/api/', require('./routes/backend-router.js'))
app.use('/', require('./routes/frontend-router.js'))

// 404 Middleware
app.use(function (req, res, next) {
  res.status(404)
  // respond with html page
  if (req.accepts('html')) {
    res.render('index', { // render 404.html
      partials: {
        header: 'header',
        navbar: 'navbar',
        body: 'index_body',
        choices: 'choices',
        sidebar: 'sidebar',
        footer: 'footer',
        js_import: 'js_import'
      },
      url: req.url,
      date: Date(),
      pid: process.pid
    })
    return
  }
  // respond with json
  if (req.accepts('json')) {
    res.send({ error: 'Not found' })
    return
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
