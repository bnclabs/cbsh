var optimist = require('optimist');
var cp = require('child_process');
var _ = require('underscore');
var restc = require('../restc');

module.exports.command = 'server-eshell';

module.exports.usage = function(args) {
    var opts = 
        optimist( args )
        .options( 'h', {
            alias : 'help',
            describe : 'options for server-info command'
        })
        .usage(
            'show details on one server \n' +
            'Usage: $0 [OPTIONS] server-info [OPTIONS]'
        );
    return opts
}

module.exports.run = function( cluster, options ) {
    var req = _.extend( {}, cluster );
    restc.nodes(
        req, options,
        function(res, data) {
            var json = JSON.parse(data)
            var name = 'eshell' + process.hrtime()[0] + '@127.0.0.1';
            console.log('connecting to %s as %s ...\n', json['otpNode'], name);
            var esh = cp.spawn(
                'erl',
                [ '-name', name, '-setcookie', json['otpCookie'],
                  '-hidden','-remsh',json['otpNode'] ],
                { stdio: 'inherit' }
            );
            esh.on( 'close', function(code, signal) {
                console.log('Exiting erlang shell')
            })
        },
        'self'
    );
}

