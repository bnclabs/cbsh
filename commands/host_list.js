var optimist = require('optimist');
var restc = require('../restc');
var _ = require('underscore');

module.exports.command = 'host-list';

module.exports.usage = function(args) {
    var opts = 
        optimist( args )
        .options( 'h', {
            alias : 'help',
            describe : 'options for host-list command'
        })
        .usage(
            'list hostname of all servers in the cluster\n' +
            'Usage: $0 [OPTIONS] host-list [OPTIONS]'
        );
    return opts
}

module.exports.run = function( cluster, options ) {
    var req = _.extend( {}, cluster )
    restc.getNodes(
        req, options,
        function(nodes) {
            _.each( nodes, function(n) {console.log(n['hostname'])} );
        }
    );
}

