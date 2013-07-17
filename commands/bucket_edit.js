var optimist = require('optimist');
var restc = require('../restc');
var _ = require('underscore');

module.exports.command = 'bucket-edit';

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
        .options( 'h', {
            alias : 'help',
            describe : 'options for server-list command'
        })
        .usage(
            'modify an existing bucket\n' +
            'Usage: $0 [OPTIONS] bucket-edit [OPTIONS]'
        );
    return opts
}

module.exports.run = function( cluster, options ) {
    // validate parameters
    if( opts.argv['bucket-name'] == 'default' ) {
        if( opts.argv['bucket-port'] && opts.argv['bucket-port'] != "11211" ) {
            throw "default bucket must be on port 11211."
        }
        if( opts.argv['bucket-password'] ) {
            throw "default bucket should only have empty password."
        }
    } else if( opts.argv['bucket-name'] ) {
        opts.argv['auth-type'] = 
                opts.argv['bucket-port'] == "11211" ? 'sasl' : undefined;
        if( opts.argv['auth-type'] && opts.argv['bucket-password'] ) {
            throw "a sasl bucket is supported only on port 11211."
        }
    }

    var req = _.extend( {}, cluster )
    req.params['name'] = options['bucket-name']
    req.params['bucketType'] = options['bucket-type']
    req.params['authType'] = options['auth-type']
    req.params['proxyPort'] = options['bucket-port']
    req.params['saslPassword'] = options['bucket-password']
    req.params['ramQuotaMB'] = options['bucket-ramsize']
    req.params['replicaNumber'] = options['bucket-replica']
    req.params['flushEnabled'] = options['enable-flush']
    req.params['replicaIndex'] = options['enable-index-replica']
    _.each(
      req, function(val, key) { if( val == undefined ) delete req.params[key]; }
    )
    restc.bucketEdit(
        reqC, options,
        function(res, data) { options.log( JSON.parse(data) ); }
    );
}





