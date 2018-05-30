
var MongoClient = require('mongodb').MongoClient;

function ConnectOrCreateNewDB(url, keepConnectionOpen, successCallback, failCallback) {
    MongoClient.connect(url, function (err, db) {
        if (err) {
            failCallback(err);
        } else {
            console.log("Database created! / Connected Successfully -- > " + url);
            if (keepConnectionOpen) {
                successCallback(db);
            } else {
                db.close();
                successCallback(true);
            }
        }
    });
}

function CreateNewCollection(url, collectionName, successCallback, failCallback) {
    // Table or Collection Creation
    ConnectOrCreateNewDB(url, true, function (db) {
        db.createCollection(collectionName, function (err, res) {
            if (err) {
                failCallback(err);
            } else {
                console.log(collectionName + " Collection created!");
                db.close();
                successCallback(true);
            }
        });
    }, function (err) {
        console.log(err);
    });
}

function dropCollection(url, collectionName, successCallback, failCallback) {
    ConnectOrCreateNewDB(url, true, function (db) {
        db.collection(collectionName).drop(function (err, delOK) {
            if (err) {
                failCallback(err);
            }
            if (delOK) {
                console.log(collectionName + " Collection dropped!");
                db.close();
                successCallback(true);
            }
        });
    });
}

function InsertData(url, collectionName, JsonArray, successCallback, failCallback) {
    ConnectOrCreateNewDB(url, true, function (db) {
        db.collection(collectionName).insertMany(JsonArray, function (err, res) {
            if (err) {
                failCallback(err);
            } else {
                console.log("Number of documents / Rows inserted: " + res.insertedCount +" in Collection "+collectionName);
                db.close();
                successCallback(res.insertedCount);
            }
        });
    });
}

function updateData(url, collectionName, selectionQuery, newValuesObject, successCallback, failCallback) {
    ConnectOrCreateNewDB(url, true, function (db) {
        db.collection(collectionName).updateMany(selectionQuery == "*" ? {} : selectionQuery, {
            $set: newValuesObject
        }, function (err, res) {
            if (err) {
                failCallback(err);
            } else {
                console.log(res.result.nModified + " document(s) updated" +" in Collection "+collectionName);
                db.close();
                successCallback(res.result.nModified);
            }
        });
    });
}

function deleteData(url, collectionName, selectionQuery, successCallback, failCallback) {
    ConnectOrCreateNewDB(url, true, function (db) {
        db.collection(collectionName).deleteMany(selectionQuery == "*" ? {} : selectionQuery, function (err, res) {
            if (err) {
                failCallback(err);
            } else {
                console.log(res.result.n + " document(s) deleted" +" from Collection "+collectionName);
                db.close();
                successCallback(res.result.n);
            }
        });
    });
}

function selectData(url, collectionName, selectionQuery,returnedColumns, successCallback, failCallback) {
    ConnectOrCreateNewDB(url, true, function (db) {
        db.collection(collectionName).find(selectionQuery == "*" ? {} : selectionQuery,returnedColumns == "*" ? {} : returnedColumns).toArray(function (err, res) {
            if (err) {
                failCallback(err);
            } else {
                console.log(res.length + " document(s) Selected" +" from Collection "+collectionName);
                db.close();
                successCallback(res);
            }
        });
    });
}

module.exports = {
    mongodb: {
        initDb: ConnectOrCreateNewDB,
        createTable: CreateNewCollection,
        dropTable: dropCollection,
        insert: InsertData,
        update: updateData,
        delete: deleteData,
        select: selectData
    }
}


