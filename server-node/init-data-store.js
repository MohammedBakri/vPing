//CMD  = > node --max_old_space_size=8000 server-node/init-data-store.js
var mongodbHelper = require("./mongo-db-helper");
var config = require("./config");

//drop before create
mongodbHelper.mongodb.dropTable(config.mongodbUrl,"CustomersVehicles",function(){
// create collections
// customers
mongodbHelper.mongodb.createTable(config.mongodbUrl, "CustomersVehicles", function() {
    //Success
    mongodbHelper.mongodb.insert(config.mongodbUrl, "CustomersVehicles", [{
        Id: 1,
        Name: "Kalles Grustransporter AB",
        Password: "12345",
        Address: "Cementvägen 8, 111 11 Södertälje",
        Vehicles: [{
            VehicleId: "YS2R4X20005399401",
            RegNumber: "ABC123"
        }, {
            VehicleId: "VLUR4X20009093588",
            RegNumber: "DEF456"
        }, {
            VehicleId: "VLUR4X20009048066",
            RegNumber: "GHI789"
        }]
    }, {
        Id: 2,
        Name: "Johans Bulk AB",
        Password: "12345",
        Address: "Balkvägen 12, 222 22 Stockholm",
        Vehicles: [{
            VehicleId: "YS2R4X20005388011",
            RegNumber: "JKL012"
        }, {
            VehicleId: "YS2R4X20005387949",
            RegNumber: "MNO345"
        }]
    }, {
        Id: 3,
        Name: "Haralds Värdetransporter AB",
        Password: "12345",
        Address: "Budgetvägen 1, 333 33 Uppsala",
        Vehicles: [{
            VehicleId: "VLUR4X20009048066",
            RegNumber: "PQR678"
        }, {
            VehicleId: "YS2R4X20005387055",
            RegNumber: "STU901"
        }]
    }], function(results){
        //console.log(results);
    }, function(err) {
        console.log(err);
    })
}, function() {})
},function(){

})


mongodbHelper.mongodb.dropTable(config.mongodbUrl,"SignalsLog",function(){
    mongodbHelper.mongodb.createTable(config.mongodbUrl, "SignalsLog", function() {},function(){});
},function(){});
// signals log
