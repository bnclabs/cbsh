var _ = require('underscore');
var optimist = require('optimist');
var restc = require('../restc');
var h = require('../h');

module.exports.command = 'server-list';

module.exports.usage = function(args) {
    var opts = 
        optimist( args )
        .options( 'h', {
            alias : 'help',
            describe : 'options for server-list command'
        })
        .usage(
            'list all servers in the cluster\n' +
            'Usage: $0 [OPTIONS] server-list [OPTIONS]'
        );
    return opts
}


module.exports.run = function( cluster, options ) {
    var req = _.extend( {}, cluster )
    restc.getNodes(
        req, options,
        function(nodes) {
            _.each( _.map(nodes, serverst), function(l) {console.log(l)} );
        },
        'default'
    );
}

// status line for each server
function serverst(n) {
    return [ n['otpNode'], n['hostname'], n['status'], n['clusterMembership']
           ].join('  ');
}

