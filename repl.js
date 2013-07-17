var readline = require('readline');
var events = require('events');
var util = require('util');
var _ = require('underscore');
var h = require('./h');
var restc = require('./restc');

module.exports.channel = new events.EventEmitter();
module.exports.rl = undefined;
module.exports.servers = {};

channel = module.exports.channel;   // REPL global, event-channel
servers = module.exports.servers;   // REPL global, connected servers
replcx  = {                         // REPL global, context
    'server' : null,        // connected server
    'cmods'  : {},          // property of command and command modules
    'completors'  : {},     // property of completors and completor modules
    'options' : {}          // various options
}

channel.matches = [];
channel.currmatch = null;
channel.tabline = null;

module.exports.loop = function( sopts ) {
    var argv = replcx['options'] = sopts.argv;
    module.exports.rl = _rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        completer: repl_completer
    });
    _rl.on( 'line', repl_online );
    _rl.on( 'close', repl_onclose );
    _rl.on( 'SIGINT', repl_onsigint );

    // load tab-completers
    replcx['completors'] = h.load_completors();
    _u.each(
        replcx['completors'],
        function(m) { channel.addListener( 'complete', m.lookup  ); }
    );

    if(argv.c) {
        servers[ argv.c ] = h.connection(argv.c, argv.u, argv.p);
        var req = h.make_request( servers[argv.c] );
        var options = h.newOptions( req );
        restc.request(
            req, options, 
            function(res, data) {
                console.log('connected to ' + h.hostp(req) + '...');
                replcx[ 'server' ] = servers[argv.c];
                prompt( 'server', argv.c );
            }
        ).on( 'error', function(e) { prompt() } );
    } else {
        prompt('server', argv.c);
    }
}

function repl_online(line) {
    //try { 
        if( line[0] == '/' ) {
            var command = _s.splice( line.split(' ', 1)[0], 0, 1 );
            var cmod = replcx['cmods'][ command ];
            if(! cmod ){ throw "Error: Illegal command".error }
            cmod.repl(
                replcx['server'], line, function(st) { prompt(); }
            )
        } else {
            console.log( eval(line) );
            prompt();
        }
    //} catch (e) { 
    //    console.log( util.format( '%s: %s', e.name, e.msg ));
    //}
}

function repl_onsigint() {
    if( _rl.line ) {
        _rl.write(null, {ctrl: true, name: 'u'});
    } else {
        _rl.close();
    }
}

function repl_onclose() {
    _rl.close();
    console.log('');
}


function repl_completer(line) {
    var matches = [];
    var check_input = function(data) {
        if( data[0] !== 9) {
            channel.currmatch = channel.tabline = null;
            channel.matches = [];
            _rl.input.removeListener('data', check_input);
        }
    }
    if( channel.currmatch == null ) {    // show matches
        var completes = [];
        channel.emit( 'complete', line );
        _rl.input.on( 'data', check_input );
        for(var i =0; i < channel.matches.length; i++) {
            var words = channel.matches[i][0];
            var partials = channel.matches[i][1];  // matches
            matches.push(words); 
            matches.push(['\n']); 
            completes.push( partials );
        }
        matches = _.flatten( matches, true );
        channel.matches = _.flatten( completes, true );
        channel.tabline = _rl.line;
        channel.currmatch = 0;
        if( channel.matches.length === 1 ) {
            _rl.write( channel.matches[channel.currmatch] );
        }
    } else {    // Double tabs !
        if( channel.matches[ channel.currmatch ] === undefined ) {
            channel.currmatch = 0;
        }
        _rl.write( null, {ctrl: true, name: 'u'} );
        _rl.write( channel.tabline );
        _rl.write( channel.matches[channel.currmatch] );
        channel.currmatch++;
    }
    return [matches, line]
}

var prompt = require('./prompt').prompt;   // load prompt module, only after repl.
