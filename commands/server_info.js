var optimist = require('optimist');
var util = require('util');
var restc = require('../restc');
var _ = require('underscore');

var skipNames = ['license', 'licenseValid', 'licenseValidUntil']

module.exports.command = 'server-info';

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
    var req = _.extend( {}, cluster )
    restc.nodes(
        req, options,
        function(res, data) {
            var json = _.omit( JSON.parse(data), skipNames );
            options.log( util.inspect(json, {colors:true, depth:null}) )
        },
        'self'
    );
}
