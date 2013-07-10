"Methods for contacting to a HTTP server, "
"sending REST commands and processing the JSON response"

var http = require('http');
var qs = require('querystring');
var _ = require('underscore');
var h = require('./h');

// `req` should contain,
//
//  host,
//      A domain name or IP address of the server to issue the request to.
//      Defaults to 'localhost'.
//  hostname,
//      To support url.parse() hostname is preferred over host
//  port,
//      Port of remote server. Defaults to 80.
//  localAddress,
//      Local interface to bind for network connections.
//  socketPath,
//      Unix Domain Socket (use one of host:port or socketPath)
//  method,
//      A string specifying the HTTP request method. Defaults to 'GET'.
//  path,
//      Request path. Defaults to '/'. can include query string if `query`
//      property is present in the options.  E.G. '/index.html?page=12'.
//  params,
//      property of parameters which will encoded as query-string and sent as
//      data for POST method.
//  query,
//      property of query parameters which will encoded as query-string and
//      included in `path` for GET method.
//  headers,
//      An object containing request headers.
//  data,
//      request data to be sent.
//  auth,
//      Basic authentication i.e. 'user:password' to compute an Authorization
//      header.
module.exports.request = function(req, options, callback) {
    var method = req.method;
    // Query and parameters;
    if( method === 'POST' && _.isEmpty(req.params) === false ) {
        req.data = qs.stringify( req.params );
        req.headers['content-type'] = 'application/x-www-form-urlencoded';
    } else if( method === 'DELETE' && _isEmpty(req.params) === false ) {
        req.data = qs.stringify( req.params );
        req.headers['content-type'] = 'application/x-www-form-urlencoded';
    } else if( req.query ) {
        req.path = path + '?' + qs.stringify( req.query );
    }
    var req = http.request(req, function(res) {
        var st = res.statusCode;
        if( st === 401 ) {
            throw 'please check your username (-u) and password (-p)'
        }
        if(! st in [200, 201, 202, 204, 302] ) {
            //log( 'ERROR: %s (%d) %s',
            //      opts['error_msg'], st, http.STATUS_CODES[st] )
        };
        res.on( 'data', function(chunk) {
            callback ? callback(res, chunk) : null;
        });
    })
    req.on('error', function(e) {
        options.log('Problem with request : ' + e.message);
    });
    if( req.data ) req.write( data );
    req.end();
    return req;
};

module.exports.get = function( req, options, callback ) {
    req.method = 'GET';
    module.exports.request(req, options, callback);
};
module.exports.put = function( req, options, callback ) {
    req.method = 'PUT';
    module.exports.request(req, options, callback);
};
module.exports.post = function( options, callback ) {
    req.method = 'POST';
    module.exports.request(req, options, callback);
};
module.exports.del = function( options, callback ) {
    req.method = 'DELETE';
    module.exports.request(req, options, callback);
};

module.exports.postmany = function( reqs, options, onPost, endPost ) {
    var count = reqs.length;
    var st = true;
    var localOnPost = function(res, data) {
        // TODO : check result ??? and update st ?
        count--;
        onPost ? onPost(res, data) : null;
        if( count <= 0 ) endPost ? endPost(st) : null;
    }
    _.map( reqs, function(option) {module.exports.post(options, localOnPost);})
}

// TODO: should this API accept the `bucket` argument ? Check with the REST
// manual.
module.exports.pools = function( req, options, callback, bucket ) {
    bucket = bucket || 'default';
    req.path = bucket ? '/pools/' + bucket : '/pools';
    if( req.method == 'GET' ) {
        module.exports.get(req, options, callback);
    } else if ( req.method == 'POST' ) {
        module.exports.post(req, options, callback);
    } else {
        module.exports.get(req, options, callback);
    }
};

// TODO: should this API accept the `node` argument ? Check with the REST
// manual.
module.exports.nodes = function( req, options, callback, node ) {
    req.path = node ? '/nodes/' + node : '/nodes';
    module.exports.get(req, options, callback);
};

module.exports.addNode = function( req, options, callback ) {
    req.path = '/controller/addNode',
    module.exports.post(
        req, options,
        function(res, data) {  callback ? callback(res, data) : null; }
    );
}

module.exports.readdNode = function( req, options, callback ) {
    req.path = '/controller/reAddNode',
    module.exports.post(
        req, options,
        function(res, data) {  callback ? callback(res, data) : null; }
    );
}

module.exports.failOver = function( req, options, callback ) {
    req.path = '/controller/failOver',
    module.exports.post(
        req, options,
        function(res, data) {  callback ? callback(res, data) : null; }
    );
}

