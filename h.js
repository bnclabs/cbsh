var _u = require('underscore');         // library of language functions
var _s = require('underscore.string');  // library of string functions
var util = require('util');     // library of node utility functions
var fs = require('fs');         // file-system APIs
var path = require('path');     // library of functions to manipulate path

// Create a connection object based on host, port, user and password. Each
// connection is meant for couchbase-server node. If default_port is not
// passed, it will be assumed as 8091.
module.exports.connection = function( hoststring, user, passw, default_port ) {
    var host, port;
    var x = hoststring.split(':');
    try {
        host = x[0];
        port = Number(x[1]);
    } catch(e) {
        host = hoststring;
    }
    port = port || 8091;
    return {
        hostname:host, port:port, user: user, password: passw,
        auth: user + ':' + passw
    }
}

module.exports.hostp = function( obj ) {
    return obj.hostname + ':' + obj.port;
}

module.exports.parsecmd = function( line ) {
    var argv = _u.filter( 
            line.split(' '),
            function(x) { return Boolean( _s.strip(x) ) }
    );
    if( argv !== [] ) {
        argv[0] = argv[0][0] == '/' ? _s.splice( argv[0], 0, 1 ) : argv[0];
    }
    return argv;
}

module.exports.make_request = function( options ) {
    return _u.pick( options, 'hostname', 'port', 'auth' );
}

module.exports.boolof = function( obj ) {
    return Boolean(obj);
}

module.exports.strcmp = function( stra, strb, count ) {
    if( count ) {
        return _s.splice(stra, count, stra.length) === 
               _s.splice(strb, count, strb.length);
    } else {
        return stra === strb;
    }
}

// 2-dimensional listing of array of strings based on maximum width of each
// string.
module.exports.list2d = function( ls ) {
    var fmt = '%-' + _u.max( _u.map( ls, _u.size )) + 2 + 's';
    var fn = function( memo, value, key ) {
        line = (memo.length + value.length + 2) < 80
                    ?  _u.last( memo ) + _s.sprintf( fmt, value )
                    : _s.sprintf( fmt, value );
        memo[ memo.length-1 ] = line;
        return memo;
    }
    return _u.reduce( ls, fn, [''] ); // return list of lines
}

module.exports.load_commands = function() {
    var modules = load_modules( path.join( __dirname, 'commands' ));
    return _u.object( _u.map( modules, function(m) { return [m.command,m] } ));
}

module.exports.load_completors = function() {
    var modules = load_modules( path.join( __dirname, 'completors' ));
    return _u.object( _u.map( modules, function(c) { return [c.name, c] } ));
}

module.exports.completes = function( prefix, ls ) {
    var words = _u.filter( ls, function(s) {return _s.startsWith(s, prefix)} );
    var len = prefix.length;
    var partials = 
            _u.map( words, function(w) { return _s.splice(w, 0, len) } );
    return { words:words, partials:partials };
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
    _u.extend(this, defaults);
    for(var i=0; i < args.length; i++ ) _u.extend( this, args[i] );
    this.log = function( msg ) {
        switch( this.mode ) {
            case 'cli' :
                console.log( util.format.apply(this, arguments) );
                break;
            default :
                util.print(msg);
        }
    }
}

function load_modules( dir ) {
    var files = _u.map(
        fs.readdirSync(dir),
        function(f) { return path.join( dir, f ) }
    );
    return _u.filter( _u.map( files, load_module ), module.exports.boolof )
}

function load_module( file ) {
    return _s.endsWith(file, '.js') ? require( file ) : null;
}

