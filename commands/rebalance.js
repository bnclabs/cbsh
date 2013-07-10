var optimist = require('optimist');
var restc = require('../restc');
var _ = require('underscore');

module.exports.command = 'rebalance';

module.exports.usage = function(args) {
    var opts = 
        optimist( args )
        .options( 'add', {
            default : undefined,
            describe : 'see server-add command OPTIONS'
        })
        .options( 'remove', {
            default : undefined,
            describe : 'HOST[:PORT] server to be removed from cluster'
        })
        .options( 'server-user', {
            default : undefined,
            describe : 'admin username for the server to be added'
        })
        .options( 'server-password', {
            default : undefined,
            describe : 'admin password for the server to be added'
        })
        .options( 'timeout', {
            default : 1000,
            describe : 'admin password for the server to be added'
        })
        .options( 'h', {
            alias : 'help',
            describe : 'options for server-list command'
        })
        .usage(
            'start a cluster rebalancing\n' +
            'Usage: $0 [OPTIONS] rebalance [OPTIONS]'
        );
    return opts
}

module.exports.run = function( cluster, options ) {
    var req = _.extend( {}, cluster )
    var doRebalance = function( req, options ) {
        delete req['params'];
        restc.rebalance(
            req, options, function(st) {options.log("Status : " + st)}
        );
    }

    req.params = { hostname : options['add'] };
    if( options['server-user'] && options['server-password'] ) {
        var server_creds = {
            user : options['server-user'],
            password : options['server-password']
        }
        _.extend(req.params, server_creds);
    }
    if( options['add'] ) {
        restc.addNode(
            req, options, function(res, data) { doRebalance(req, options); }
        );
    } else if( options['remove'] ) {
        restc.getNodes(
            req, options,
            function(nodes) {
                var ejectedOtp = _.filter(
                    nodes,
                    function(n) { n['hostname'] === options['remove'] }
                );
                if( ejectedOtp ) {
                    req.params.knownNodes = _.pluck(nodes, 'otpNode').join(',');
                    req.params.ejectedOtp =
                                _.pluck(ejectedOtp, 'otpNode').join(',');
                    doRebalance(req, options);
                };
            }
        );
    }
}
