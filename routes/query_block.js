/**
 * Created by vickywang on 6/25/18
 */

'use strict';

var initHandler = require('./init');
var logger = require('log4js').getLogger("Query - Block");

var query_block = function (req, res) {
    var response = {};
    var targets = [];
    var peers;
    var userConfig = initHandler.userConfig
    var channel = initHandler.channel;
    var config_target_peer = initHandler.config_target_peer
    var blockNumber = req.body.blockNumber;
    Promise.resolve().then(() => {
        peers = channel.getPeers();
        peers.forEach(function (value, index, array) {
            if (value._name == userConfig[config_target_peer].peerName) {
                targets.push(value)
            }
        });
        return channel.queryBlock(blockNumber);
    }).then((results) => {
        logger.info(JSON.stringify(results));
        response.previousHash = results.header.previous_hash;
        response.dataHash = results.header.data_hash;
        response.blockNum = results.header.number;
        response.txNum = results.data.data.legnth;
        let txData = [];

        for (var i = 0; i < results.data.data.length; i++) {
            let txDetail = {};
            const tmpData = results.data.data[i].payload.data.actions[0].payload.action.proposal_response_payload.extension;
            if (tmpData.response.payload.indexOf("MSP") == -1 && JSON.parse(tmpData.response.payload).code == 200) {
                txDetail.txId = results.data.data[i].payload.header.channel_header.tx_id;
                txDetail.timestamp = new Date(results.data.data[i].payload.header.channel_header.timestamp).getTime();
                for (var j = 0; j < tmpData.results.ns_rwset.length; j++) {
                    if (tmpData.results.ns_rwset[j].namespace != "lscc") {
                        txDetail.keyData = tmpData.results.ns_rwset[0].rwset.writes;
                        txData.push(txDetail);
                    }
                }

            }
        }
        if (txData.length != 0) {
            response.sdkCode = 200;
        } else {
            response.sdkCode = 300;
        }
        response.txData = txData;
        res.end(JSON.stringify(response));
        return
    }, (err) => {
        response.status = "Query - Block  Error" + err.stack ? err.stack : err;
        response.sdkCode = 301
        logger.error("Query - Block  Error" + err.stack ? err.stack : err)
        res.end(JSON.stringify(response));
        return
    });
}

module.exports = query_block;