module.exports.clusterInit = function( req, options, callback ) {
    req.path = '/settings/web',
    module.exports.post(
        req, options,
        function(res, data) {  callback ? callback(res, data) : null; }
    );
}

module.exports.nodeInit = function( req, options, callback ) {
    req.path = '/nodes/self/controller/settings',
    module.exports.post(
        req, options,
        function(res, data) {  callback ? callback(res, data) : null; }
    );
}

module.exports.setCompaction = function( req, options, callback ) {
    req.path = '/controller/setAutoCompaction';
    module.exports.post(
        req, options,
        function(res, data) {  callback ? callback(res, data) : null; }
    );
}

module.exports.setNotification = function( req, options, callback ) {
    req.path = '/settings/stats';
    module.exports.post(
        req, options,
        function(res, data) {  callback ? callback(res, data) : null; }
    );
}

module.exports.setAutoFailover = function( req, options, callback ) {
    req.path = '/settings/autoFailover';
    module.exports.post(
        req, options,
        function(res, data) {  callback ? callback(res, data) : null; }
    );
}

module.exports.setAlert = function( req, options, callback ) {
    req.path = '/settings/alert';
    module.exports.post(
        req, options,
        function(res, data) {  callback ? callback(res, data) : null; }
    );
}

module.exports.rebalance = function( req, options, callback ) {
    var WAIT_FOR = 100; // milli-seconds;
    var stReq = _.extend({}, req, {param : {}});
    var stloop = _.partial( 
            module.exports.rebalanceStatus, [stReq, options, isRunning] )
    var isRunning = function(st) {
        if( st === 'running' && options.timeout > 0 ) {
            options.log('.');
            options.timeout -= WAIT_FOR;
            setTimeout( stloop, WAIT_FOR );
        } else {
            callback ? callback(st) : null;
        }
    }
    module.exports.post(
        options,
        function(res, data) { options.log("Rebalance started ..."); stloop(); }
    );
}

module.exports.rebalanceStatus = function( req, options, callback ) {
    req.path = '/pools/default/rebalanceProgress',
    module.exports.get(
        req, options,
        function(res, data) {
            callback ? callback( JSON.parse(data)['status'] ) : null;
        }
    );
}

module.exports.rebalanceStop = function( req, options, callback ) {
    req.path = '/controller/stopRebalance';
    module.exports.post(
        req, options,
        function(res, data) { callback ? callback(res, data) : null; }
    );
}


module.exports.getNodes = function( req, options, callback ) {
    module.exports.pools(
        req,
        options,
        function(res, data) { // TODO : check for response status
            nodes = JSON.parse(data)['nodes'];
            _.map( nodes, h.isOtpNode ); // Check for credentials
            callback ? callback(nodes) : null;
        },
        'default'
    );
}

module.exports.readdNodes = function( cluster, addnodes, callback ) {
    var filterFn = function(node) {
        return _.contains(addnodes, node['hostname'])
    };
    var postOptsFn = function(node) {
        var postOpts = _.extend({}, cluster);
        postOpts.path = '/controller/reAddNode';
        return _.extend( postOpts, {params : {otpNode : node['otpNode']}} )
    }
    var endPost = function(st) { callback ? callback(st) : null; };

    module.exports.getNodes(
        _.extend({}, cluster),  // options
        function(known_nodes) {
            var nodes = _.filter(known_nodes, filterFn);
            _.map( nodes, h.isOtpNode );    // Check for credentials
            module.exports.postmany( _.map(nodes, postOptsFn), null, endPost );
        }
    );
};

module.exports.failOverNodes = function( cluster, fonodes, callback ) {
    var filterFn = function(node) {
        return _.contains(fonodes, node['hostname'])
    };
    var postOptsFn = function(node) {
        var postOpts = _.extend({}, cluster);
        postOpts.path = '/controller/failOver';
        return _.extend( postOpts, {params : {otpNode : node['otpNode']}} )
    }
    var endPost = function(st) { callback ? callback(st) : null; };

    module.exports.getNodes(
        _.extend({}, cluster),  // options
        function(nodes) {
            nodes = _.filter(nodes, filterFn);
            _.map( nodes, h.isOtpNode );    // Check for credentials
            module.exports.postmany( _.map(nodes, postOptsFn), null, endPost );
        }
    );
};


// Test this module from command-line
if( require.main === module ) {
    options = {
        hostname : 'localhost',
        port : '8091',
        auth : 'Administrator:password'
    };
    module.exports.pools(options, function(res, data) {
        var json = JSON.parse( data );
        console.log(json);
    });
}
