var optimist = require('optimist');
var util = require('util');
var restc = require('../restc');
var h = require('../h');

module.exports.command = 'pools';

module.exports.usage = function(args) {
    var opts = 
        optimist( args )
        .usage(
            'Couchbase cluster \n' +
            'Usage: /pools'
        );
    return opts
}

module.exports.run = function( options, callback ) {
    gocmd(options, callback);
}
module.exports.repl = function( options, line, callback ) {
    gocmd(options, callback);
}

function gocmd( options, callback ) {
    restc.pools(
        h.make_request(options), options,
        function(json) {
            console.log( util.inspect(json, {colors : true}) );
            callback ? callback(true) : null;
        }
    );
}
