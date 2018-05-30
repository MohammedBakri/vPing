var mongodbHelper = require("./mongo-db-helper");
var config = require("./config");
var moment = require("moment");

var timer = null;

// default interval 30 sec
function StartEngine(loggingInterval = 30000) {
    console.log("<<<<<<<<----- Signals Engine Started ----->>>>>>>");
    timer = setInterval(function () {
        // select all vehicles from DB
        mongodbHelper.mongodb.select(config.mongodbUrl,"CustomersVehicles","*",{Name:1,Vehicles:1},function(results){
            // iterate on customers records
            results.forEach(CustomerVehicles => {
                setTimeout(function(){
                    // iterate on selected customer vehicles
                    CustomerVehicles.Vehicles.forEach(vehicle=>{
                        setTimeout(function(){
                            mongodbHelper.mongodb.insert(config.mongodbUrl,"SignalsLog",[{
                                signalId:GenerateGuid(),
                                customerName:CustomerVehicles.Name,
                                vehicleId:vehicle.VehicleId,
                                status:GenerateRandomStatus(),
                                StatusDateTime:moment().format('DD MM YYYY, h:mm:ss a'),
                                location:GetRandomLocationInRange(59,60,5)+","+GetRandomLocationInRange(17,18,5)//"59.4004802,17.9491565"
                            }],function(output){
                                //console.log(output);
                            },function(err){
                                console.log(err);
                            })
                        },GenerateRandomNumber(100000)) 
                    })
                },GenerateRandomNumber(100000))
            });

        },function(err){
            console.log(err);
        })

    }, loggingInterval);
}

function StopEngine() {
    clearInterval(timer);
    console.log("<<<<<<<<----- Signals Engine stopped ----->>>>>>>");
}

function GenerateRandomNumber(digits){
    var number = parseInt((Math.round(Math.random()* 0x1000*digits)/digits).toString().replace('0.',''));
    return number;
}

function GenerateGuid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4(); 
}

function GetRandomLocationInRange(from, to, fixed) {
    return (Math.random() * (to - from) + from).toFixed(fixed) * 1;
}

function GenerateRandomStatus(){
    var statusValues=['walking','stopped','connection lost','connection active'];
    return statusValues[Math.floor(Math.random() * (statusValues.length-1 - 0 + 1)) + 0]
}

module.exports = {
    start: StartEngine,
    terminate: StopEngine
}