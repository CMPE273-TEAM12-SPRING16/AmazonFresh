/**
 * Created by aneri on 18-04-2016.
 */
//Twitter Project with Mongo

var MongoClient = require('mongodb').MongoClient;
var mongoURL = "mongodb://localhost:27017/amazon_fresh";
var db;
var connected = false;

/**
 * Connects to the MongoDB Database with the provided URL
 */
function connect(url, callback){
    MongoClient.connect(url, function(err, _db){
        if (err) { throw new Error('Could not connect: '+err); }
        db = _db;
        connected = true;
        console.log(connected +" is connected?");
        callback(db);
    });
};

/**
 * Returns the collection on the selected database
 */
function collection(name){
    if (!connected) {
        throw new Error('Must connect to Mongo before calling "collection"');
    }
    return db.collection(name);

};


exports.insertMany = function(collectionName,insertJSONArray,callbackFunction){

    connect(mongoURL, function(db){
        console.log('Connected to mongo at: ' + mongoURL);
        var collectionObject = collection(collectionName);
        collectionObject.insertMany(insertJSONArray,callbackFunction);//native object call for NPM
//		db.close();
    });
}

exports.insertOne = function(collectionName,insertJSON,callbackFunction){

    connect(mongoURL, function(db){
        console.log('Connected to mongo at: ' + mongoURL);
        var collectionObject = collection(collectionName);
        collectionObject.insertOne(insertJSON,callbackFunction);//native object call for NPM
//		db.close();
    });
}

exports.findOne = function(collectionName,queryJSON,callbackFunction)
{
    connect(mongoURL, function(db){
        console.log('Connected to mongo at: ' + mongoURL);
        var collectionObject = collection(collectionName);
        console.log(queryJSON);
        collectionObject.findOne(queryJSON,callbackFunction);
    });

}

exports.find = function(collectionName,queryJSON,callbackFunction)
{
    connect(mongoURL, function(db){
        console.log('Connected to mongo at: ' + mongoURL);
        var collectionObject = collection(collectionName);
        console.log(queryJSON);
        collectionObject.find(queryJSON).toArray(callbackFunction);
    });

}


exports.count = function(collectionName,queryJSON,callbackFunction)
{
    connect(mongoURL, function(db){
        console.log('Connected to mongo at: ' + mongoURL);
        var collectionObject = collection(collectionName);
        console.log(queryJSON);
        collectionObject.count(queryJSON,callbackFunction);
    });

}

exports.removeOne = function(collectionName,queryJSON,callbackFunction)
{
    connect(mongoURL, function(db){
        console.log('Connected to mongo at: ' + mongoURL);
        var collectionObject = collection(collectionName);
        console.log(queryJSON);
        collectionObject.removeOne(queryJSON,callbackFunction);
    });

}

exports.updateOne = function(collectionName,queryJSON,updateJSON,callbackFunction)
{
    connect(mongoURL, function(db){
        console.log('Connected to mongo at: ' + mongoURL);
        var collectionObject = collection(collectionName);
        console.log(queryJSON);
        collectionObject.updateOne(queryJSON,updateJSON,callbackFunction);
    });

}


exports.connect = connect;
exports.collection = collection;