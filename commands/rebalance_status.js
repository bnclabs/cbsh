var optimist = require('optimist');
var restc = require('../restc');
var _ = require('underscore');

module.exports.command = 'rebalance-status';

module.exports.usage = function(args) {
    var opts = 
        optimist( args )
        .options( 'h', {
            alias : 'help',
            describe : 'options for server-list command'
        })
        .usage(
            'show current status of cluster rebalancing\n' +
            'Usage: $0 [OPTIONS] rebalance-status [OPTIONS]'
        );
    return opts
}

module.exports.run = function( cluster, options ) {
    var req = _.extend( {}, cluster );
    restc.rebalanceStatus( req, options, function(st) { options.log(st); } );
}


