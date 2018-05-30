var mongodbHelper = require("./mongo-db-helper");
var config = require("./config");
function InitApiRoute(serverNode) {
    console.log("api route init == > /api/getSignals")
    serverNode.post("/api/getSignals", function (request, response) {
        console.log("api call == > /api/getSignals")
        mongodbHelper.mongodb.select(config.mongodbUrl,"SignalsLog","*","*",function(data){
            response.send(data);
        },function(err){
            console.log(err);
            response.send(null);
        })
    })
}

module.exports = {
    InitApiRoute: InitApiRoute
}