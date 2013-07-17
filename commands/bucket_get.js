var optimist = require('optimist');
var restc = require('../restc');
var _ = require('underscore');

module.exports.command = 'bucket-get';

module.exports.usage = function(args) {
    var opts = 
        optimist( args )
        .options( 'h', {
            alias : 'help',
            describe : 'options for bucket-get command'
        })
        .usage(
            'get all bucket in cluster\n' +
            'Usage: $0 [OPTIONS] bucket-get [OPTIONS]'
        );
    return opts
}

module.exports.run = function( cluster, options ) {
    var req = _.extend( {}, cluster )
    restc.bucketGet(
        req, options,
        function(json) { options.log(json); }
    );
}




