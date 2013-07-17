var _ = require('underscore');
var repl = require('./repl');

var readline = require('readline');
var events = require('events');
var colors = require('colors');
var context = {};

colors.setTheme({
  silly: 'rainbow',
  input: 'grey',
  verbose: 'cyan',
  prompt: 'grey',
  info: 'green',
  data: 'grey',
  help: 'cyan',
  warn: 'yellow',
  debug: 'blue',
  error: 'red'
});

repl.channel.addListener(
    'prompt',
    function( name, value ) {
        if( name ) { context[name] = value; }
        update();
    }
)

module.exports.prompt = function(name, value) {
    (name && value)
        ? channel.emit( 'prompt', name, value )
        : channel.emit( 'prompt' );
    repl.rl.prompt(true);
}


function update() {
    var s = '';
    s += context['server'] || 'couch';
    repl.rl.setPrompt(s.grey + '> ', s.length + 2);
}

