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
        var collectionObject = collection(collectionName);
        collectionObject.insertMany(insertJSONArray,callbackFunction);//native object call for NPM
//		db.close();
    });
}

exports.insertOne = function(collectionName,insertJSON,callbackFunction){

    connect(mongoURL, function(db){
      //  console.log('Connected to mongo at: ' + mongoURL);
        var collectionObject = collection(collectionName);
        collectionObject.insertOne(insertJSON,callbackFunction);//native object call for NPM
//		db.close();
    });
}

exports.findOne = function(collectionName,queryJSON,callbackFunction)
{
    connect(mongoURL, function(db){
      //  console.log('Connected to mongo at: ' + mongoURL);
        var collectionObject = collection(collectionName);
        //console.log(queryJSON);
        collectionObject.findOne(queryJSON,callbackFunction);
    });

}

exports.findWithProjection = function(collectionName,queryJSON, projectionJSON, callbackFunction)
{
    connect(mongoURL, function(db){
        var collectionObject = collection(collectionName);
        collectionObject.find(queryJSON).project(projectionJSON).toArray(callbackFunction);
    });

}

exports.findOneWithProjection = function(collectionName,queryJSON, projectionJSON, callbackFunction)
{
    connect(mongoURL, function(db){
      //  console.log('Connected to mongo at: ' + mongoURL);
        var collectionObject = collection(collectionName);
      //  console.log(queryJSON);
        collectionObject.findOne(queryJSON, projectionJSON, callbackFunction);
    });

}


exports.searchIt = function(collectionName, searchString, searchType, callback){

  var regexValue='\.*'+searchString+'\.*';
//  var idString = new require('mongodb').ObjectID(searchString);

  if(searchType == 1){
    var queryJSON = { PRODUCT_NAME : new RegExp(regexValue, 'i'), IS_APPROVED : 1};
  //  var queryJSON2 = {_id : idString};
  } else if(searchType == 2){
    var queryJSON = { FARMER_NAME : new RegExp(regexValue, 'i'), IS_APPROVED : 1};
  //  var queryJSON2 = {_id : idString};
  }


  connect(mongoURL, function(db){
      var collectionObject = collection(collectionName);
    	collectionObject.find(queryJSON).toArray(callback);
  });
}

exports.searchItAdmin = function(collectionName, searchString, searchType, callback){

  var regexValue = new RegExp('\.*'+searchString+'\.*', 'i');

  if(searchType == 1){
    var queryJSON = { $or : [{FIRST_NAME : regexValue}, {LAST_NAME : regexValue}], USER_TYPE : 1};
  //  var queryJSON2 = {_id : idString};
  } else if(searchType == 2){
    var queryJSON = { $or : [{FIRST_NAME : regexValue}, {LAST_NAME : regexValue}], USER_TYPE : 2};
  //  var queryJSON2 = {_id : idString};
  } else if (searchType == 3) {
    var queryJSON = {PRODUCT_NAME : regexValue};
  } else if (searchType == 4) {
    var queryJSON = {BILL_ID : Number(searchString)};
  }


  connect(mongoURL, function(db){
      var collectionObject = collection(collectionName);
    	collectionObject.find(queryJSON).toArray(callback);
  });
}

exports.find = function(collectionName,queryJSON,callbackFunction)
{
    connect(mongoURL, function(db){
      //  console.log('Connected to mongo at: ' + mongoURL);
        var collectionObject = collection(collectionName);
      //  console.log(queryJSON);
        collectionObject.find(queryJSON).toArray(callbackFunction);
    });

}

exports.findOneUsingId = function(collectionName,idString,callbackFunction) {

    var o_id = new require('mongodb').ObjectID(idString);
    var queryJSON = {_id : o_id};

    connect(mongoURL, function(db){
      //  console.log('Connected to mongo at: ' + mongoURL);
        var collectionObject = collection(collectionName);
      //  console.log(queryJSON);
        collectionObject.findOne(queryJSON,callbackFunction);
    });
}

exports.count = function(collectionName,queryJSON,callbackFunction)
{
    connect(mongoURL, function(db){
      //  console.log('Connected to mongo at: ' + mongoURL);
        var collectionObject = collection(collectionName);
      //  console.log(queryJSON);
        collectionObject.count(queryJSON,callbackFunction);
    });

}

exports.removeOne = function(collectionName,queryJSON,callbackFunction)
{
    connect(mongoURL, function(db){
      //  console.log('Connected to mongo at: ' + mongoURL);
        var collectionObject = collection(collectionName);
      //  console.log(queryJSON);
        collectionObject.removeOne(queryJSON,callbackFunction);
    });

}

exports.updateOne = function(collectionName,queryJSON,updateJSON,callbackFunction)
{
    connect(mongoURL, function(db){
      //  console.log('Connected to mongo at: ' + mongoURL);
        var collectionObject = collection(collectionName);
      //  console.log(queryJSON);
        collectionObject.updateOne(queryJSON,updateJSON,callbackFunction);
    });

}

exports.aggregateZip = function(collectionName, callbackFunction)
{
    connect(mongoURL, function(db){
      //  console.log('Connected to mongo at: ' + mongoURL);
        var collectionObject = collection(collectionName);
      //  console.log(queryJSON);
        collectionObject.aggregate([{ $group: { _id : "$ZIP", total: { $sum: 1 }}}], callbackFunction);
    });

}


exports.connect = connect;
exports.collection = collection;
