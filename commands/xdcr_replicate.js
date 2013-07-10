var optimist = require('optimist');
var restc = require('../restc');
var _ = require('underscore');

module.exports.command = 'xdcr-replicate';

module.exports.usage = function(args) {
    var opts = 
        optimist( args )
        .options( 'create', {
            describe : 'create and start a new replication'
        })
        .options( 'delete', {
            describe : 'stop and cancel a replication'
        })
        .options( 'xdcr-from-bucket', {
            describe : 'local bucket name to replicate from'
        })
        .options( 'xdcr-to-bucket', {
            describe : 'remote bucket to replicate to'
        })
        .options( 'xdcr-cluster-name', {
            describe : 'remote cluster to replicate to'
        })
        .options( 'h', {
            alias : 'help',
            describe : 'options for server-list command'
        })
        .usage(
            'xdcr operations\n' +
            'Usage: $0 [OPTIONS] xdcr-replicate [OPTIONS]'
        );
    return opts
}

module.exports.run = function( cluster, options ) {
    var req = _.extend( {}, cluster )
}







