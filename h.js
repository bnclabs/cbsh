var _ = require('underscore');
var _s = require('underscore.string');
var util = require('util');
var fs = require('fs');
var path = require('path');

module.exports.hostport = function( hoststring, default_port ) {
    var x, host, port;
    try {
        x = hoststring.split(':');
        host = x[0];
        port = Number(x[1]);
    } catch(e) {
        host = hoststring;
        port = default_port || 8091;
    }
    return {hostname:host, port:port}
}

var CMDDIR = path.join( __dirname, 'commands' );
module.exports.commands = function() {
    var files = fs.readdirSync( CMDDIR );
    var cmods = {};
    _.each(
        files,
        function(f) {
            if( _s.endsWith(f, '.js') ) {
                var mod = require( path.join( CMDDIR, f ));
                this[mod.command] = mod;
            }
        },
        cmods
    );
    return cmods;
}

module.exports.type = function(o) {
    return Object.prototype.toString(o)
}

module.exports.isOtpNode = function(n) {
    var val = n['otpNode'];
    var name = n['hostname'];
    if( val === undefined || val === null) {
        throw 'Could not access node ' + name + ', please check credentials'
    }
}

module.exports.isNodeActive = function(n) {
    var val = n['clusterMembership'];
    var name = n['hostname'];

    if( val !== 'active' ) {
        throw 'node ' + name + 'is not active'
    }
}

module.exports.newOptions = function() {
    return new Options( arguments );
}

function Options( args ) {
    var defaults = {
        mode : 'cli',
        hostname : 'localhost',
        port : 8091,
    };
    _.extend(this, defaults);
    for(var i=0; i < args.length; i++ ) _.extend( this, args[i] );
    this.log = function( msg ) {
        switch( this.mode ) {
            case 'cli' :
                util.print(msg);
            default :
                util.print(msg);
        }
    }
}

