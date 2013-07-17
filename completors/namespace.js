var _u = require('underscore');         // library of language functions
var _s = require('underscore.string');  // library of string functions
var h = require('../h');

module.exports.name = 'namespace';

module.exports.lookup = function( line ) {
    var ss = line.split(' ');
    var s = ss[ ss.length-1 ];
    var obj = global;

    if( line[0] === '/' || h.strcmp(line, './', 2)
        || h.strcmp(line, '../', 3) ) { return }

    do {
        var key = '';
        var x = /[\w\$]+/.exec( s );
        var y = /\[['"][^'"]+['"]\]/.exec( s );
        var z = /\[['"][^'"]*/.exec( s );
        if( x && x.index === 0 ) {
            key = x[0];
            s = _s.splice( s, 0, x[0].length );
            if(! obj[key] ) { break; }
            obj = obj[ key ]
        } else if ( y && y.index === 0 ) {
            key = _s.trim( y[0], '[\'"]' );
            s = _s.splice( s, 0, y[0].length );
            if(! obj[key] ) { break; }
            obj = obj[ key ]
        } else if ( z && z.index === 0 ) {
            key = _s.trim( z[0], '[\'"]' );
            s = _s.splice( s, 0, z[0].length );
            if(! obj[key] ) { break; }
            obj = obj[ key ]
        } else if ( s[0] === '.' ) {
            s = _s.splice( s, 0, 1 );
        }
    } while( s );

    if ( s === '' ) {
        x = h.completes( key, _u.keys(obj) );
        this.matches.push( [x.words, x.partials] );
    }
}
