/**
 * Created by vickywang on 6/25/18
 */
'use strict';
var initHandler = require('./init');
var logger = require('log4js').getLogger("Query - ChannelPeers");


var channel_peers = function (req, res) {
    var response = {};
    var channel = initHandler.channel;
    Promise.resolve().then(() => {
        return channel.getPeers();
    }).then((results) => {
        console.log(JSON.stringify(results));
        response.data = results;
        res.end(JSON.stringify(response));
        return
    }, (err) => {
        logger.error('Query - ChannelPeers  Error: ' + err.stack ? err.stack : err);
        response.status = 'Query - ChannelPeers  Error: ' + err.stack ? err.stack : err;
        response.sdkCode = "301"
        res.end(response);
        return
    });

}

module.exports = channel_peers;