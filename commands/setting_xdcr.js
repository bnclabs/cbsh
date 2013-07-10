var optimist = require('optimist');
var restc = require('../restc');
var _ = require('underscore');

module.exports.command = 'setting-xdcr';

module.exports.usage = function(args) {
    var opts = 
        optimist( args )
        .options( 'max-concurrent-reps', {
            default : 32,
            describe : 'maximum concurrent replications per bucket, 8-256'
        })
        .options( 'checkpoint-interval', {
            default : 1800,
            describe : 'intervals between checkpoints, 60 to 14400 seconds'
        })
        .options( 'worker-batch-size', {
            default : 500,
            describe : 'doc batch size, 500 to 10000, default is 500'
        })
        .options( 'doc-batch-size', {
            default : 2048,
            describe : 'document batching size, 10 to 100000 KB'
        })
        .options( 'failure-restart-interval', {
            default : 30,
            describe : 'interval for restarting failed xdcr, 1 to 300 seconds'
        })
        .options( 'optimistic-replication-threshold', {
            default : 256,
            describe : 'document body size threshold (bytes) to trigger ' +
                       'optimistic replication'
        })
        .options( 'h', {
            alias : 'help',
            describe : 'options for server-list command'
        })
        .usage(
            'set xdcr related settings\n' +
            'Usage: $0 [OPTIONS] setting-xdcr [OPTIONS]'
        );
    return opts
}

module.exports.run = function( cluster, options ) {
    var req = _.extend( {}, cluster )
}





