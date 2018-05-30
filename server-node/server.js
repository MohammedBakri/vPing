//#region Declarations
var express = require('express');
var http = require('http');
var https = require('https');
var fs = require('fs');
var bodyParser = require('body-parser');
var compression = require('compression');
//Logger
var logger = require('morgan');
var moment = require("moment");
var path = require("path");
//#endregion

//configs
var configs = require('./config');
var allowCoreLogging = true;
var httpPort = configs.nodeServer.http;
var httpsPort = configs.nodeServer.https;
var hostWebServerName = configs.nodeServer.hostName;

//#region Certificate For Https
var sslOptions = {
    key: fs.readFileSync('certificates/54158036-localhost.key'),
    cert: fs.readFileSync('certificates/54158036-localhost.cert')
};
//#endregion

// NodeJS App Server [ROOT] 
var ServerBackendNode = express();

//#region middlewares
// Monitor Server Status //http://<hostName>:<port>/status
ServerBackendNode.use(require('express-status-monitor')());
//body/json parser
ServerBackendNode.use(bodyParser.json()); // used to parse JSON object given in the request body
//Gzip compressing can greatly decrease the size of the response body and hence increase the speed of a web app
ServerBackendNode.use(compression());

//morgan - Express logger
if (allowCoreLogging) {
    console.log('Logging Enabled');
    ServerBackendNode.use(logger('combined', {
        skip: function (req, res) {
            return res.statusCode > 0
        }
    }));

    ServerBackendNode.use(logger(function (tokens, req, res) {
        return [
            '# ' + moment().format('DD MM YYYY, h:mm:ss a'), '- ',
            tokens.method(req, res),
            ' =>',
            tokens.url(req, res), (' '),
            tokens["remote-addr"](req, res),
            ' (status = ',
            tokens.status(req, res),
            ') ',
            tokens.res(req, res, 'content-length'), ' - ',
            tokens['response-time'](req, res), ' ms'
        ].join('') + "\n"
    }));
} else {
    console.log('Logging Disabled');
}
//#endregion

//#region 
// Http and https listener / SERVER Intialization
http.createServer(ServerBackendNode).listen(httpPort, hostWebServerName);
https.createServer(sslOptions, ServerBackendNode).listen(httpsPort, hostWebServerName);
console.log("App Working on : development-nodejs-server - Protocols : HTTP port(" + httpPort + ") - HTTPS port(" + httpsPort + ")");
console.log("Process Id : " + process.pid);
//#endregion

// uncaughtException Logger
process.on('uncaughtException', function (error) {
    console.log(error.stack);
});

// StartEngine
require("./signals-generator").start();
// initialize API Route
require("./get-signals-api").InitApiRoute(ServerBackendNode);
// define static Routes
ServerBackendNode.use("/ClientScripts", express.static(path.join(__dirname, "../node_modules")));
ServerBackendNode.use("/client-app", express.static(path.join(__dirname, "../client-app")));
ServerBackendNode.use("/dashboard", express.static(path.join(__dirname, "../client-app/tracker.html")));
