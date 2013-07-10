var optimist = require('optimist');
var restc = require('../restc');
var _ = require('underscore');

module.exports.command = 'eject-server';

module.exports.usage = function(args) {
    var opts = 
        optimist( args )
        .options( 'server-failover', {
            describe : 'HOST[:PORT] server to failover'
        })
        .options( 'h', {
            alias : 'help',
            describe : 'options for server-list command'
        })
        .usage(
            'eject server\n' +
            'Usage: $0 [OPTIONS] eject-server [OPTIONS]'
        );
    return opts
}

module.exports.run = function( cluster, options ) {
    var req = _.extend( {}, cluster )
}


