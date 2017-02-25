var argv = require('yargs')
  .usage('Usage: npm start -- -p <PORT> -P <SSL_PORT>')
  .help('help')
  .alias('help', 'h')
  .option('port', {
        alias: 'p',
        demand: true,
        describe: 'HTTP Port',
        type: 'number'
    })
  .option('sslPort', {
        alias: 'P',
        demand: false,
        describe: 'HTTPS Port',
        type: 'number'
    })
  .option('istances', {
        alias: 'i',
        demand: false,
        describe: 'Number of process istances',
        type: 'number'
  })
  .example('npm start -- -p 80', 'Start the API gateway on port 80.')
  .example('npm start -- -p 80 -i 4', 'Start 4 istances (processes) of the gateway.')
  .epilogue('@Author: Rocco Musolino - @Copyright 2017')
  .argv

module.exports = argv
