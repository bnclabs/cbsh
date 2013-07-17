var optimist = require('optimist');
var restc = require('../restc');
var _ = require('underscore');

var timeout = 100; // milli-seconds

module.exports.command = 'bucket-create';

module.exports.usage = function(args) {
    var opts = 
        optimist( args )
        .options( 'bucket-name', {
            default : 'default',
            describe : 'bucket to act on'
        })
        .options( 'bucket-port', {
            default : undefined,
            describe : 'standard port, exlusive with bucket-port'
        })
        .options( 'bucket-password', {
            default : undefined,
            describe : 'support ASCII protocol and is auth-less'
        })
        .options( 'bucket-type', {
            default : undefined,
            describe : 'TYPE, either memcached or couchbase'
        })
        .options( 'bucket-ramsize', {
            default : undefined,
            describe : 'bucket ram quota in MB'
        })
        .options( 'bucket-replica', {
            default : undefined,
            describe : 'replication count for bucket'
        })
        .options( 'enable-flush', {
            default : undefined,
            describe : 'enable or disable flush'
        })
        .options( 'enable-index-replica', {
            default : undefined,
            describe : 'enable or disable index replicas'
        })
        .options( 'wait', {
            default : false,
            describe : 'wait for bucket create to complete before returning' +
                       'optionally specify number of milli seconds to wait'
        })
        .options( 'h', {
            alias : 'help',
            describe : 'options for server-list command'
        })
        .usage(
            'add a new bucket to the cluster\n' +
            'Usage: $0 [OPTIONS] bucket-create [OPTIONS]'
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

    var req = _.extend( {}, cluster );
    var reqC = _extend( {}, req );
    reqC.params['name'] = options['bucket-name']
    reqC.params['bucketType'] = options['bucket-type']
    reqC.params['authType'] = options['auth-type']
    reqC.params['proxyPort'] = options['bucket-port']
    reqC.params['saslPassword'] = options['bucket-password']
    reqC.params['ramQuotaMB'] = options['bucket-ramsize']
    reqC.params['replicaNumber'] = options['bucket-replica']
    reqC.params['flushEnabled'] = options['enable-flush']
    reqC.params['replicaIndex'] = options['enable-index-replica']
    _.each(
      reqC, function(val, key) { if( val == undefined ) delete reqC.params[key]; }
    )
    restc.bucketCreate(
        reqC, options,
        function(res, data) {
            var wait = 120000;
            try { wait = Number(wait); } catch(e) { };
            if( options['wait'] ) {
                setInterval(
                    _.partial(check_bucket, [req, option, wait-timeout]),
                    _.partial(check_node, [req, option, wait-timeout]),
                    timeout
                );
            } else {
                options.log('creating %s ...' , options['bucket-name']);
                options.log( JSON.parse(data) );
            }
        }
    );
}

function check_bucket( req, option, wait ) {
    restc.bucketList(
        req, options,
        function(json) {
            var ns = _.pluck(json, 'name');
            if( wait <= 0 ) {
                options.log('timeout');
            } else if( _.contains(ns, buckoptions['bucket-name']) ) {
                options.log('done');
            } else {
                setInterval(
                    _.partial( check_bucket, [req, option, wait-timeout] ),
                    timeout
                )
            }
    });
}

function check_node(req, options, wait) {
    restc.bucketInfo(
        req, options,
        function(json) {
            var ns = _.pluck(json, 'status');
            if( wait <= 0 ) {
                options.log('timeout');
            } else if( _.every(ns, function(x) { x=='healthy'}) ) {
                options.log('done');
            } else {
                setInterval(
                    _.partial( check_node, [req, option, wait-timeout] ),
                    timeout
                )
            }
    });
}
