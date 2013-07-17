var optimist = require('optimist');
var util = require('util');
var restc = require('../restc');
var h = require('../h');

module.exports.command = 'versions';

module.exports.usage = function(args) {
    var opts = 
        optimist( args )
        .usage(
            'Couchbase server version and version of its components\n' +
            'Usage: /versions'
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
    restc.versions(
        h.make_request(options), options,
        function(json) {
            global['_'] = json;
            console.log( util.inspect(json, {colors : true}) );
            callback ? callback(true) : null;
        }
    );
}
