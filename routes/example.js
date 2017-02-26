var proxy = require("http-proxy-middleware")

/**
 * Proxy options
 */
var options = {
    // hostname to the target server
    target: 'http://localhost:3000',

    // set correct host headers for name-based virtual hosted sites
    changeOrigin: true,

    // enable websocket proxying
    ws: true,

    // additional request headers
    headers: {
        'x-powered-by': 'api-gateway'
    },

    // rewrite paths
    pathRewrite: {
        '^/api/old-path' : '/api/new-path',     // rewrite path
        '^/api/remove/path' : '/path'           // remove base path
    },

    // re-target based on the request's host header and/or path
    router: {
      // host[/path]                 :  <new target>
      // /path                       :  <new target>
        'integration.localhost:8000' : 'http://localhost:8001',  // host only
        'staging.localhost:8000'     : 'http://localhost:8002',  // host only
        'localhost:8000/api'         : 'http://localhost:8003',  // host + path
        '/rest'                      : 'http://localhost:8004'   // path only
    },

    // control logging
    logLevel: 'silent',

    // use a different lib for logging;
    // i.e., write logs to file or server
    /*
    logProvider: function (provider) {
        return winston;
    },
    */

    // subscribe to http-proxy's error event
    onError: function onError(err, req, res) {
        res.writeHead(500, {'Content-Type': 'text/plain'});
        res.end('Something went wrong.');
    },

    // subscribe to http-proxy's proxyRes event
    onProxyRes: function (proxyRes, req, res) {
        //proxyRes.headers['x-added'] = 'foobar'; // add header to the response
        //delete proxyRes.headers['x-removed']; // delete response header
    },

    // subscribe to http-proxy's proxyReq event
    onProxyReq: function (proxyReq, req, res) {
        // add custom header to request
        proxyReq.setHeader('x-forwarded-for', req.connection.remoteAddress);
    }

    /**
     * The following options are provided by Nodejitsu's http-proxy
     */

    // target
    // forward
    // agent
    // ssl
    // ws
    // xfwd
    // secure
    // toProxy
    // prependPath
    // ignorePath
    // localAddress
    // changeOrigin
    // auth
    // hostRewrite
    // autoRewrite
    // protocolRewrite
    // headers

}

/**
 * Create the proxy middleware, so it can be used in a server.
 */

module.exports = function(app){
  app.use('/example', proxy(options))
}
