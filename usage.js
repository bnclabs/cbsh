var _ = require('underscore')
var _s = require('underscore.string')
var optimist = require('optimist')
var h = require('./h')
var util = require('util')

var usage =
    'couchbase - command-line cluster administration tool\n' +
    'Usage: $0 [OPTIONS] COMMAND [OPTIONS]\n\n'

module.exports.script = function(args) {
    var pickDescr = function(m) {
        var descr = m.usage().help().split('\n', 1)[0];
        return _s.sprintf( '%-25s %s', m.command, descr )
    }
    var opts = 
        optimist( args ? args : process.argv.slice(2) ) 
        .options( 'h', {
            alias : 'help',
            describe : 'print this help'
        })
        .options( 'c', {
            alias : 'cluster',
            default : 'localhost:8091',
            describe : 'HOST[:PORT]'
        })
        .options( 'u', {
            alias : 'user',
            describe : 'USERNAME, admin username of the cluster',
            default : ''
        })
        .options( 'p', {
            alias : 'password',
            describe : 'PASSWORD, admin password of the cluster',
            default : ''
        })
        .options( 'd', {
            alias : 'debug',
            describe : 'run in debug mode',
            default : ''
        })
        .usage( 
            usage +
            'COMMANDS:\n  ' +
            _.map( h.load_commands(), pickDescr ).join('\n  ')
        )
    return opts
}
