var optimist = require('optimist');
var restc = require('../restc');
var _ = require('underscore');

module.exports.command = 'bucket-stats';

module.exports.usage = function(args) {
    var opts = 
        optimist( args )
        .options( 'h', {
            alias : 'help',
            describe : 'options for bucket-stats command'
        })
        .usage(
            'bucket statistics in cluster\n' +
            'Usage: $0 [OPTIONS] bucket-stats [OPTIONS]'
        );
    return opts
}

module.exports.run = function( cluster, options ) {
    var req = _.extend( {}, cluster )
    restc.bucketStats(
        req, options, function(json) { options.log(json); }
    );
}





