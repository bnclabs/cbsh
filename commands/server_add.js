var optimist = require('optimist');
var restc = require('../restc');
var _ = require('underscore');

module.exports.command = 'server-add';

module.exports.usage = function(args) {
    var opts = 
        optimist( args )
        .options( 'add', {
            describe : 'HOST[:PORT] server to be added'
        })
        .options( 'server-username', {
            describe : 'admin username for the server to be added'
        })
        .options( 'server-password', {
            describe : 'admin password for the server to be added'
        })
        .options( 'h', {
            alias : 'help',
            describe : 'options for server-list command'
        })
        .usage(
            'add a server to the cluster\n' +
            'Usage: $0 [OPTIONS] server-add [OPTIONS]'
        );
    return opts
}

module.exports.run = function( cluster, options ) {
    var req = _.extend( {}, cluster )
    req.params = { hostname : options['add'] };
    if( options['server-user'] && options['server-password'] ) {
        var server_creds = {
            user : options['server-user'],
            password : options['server-password']
        }
        _.extend(req.params, server_creds);
    }
    restc.addNode( req, options, function(res, data) {} );
}
