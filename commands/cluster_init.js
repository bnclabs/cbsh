var optimist = require('optimist');
var restc = require('../restc');
var _ = require('underscore');

module.exports.command = 'cluster-init';

module.exports.usage = function(args) {
    var opts = 
        optimist( args )
        .options( 'cluster-username', {
            default : undefined,
            describe : 'USER, new admin username'
        })
        .options( 'cluster-password', {
            default : undefined,
            describe : 'PASSWORD, new admin password'
        })
        .options( 'cluster-port', {
            default : undefined,
            describe : 'PORT, new cluster REST/http port'
        })
        .options( 'cluster-ramsize', {
            describe : 'RAMSIZE in MB, per node ram quota'
        })
        .options( 'h', {
            alias : 'help',
            describe : 'options for server-list command'
        })
        .usage(
            'initialize cluster with credentials\n' +
            'Usage: $0 [OPTIONS] cluster-init [OPTIONS]'
        );
    return opts
}

module.exports.run = function( cluster, options ) {
    var req = _.extend( {}, cluster )
    port = options['cluster-port'] || 'SAME';
    username = options['cluster-user'] || options.user;
    password = options['cluster-password'] || options.password;
    _.extend( req.params, { port : port, username : username,
                            password : password, initStatus: 'done' });
    restc.clusterInit(
        req, options,
        function(res, data) {
            _.extend( req, {user: username, password: password} );
            req.port = port == 'SAME' ? req.port : Number(port);
            req.params.memoryQuota = options['cluster-ramsize'];
            req.method = 'POST';
            restc.pools( req, options, function(res, data) {}, 'default' );
        }
    );
}



