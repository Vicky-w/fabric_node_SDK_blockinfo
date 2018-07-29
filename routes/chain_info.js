/**
 * Created by vickywang on 6/25/18
 */
'use strict';
var initHandler = require('./init');
var logger = require('log4js').getLogger("Query - ChainInfo");

var query_block = function (req, res) {
    var is_error = false;
    var response = {};
    var target = {};
    var data = {};
    var peers;
    var userConfig = initHandler.userConfig
    var channel = initHandler.channel;
    var config_target_peer = initHandler.config_target_peer
    Promise.resolve().then(() => {
        peers = channel.getPeers();
        peers.forEach(function (value, index, array) {
            if (value._name == userConfig[config_target_peer].peerName) {
                target = value
            }
        });
        return channel.queryInfo(target);
    }).then((results) => {
        logger.info(JSON.stringify(results));
        data.height = results.height;
        data.currentBlockHash = results.currentBlockHash.toString("hex");
        data.previousBlockHash = results.previousBlockHash.toString("hex");
        response.data = data;
        res.end(JSON.stringify(response));
        return
    }, (err) => {
        logger.error('Query - ChainInfo Error: ' + err.stack ? err.stack : err);
        response.status = 'Query - ChainInfo Error: ' + err.stack ? err.stack : err;
        response.sdkCode = "301"
        is_error = true;
        res.end(response);
        return
    });

}

module.exports = query_block;