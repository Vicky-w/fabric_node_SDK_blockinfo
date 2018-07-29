var createError = require('http-errors');
var express = require('express');
var initHandler = require('./routes/init');
var queryBlockRouter = require('./routes/query_block');
var chainInfoRouter = require('./routes/chain_info');
var channelPeersRouter = require('./routes/channel_peers');
var app = express();
var log4js = require('log4js');
var log = log4js.getLogger("app");
app.use(log4js.connectLogger(log4js.getLogger("http"), {level: 'auto'}));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.all('*', function (req, res, next) {
    console.log("req==============  " + req.method);
    req.header("Content-Type", "application/json")
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method == 'OPTIONS') {
        res.send(200);
    } else {
        next();
    }
});
app.use("*", function(request, response, next) {
    response.writeHead(200, { "Content-Type": "application/json;charset=utf-8" });
    next();
});
app.post('/blockByNumber', queryBlockRouter);
app.post('/chainInfo', chainInfoRouter);
app.post('/channelPeers', channelPeersRouter);
app.use(function (req, res, next) {
    next(createError(404));
});
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        log.error("Something went wrong:", err);
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}
app.use(function (err, req, res, next) {
    log.error("Something went wrong:", err);
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});
process.on('uncaughtException', function (err) {
    log.error('Caught exception: ', err);
});
module.exports = app;
