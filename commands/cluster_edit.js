var optimist = require('optimist');
var restc = require('../restc');
var _ = require('underscore');

module.exports.command = 'cluster-edit';

module.exports.usage = function(args) {
    var opts = 
        optimist( args )
        .options( 'cluster-ramsize', {
            describe : 'RAMSIZE in MB, per node ram quota'
        })
        .options( 'h', {
            alias : 'help',
            describe : 'options for server-list command'
        })
        .usage(
            'edit cluster settings \n' +
            'Usage: $0 [OPTIONS] cluster-edit [OPTIONS]'
        );
    return opts
}

module.exports.run = function( cluster, options ) {
    var req = _.extend( {}, cluster )
    req.params.memoryQuota = options['cluster-ramsize'];
    req.method = 'POST';
    restc.pools( req, options, function(res, data) {}, 'default' )
}



