var optimist = require('optimist');
var restc = require('../restc');
var _ = require('underscore');

module.exports.command = 'setting-compaction';

module.exports.usage = function(args) {
    var opts = 
        optimist( args )
        .options( 'db-percentage', {
            default : undefined,
            describe : 'PERCENTAGE at which point db compaction is triggered'
        })
        .options( 'db-size', {
            default : undefined,
            describe : 'MB at which point db compaction is triggered'
        })
        .options( 'view-percentage', {
            default : undefined,
            describe : 'PERCENTAGE at which point view compaction is triggered'
        })
        .options( 'view-size', {
            default : undefined,
            describe : 'MB at which point view compaction is triggered'
        })
        .options( 'period-from', {
            default : undefined,
            describe : 'allow compaction time period from'
        })
        .options( 'period-to', {
            default : undefined,
            describe : 'allow compaction time period to'
        })
        .options( 'abort', {
            default : undefined,
            describe : '0|1 to allow compaction abort when time expires'
        })
        .options( 'parallel', {
            default : undefined,
            describe : '0|1 to allow parallel compaction for database and view'
        })
        .options( 'h', {
            alias : 'help',
            describe : 'options for server-list command'
        })
        .usage(
            'set auto compaction settings\n' +
            'Usage: $0 [OPTIONS] setting-compaction [OPTIONS]'
        );
    return opts
}

module.exports.run = function( cluster, options ) {
    var req = _.extend( {}, cluster )
    req.params = {};
    if( options['db-percentage'] ) {
        req.params['databaseFragmentationThreshold[percentage]'] =
                                                    options['db-percentage'];
    }
    if( options['db-size'] ) {
        var size = Number(options['db-size']) * 1024 * 1024;
        req.params['databaseFragmentationThreshold[size]'] = size;
    }
    if( options['view-percentage'] ) {
        req.params['viewFragmentationThreshold[percentage]'] =
                                                    options['view-percentage'];
    }
    if( options['view-size'] ) {
        var size = Number(options['view-size']) * 1024 * 1024;
        req.params['viewFragmentationThreshold[size]'] = size;
    }
    if( options['period-from'] ) {
        dt = checkPeriod( options['period-from'] );
        req.params['allowedTimePeriod[fromHour]'] = dt[0];
        req.params['allowedTimePeriod[fromMinute]'] = dt[1];
    }
    if( options['period-to'] ) {
        dt = checkPeriod( options['period-to'] );
        req.params['allowedTimePeriod[toHour]'] = dt[0];
        req.params['allowedTimePeriod[toMinute]'] = dt[1];
    }
    if( options['abort'] ) {
        req.params['allowedTimePeriod[abortOutside]'] = options['abort'];
    }
    if( options['parallel'] ) {
        req.params['parallelDBAndViewCompaction'] = options['parallel'];
    }
    restc.setCompaction( req, options, function(res, data) {} );
}

function checkPeriod( s ) {
    t = s.split(':', 2);
    hour = Number(t[0]);
    min = Number(t[1]);
    if(hour < 0 && hour >= 24) throw "ERROR: specify a valid hour"
    if(min < 0 && min >= 60) throw "ERROR: specify a valid minute"
    return [hour, min];
}
