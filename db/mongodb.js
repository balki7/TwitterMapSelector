const MongoClient = require('mongodb').MongoClient;
const Server = require('mongodb').Server;
const ObjectId = require('mongodb').ObjectID;

const mongoClient = new MongoClient(new Server('localhost', 27017));

let mongoDB = {

};

mongoDB.connect = (db, successCallback, errorCallback) => {
    mongoClient.connect((err, mongoClient) => {
        if(err) {
            console.error(err);
            return errorCallback(err);
        }

        mongoDB.localDB = mongoClient.db(db);
        successCallback();
    });
};

mongoDB.disconnect = () => {
  mongoClient.close();
};

mongoDB.insert = (collection, data, callback) => {
    mongoDB.localDB.collection(collection).insertOne(data, {upsert:true}, (err, result) => {
        if(err) {
            console.error(err);
            callback(err);
            return;
        }

        callback();
    });
};

mongoDB.count = (collection, callback) => {
    mongoDB.localDB.collection(collection).count((err, count) => {
        if(err) {
            console.error(err);
            return callback(err);
        }

        callback(null, count);
    });
};

mongoDB.findAll = (db, collection, callback) => {
    mongoDB.find(db, collection, {}, callback);
};

mongoDB.bulkInsert = (collection, data, callback) => {
    mongoDB.localDB.collection(collection).insertMany(data, {upsert:true}, (err, result) => {
        if(err) {
            console.error(err);
            callback(err);
            return;
        }

        callback();
    });
};

mongoDB.find = (collection, filter, callback) => {
    mongoDB.localDB.collection(collection).find(filter).toArray((err, docs) => {
        if(err) {
            console.error(err);
            callback(err);
            return;
        }

        callback(null, docs);
    });
};

mongoDB.get = (collection, id, callback) => {
    mongoDB.localDB.collection(collection).findOne({_id : ObjectId(id)}, (err, docs) => {
        if(err) {
            console.error(err);
            callback(err);
            return;
        }

        callback(null, docs);
    });
};

mongoDB.aggregate = (db, collection, filter, callback) => {
    mongoDB.localDB.collection(collection).aggregate(filter).toArray((err, docs) => {
        if(err) {
            console.error(err);
            callback(err);
            return;
        }

        callback(null, docs);
    });
};



module.exports = mongoDB;