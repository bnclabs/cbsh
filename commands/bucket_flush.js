var optimist = require('optimist');
var restc = require('../restc');
var _ = require('underscore');

module.exports.command = 'bucket-flush';

module.exports.usage = function(args) {
    var opts = 
        optimist( args )
        .options( 'bucket-name', {
            default : undefined,
            describe : 'bucket to act on'
        })
        .options( 'force', {
            default : false,
            describe : 'force to execute command without conformation'
        })
        .options( 'data-only', {
            describe : 'compact database data only'
        })
        .options( 'view-only', {
            describe : 'compact view data only'
        })
        .options( 'h', {
            alias : 'help',
            describe : 'options for server-list command'
        })
        .usage(
            'flush all data from disk for a given bucket\n' +
            'Usage: $0 [OPTIONS] bucket-flush [OPTIONS]'
        );
    return opts
}

module.exports.run = function( cluster, options ) {
    var req = _.extend( {}, cluster );
    req.path = '/pools/default/buckets/' + options['bucket-name'] +
               '/controller/doFlush';
    restc.bucketFlush(
        req, options,
        function(res, data) { options.log( JSON.parse(data) ) }
    );
}







