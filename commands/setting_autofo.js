var optimist = require('optimist');
var restc = require('../restc');
var _ = require('underscore');

module.exports.command = 'setting-autofailover';

module.exports.usage = function(args) {
    var opts = 
        optimist( args )
        .options( 'enable-auto-failover', {
            describe : '0|1, allow auto failover'
        })
        .options( 'auto-failover-timeout', {
            describe : 'TIMEOUT, >=30 specify timeout that expires to trigger' +
                       'auto failover'
        })
        .options( 'h', {
            alias : 'help',
            describe : 'options for server-list command'
        })
        .usage(
            'set auto failover settings\n' +
            'Usage: $0 [OPTIONS] setting-autofailover [OPTIONS]'
        );
    return opts
}

module.exports.run = function( cluster, options ) {
    var req = _.extend( {}, cluster )
    timeout = Number(options['auto-failover-timeout']);
    enable = Number(options['enable-auto-failover']
    if( timeout < 30 ) {
        throw "ERROR: Timeout value must be larger than 30 second."
    } else {
        req.params.timeout = timeout
    }
    if( enable ) {
        req.params.enabled = enable
    }
    restc.setAutoFailover(req, options, function(res, data) {} );
}
