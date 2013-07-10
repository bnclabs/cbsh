var optimist = require('optimist');
var restc = require('../restc');
var _ = require('underscore');

module.exports.command = 'server-readd';

module.exports.usage = function(args) {
    var opts = 
        optimist( args )
        .options( 'add', {
            describe : 'HOST[:PORT] server to be added'
        })
        .options( 'h', {
            alias : 'help',
            describe : 'options for server-list command'
        })
        .usage(
            'readd a server to the cluster\n' +
            'Usage: $0 [OPTIONS] server-readd [OPTIONS]'
        );
    return opts
}

module.exports.run = function( cluster, options ) {
    var req = _.extend( {}, cluster )
    restc.getNodes(
        req, options,
        function(nodes) {
            var readdOtp = _.filter(
                nodes,
                function(n) { n['hostname'] === options['add'] }
            );
            if( readdOtp ) {
                req.params.otpNode = _.pluck(readdOtp, 'otpNode').join(',');
            };
        }
    );
}


