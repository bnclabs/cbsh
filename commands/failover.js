var optimist = require('optimist');
var restc = require('../restc');
var _ = require('underscore');

module.exports.command = 'failover';

module.exports.usage = function(args) {
    var opts = 
        optimist( args )
        .options( 'failover', {
            describe : 'HOST[:PORT] server to failover'
        })
        .options( 'h', {
            alias : 'help',
            describe : 'options for server-list command'
        })
        .usage(
            'failover server\n' +
            'Usage: $0 [OPTIONS] failover [OPTIONS]'
        );
    return opts
}

module.exports.run = function( cluster, options ) {
    var req = _.extend( {}, cluster )
    req.params = { hostname : options['add'] };
    restc.failOver( req, options, function(res, data) {} );
}


