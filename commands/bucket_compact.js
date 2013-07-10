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
            'compact database and index data\n' +
            'Usage: $0 [OPTIONS] bucket-compact [OPTIONS]'
        );
    return opts
}

module.exports.run = function( cluster, options ) {
    var req = _.extend( {}, cluster )
}








