var optimist = require('optimist');
var restc = require('../restc');
var _ = require('underscore');

module.exports.command = 'setting-notification';

module.exports.usage = function(args) {
    var opts = 
        optimist( args )
        .options( 'enable-notification', {
            default : undefined,
            describe : 'enable or disable notification'
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
    var req = _.extend( {}, cluster );
    if( options['enable-notification'] ) {
        req.params = { sendStats : options['enable-notification'] }
    }
    restc.setNotification( req, options, function(res, data) {} );
}
