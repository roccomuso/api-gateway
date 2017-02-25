// Clustering to exploit all the cores of a machine. Node is single-threaded so it will use by default only 1 core.
var cluster = require('cluster')
var debug = require('debug')('api-gateway:boot')
var argv = require('./lib/argv')

if (cluster.isMaster) { // Master process
  var environment = process.env.NODE_ENV || 'development' // production to use express built-in cache middleware
  debug('Running in %s environment', environment)

  var numCPUs = argv.istances || require('os').cpus().length

  for (var i = 0; i < numCPUs; i++) {
    cluster.fork() // 1 process per core
  }

  debug('Master process online with PID', process.pid)

  cluster.on('online', function (worker) {
    debug('Worker ' + worker.process.pid + ' is online')
  })

  cluster.on('exit', function (worker, code, signal) {
    debug('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal)
    debug('Starting a new worker')
    cluster.fork()
  })
} else { // Worker process
  require('./server.js')
}

// NB. Windows doesn't use a Round-Robin approach.
