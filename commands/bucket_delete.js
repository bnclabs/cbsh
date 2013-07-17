var optimist = require('optimist');
var restc = require('../restc');
var _ = require('underscore');

module.exports.command = 'bucket-delete';

module.exports.usage = function(args) {
    var opts = 
        optimist( args )
        .options( 'bucket-name', {
            describe : 'bucket to act on'
        })
        .options( 'h', {
            alias : 'help',
            describe : 'options for server-list command'
        })
        .usage(
            'delete an existing bucket\n' +
            'Usage: $0 [OPTIONS] bucket-delete [OPTIONS]'
        );
    return opts
}

module.exports.run = function( cluster, options ) {
    var req = _.extend( {}, cluster )
    req.path = '/pools/default/buckets/' + options['bucket-name']
    restc.bucketDelete(
        req, options,
        function(res, data) { options.log( JSON.parse(data) ) }
    );
}






