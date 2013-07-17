var optimist = require('optimist');
var restc = require('../restc');
var _ = require('underscore');

module.exports.command = 'bucket-node-stats';

module.exports.usage = function(args) {
    var opts = 
        optimist( args )
        .options( 'h', {
            alias : 'help',
            describe : 'options for bucket-node-stats command'
        })
        .usage(
            'bucket node statistics in cluster\n' +
            'Usage: $0 [OPTIONS] bucket-node-stats [OPTIONS]'
        );
    return opts
}

module.exports.run = function( cluster, options ) {
    var req = _.extend( {}, cluster )
    restc.bucketNodeStats(
        req, options, function(json) { options.log(json); }
    );
}

