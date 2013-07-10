var optimist = require('optimist');
var restc = require('../restc');
var _ = require('underscore');

module.exports.command = 'xdcr-setup';

module.exports.usage = function(args) {
    var opts = 
        optimist( args )
        .options( 'create', {
            describe : 'create a new xdcr configuration'
        })
        .options( 'edit', {
            describe : 'modify existing xdcr configuration'
        })
        .options( 'delete', {
            describe : 'delete existing xdcr configuration'
        })
        .options( 'xdcr-cluster-name', {
            describe : 'cluster name'
        })
        .options( 'xdcr-hostname', {
            describe : 'remote host name to connect to'
        })
        .options( 'xdcr-username', {
            describe : 'remote cluster admin username'
        })
        .options( 'xdcr-password', {
            describe : 'remote cluster admin password'
        })
        .options( 'h', {
            alias : 'help',
            describe : 'options for server-list command'
        })
        .usage(
            'setup xdcr connection\n' +
            'Usage: $0 [OPTIONS] xdcr-setup [OPTIONS]'
        );
    return opts
}

module.exports.run = function( cluster, options ) {
    var req = _.extend( {}, cluster )
}






