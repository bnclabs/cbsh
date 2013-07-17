var optimist = require('optimist');
var restc = require('../restc');
var _ = require('underscore');

module.exports.command = 'setting-alert';

module.exports.usage = function(args) {
    var opts = 
        optimist( args )
        .options( 'enable-email-alert', {
            default : undefined,
            describe : '0|1, allow email alert'
        })
        .options( 'email-recipients', {
            default : undefined,
            describe : 'comma separated list of email recipients'
        })
        .options( 'email-sender', {
            default : undefined,
            describe : 'sender email address'
        })
        .options( 'email-user', {
            default : undefined,
            describe : 'email server username'
        })
        .options( 'email-password', {
            default : undefined,
            describe : 'email server password'
        })
        .options( 'email-host', {
            default : undefined,
            describe : 'email server host'
        })
        .options( 'email-port', {
            default : undefined,
            describe : 'email server port'
        })
        .options( 'email-encrypt', {
            default : undefined,
            describe : '0|1, email encrypt'
        })
        .options( 'alert', {
            default : undefined,
            describe : 'comma separated list of tiggers, supported values are' +
                       'auto_failover_node, auto_failover_maximum_reached, ' +
                       'auto_failover_other_nodes_down, ' +
                       'auto_failover_cluster_too_small, ip, disk, overhead, '+
                       'ep_oom_errors, ep_item_commit_failed'
        })
        .options( 'h', {
            alias : 'help',
            describe : 'options for server-list command'
        })
        .usage(
            'set notification settings\n' +
            'Usage: $0 [OPTIONS] setting-notification [OPTIONS]'
        );
    return opts
}

module.exports.run = function( cluster, options ) {
    var req = _.extend( {}, cluster )
    if( options['enable-email-alert'] === '1' ) {
        req.params.enabled = options['enable-email-alert'];
    }
    if( options['email-recipients'] ) {
        req.params.recipients = options['email-recipients'];
    }
    if( options['email-sender'] ) {
        req.params.sender = options['email-sender'];
    }
    if( options['email-user'] ) {
        req.params.emailUser = options['email-user'];
    }
    if( options['email-password'] ) {
        req.params.emailPass = options['email-password'];
    }
    if( options['email-host'] ) {
        req.params.emailHost = options['email-host'];
    }
    if( options['email-port'] ) {
        req.params.emailPort = options['email-port'];
    }
    if( options['email-encrypt'] ) {
        req.params.emailEncrypt = options['email-encrypt'];
    }
    if( options['alert'] ) {
        req.params.alerts = options['alert']
    }
    restc.setAlert( req, options, function() {} );
}

