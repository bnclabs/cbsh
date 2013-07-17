var _u = require('underscore');         // library of language functions
var _s = require('underscore.string');  // library of string functions
var h = require('../h');

module.exports.name = 'commands';

module.exports.lookup = function( line ) {
    if( line[0] !== '/' ) { return }
    if( line.split(' ').length > 1 ) {
        // pass on to respective commands
        return
    }
    x = h.completes( _s.splice(line, 0, 1), _u.keys( replcx['cmods'] ) );
    this.matches.push( [x.words, x.partials] );
}
