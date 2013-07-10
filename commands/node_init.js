var optimist = require('optimist');
var restc = require('../restc');
var _ = require('underscore');

module.exports.command = 'node-init';

module.exports.usage = function(args) {
    var opts = 
        optimist( args )
        .options( 'data-path', {
            default=undefined,
            describe : 'PATH, per node path to store data'
        })
        .options( 'index-path', {
            default=undefined,
            describe : 'PATH, per node path to store index'
        })
        .options( 'h', {
            alias : 'help',
            describe : 'options for server-list command'
        })
        .usage(
            'set node specific parameters \n' +
            'Usage: $0 [OPTIONS] node-init [OPTIONS]'
        );
    return opts
}

module.exports.run = function( cluster, options ) {
    var req = _.extend( {}, cluster )
    req.params = {};
    if( options['data-path'] ) req.params.path = options['data-path']
    if( options['index-path'] ) req.params.index_path = options['index-path']
    restc.nodeInit( req, options, function(res, data) {} );
}
