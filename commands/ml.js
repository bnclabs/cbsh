var optimist = require('optimist');
var util = require('util');
var path = require('path');
var h = require('../h');

module.exports.command = 'ml';

module.exports.usage = function(args) {
    var opts =
        optimist( args )
        .options( 'h', {
            alias : 'help',
            describe : 'options for module loading'
        })
        .usage(
            'load module into the environment, modules are always reloaded\n' +
            'loaded modules can be binded to a name \n' +
            'Usage: /ml [OPTIONS] <relative-path-to-module-file> [as <name>]'
        );
    return opts
}

module.exports.run = function( conn, options ) {
    throw "Cannot execute as sub-command".error
}

module.exports.repl = function( server, line ) {
    var opts = this.usage( h.parsecmd( line ));
    if( opts.argv.h ) {
        console.log( opts.help() );
    } else if ( opts.argv._[1] !== undefined ) {
        var s = path.join( process.cwd(), opts.argv._[1] ) ;
        delete require.cache[s];
        if( opts.argv._[2] === 'as'  &&  opts.argv._[3] !== undefined ) {
            s = util.format("%s = require('%s')", opts.argv._[3], s );
        } else {
            s = util.format("require('%s')", s );
        }
        eval( s )
    }
}
