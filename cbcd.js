// command-line cluster administration tool

//import getopt
//import sys

//import buckets
//import node
//import xdcr
//import info
//import util_cli as util
//from usage import usage, short_usage
//from timeout import TimeoutException

var _ = require('underscore');
var usage = require('./usage');
var h = require('./h');

function main() {
    var cmods = h.commands();
    var cmdnames = _.pluck(cmods, 'command');

    // parse command-line into script-args, command-name and
    // command-arguments.
    var scriptargs = [];
    var command = undefined;
    var cmdargs = [];
    for( var i=2; i< process.argv.length; i++ ) {
        var arg = process.argv[i];
        if( command != undefined ) {
            cmdargs = cmdargs.concat( [arg] );
        } else if ( _.contains(cmdnames, arg) ) {
            command = arg;
        } else {
            scriptargs = scriptargs.concat( [arg] );
        }
    }

    var sopts = usage.script( scriptargs );
    var cmod  = cmods[command];
    var cluster = _.extend( {}, h.hostport(sopts.argv.c) )
    cluster.user = sopts.argv.u;
    cluster.password = sopts.argv.p;
    cluster.auth = cluster.user + ':' + cluster.password;

    if( cmod != undefined ) {
        copts = cmod.usage( cmdargs );
        if( copts.argv.h ) {
            console.log( copts.help() );
            process.exit(0);
        } else {
            var options = h.newOptions( cluster, copts.argv ); 
            cmod.run( cluster, options )
        }
    } else if ( command != undefined ) {
        console.log("Invalid command !");
        console.log( sopts.help() );
        process.exit(2);
    } else {
        if( sopts.argv.h ) {
            console.log( sopts.help() );
            process.exit(0);
        }
    }
}

if( require.main === module ) main();
