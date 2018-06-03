//Test Class by Mocha over NodeJS
//caller CMD :  npm test
describe('Test Class : ' + require('path').basename(__filename), function () {
    //Test Get Signals
    it('Test method : Get Signals', function (done) {
        var mongodbHelper = require("../server-node/mongo-db-helper");
        var config = require("../server-node/config");
        mongodbHelper.mongodb.select(config.mongodbUrl, "SignalsLog", "*", "*", function (data) {
            console.log("Data count : " + data.length);
            console.log(data[0]);
            return done();
        }, function (err) {
            console.log(err);
            return done();
        })
    });
    //Test Get Signals
    it('Test method : Push Signals', function (done) {
        var signalsGenerator = require("../server-node/signals-generator");
        var mongodbHelper = require("../server-node/mongo-db-helper");
        var config = require("../server-node/config");
        mongodbHelper.mongodb.select(config.mongodbUrl, "SignalsLog", "*", "*", function (firstCallData) {
            console.log("data Count before Start : " + firstCallData.length);
            signalsGenerator.start();
            setTimeout(function () {
                mongodbHelper.mongodb.select(config.mongodbUrl, "SignalsLog", "*", "*", function (SecondCallData) {
                    signalsGenerator.terminate();
                    console.log("data Count after Start : " + SecondCallData.length);
                    if (SecondCallData.length > firstCallData.length) {
                        console.log("New Data Generated Count : " + parseInt(SecondCallData.length - firstCallData.length));
                        return done();
                    } else {
                        throw "Error in generation"
                    }
                }, function (err) {
                    console.log(err);
                    return done();
                })
            }, 15000);
        }, function (err) {
            console.log(err);
            return done();
        })
    });
});