var optimist = require('optimist');
var restc = require('../restc');
var _ = require('underscore');

module.exports.command = 'bucket-ddocs';

module.exports.usage = function(args) {
    var opts = 
        optimist( args )
        .options( 'h', {
            alias : 'help',
            describe : 'options for bucket-ddocs command'
        })
        .usage(
            'bucket design docs in cluster\n' +
            'Usage: $0 [OPTIONS] bucket-ddocs [OPTIONS]'
        );
    return opts
}

module.exports.run = function( cluster, options ) {
    var req = _.extend( {}, cluster )
    restc.bucketDDocs(
        req, options, function(json) { options.log(json); }
    );
}


