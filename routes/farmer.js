var ejs = require('ejs');
var mysql = require('./mysql');
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/amazon_fresh";

//Retrive list of products
exports.doShowProductList = function(req, res) {
	var user_id = req.session.user_id;
	console.log(req.session.firstName);
	var getProductJSON = {"FARMER_ID" : user_id}

	var callbackFunction = function (err, results) {
           if(err)
		{
			throw err;
			json_responses = {"statusCode" : 401};
			console.log("Error in doShowProductList");
			res.send(json_responses);
		}
		else
		{
			json_responses = {"statusCode" : 200,"results":results};
			res.send(json_responses);
		}
    }

    mongo.find('PRODUCTS',getProductJSON,callbackFunction);


 };

// show farmer profile details for update
 exports.doShowFarmerProfile = function(req,res){
 	var user_id = req.session.user_id;
 	var getProfileJSON = {"USER_ID" : user_id};

 	console.log("User_ID "+user_id);

 	var callbackFunction = function (err, results) {
           if(err)
		{
			throw err;
			json_responses = {"statusCode" : 401};
			console.log("Error in doShowFarmerProfile");
			res.send(json_responses);
		}
		else
		{
			json_responses = {"statusCode" : 200,"results":results};
			console.log("result is:"+results);
			res.send(json_responses);
		}
	}

		mongo.findOne('USER_DETAILS',getProfileJSON,callbackFunction);

 };

//update farmer profile details.
 exports.doUpdateProfile = function(req,res){
 	var user_id = req.session.user_id;
 	var first_name = req.param("first_name");
 	var last_name = req.param("last_name");
 	var ssn = req.param("ssn");
 	var address = req.param("address");
 	var city = req.param("city");
 	var state = req.param("state");
 	var zip = req.param("zip");
 	var phone = req.param("phone");

 	console.log("First Name "+first_name);
 	var callbackFunction = function (err, results) {
           if(err)
		{
			throw err;
			json_responses = {"statusCode" : 401};
			console.log("Error in doShowFarmerProfile");
			res.send(json_responses);
		}
		else
		{

			json_responses = {"statusCode" : 200,"results":results};
			console.log("result is:"+results);
			res.send(json_responses);
		}
	}

	var updatedWhereJSON = {"USERID" : user_id};
	var updatedDetailJSON = {$set : {
			"FIRSTNAME" : first_name,
			"LASTNAME" : last_name,
			"SSN" : ssn,
			"ADDRESS" : address,
			"CITY" : city,
			"STATE" : state,
			"ZIP" : zip,
			"PHONE" : phone
			}
		};

	mongo.updateOne('USERS',updatedWhereJSON,updatedDetailJSON,callbackFunction);

 };
