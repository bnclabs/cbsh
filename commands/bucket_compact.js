var optimist = require('optimist');
var restc = require('../restc');
var _ = require('underscore');

module.exports.command = 'bucket-compact';

module.exports.usage = function(args) {
    var opts = 
        optimist( args )
        .options( 'bucket-name', {
            describe : 'bucket to act on'
        })
        .options( 'bucket-type', {
            describe : 'TYPE, either memcached or couchbase'
        })
        .options( 'bucket-port', {
            describe : 'standard port, exlusive with bucket-port'
        })
        .options( 'bucket-password', {
            describe : 'support ASCII protocol and is auth-less'
        })
        .options( 'bucket-remsize', {
            describe : 'bucket ram quota in MB'
        })
        .options( 'bucket-replica', {
            describe : 'replication count for bucket'
        })
        .options( 'enable-flush', {
            describe : 'enable or disable flush'
        })
        .options( 'enable-index-replica', {
            describe : 'enable or disable index replicas'
        })
        .options( 'wait', {
            describe : 'wait for bucket create to complete before returning'
        })
        .options( 'force', {
            describe : 'force to execute command without conformation'
        })
        .options( 'data-only', {
            default : undefined,
            describe : 'compact database data only'
        })
        .options( 'view-only', {
            default : undefined,
            describe : 'compact view data only'
        })
        .options( 'h', {
            alias : 'help',
            describe : 'options for server-list command'
        })
        .usage(
            'compact database and index data\n' +
            'Usage: $0 [OPTIONS] bucket-compact [OPTIONS]'
        );

    return opts
}

module.exports.run = function( cluster, options ) {
    // validate parameters
    if( opts.argv['data-only'] && opts.argv['view-only'] ) {
        throw "You cannot compact data only and view only at the same time."
    }

    var req = _.extend( {}, cluster );
    req.path = '/pools/default/buckets';
    if( options['data-only'] ) {
        req.path = req.path + '/controller/compactDatabases'
    } else if( options['view-only'] ) {
        self.compact_view(rest, server, port, bucketname)
        req.path = util.format('/pools/default/buckets/%s/ddocs', bucket_name);
        req.method = 'GET';
        ddoc_info = restc.request(
            req, options,
            function(res, data) {
                _.each( rest_query.getJson(data)['rows'], 
                    function( row ) {
                        req.path = row["controllers"]["compact"];
                        req.method = 'POST';
                        restc.request(
                            req, options,
                            function(res, data) { options.log( JSON.parse(data) ) }
                        );
                    }
                );
            }
        );
    }
    else {
        req.path = req.path + '/controller/compactBucket'
        restc.request(
            req, options,
            function(res, data) { options.log( JSON.parse(data) ) }
        );
    }
}




