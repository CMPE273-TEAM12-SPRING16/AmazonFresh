var ejs = require('ejs');
var mysql = require('./mysql');
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/amazon_fresh";
var objectID = require('mongodb').ObjectID;
var multer = require('multer');
imageFilename = "";
videoFilename = "";

var storage = multer.diskStorage({ //multers disk storage settings
        destination: function (req, file, cb) {
            cb(null, './public/uploads/');
        },
        filename: function (req, file, cb) {
            var datetimestamp = Date.now();
            filename = file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1];
            console.log("File name"+videoFilename);
            if(file.mimetype.startsWith("image"))
            {
            	imageFilename = filename;
            }
			else if(file.mimetype.startsWith("video"))
            {
            	videoFilename = filename;
            }
            else
            {
            	console.log("Unexpected file received");
            }
            cb(null, filename);
        }
    });

var uploadFiles = multer({ //multer settings
                    storage: storage
                }).fields([
  { name: 'imageFile', maxCount: 1 },
  { name: 'videoFile', maxCount: 1 }
]);



//redirect to farmer profile page
exports.farmerProfile = function(req, res){
	var farmerId = req.param("id");
	ejs.renderFile('./views/farmerProfile.ejs',{"farmerId":farmerId},function(err, results) {
		if (!err) {
			res.end(results);
		}
		else{
			console.log("File rendered");
		}
	});
}

//Retrive list of products
exports.doShowProductList = function(req, res) {
	var user_id = req.session.userId;
	console.log(req.session.firstName);
	var getProductJSON = {"FARMER_ID" : user_id,"IS_APPROVED": 1}
	console.log("products List");
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
			console.log(results);
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


exports.getFarmerDetails = function(req,res) {
	var farmerId = req.param("farmerId");
	console.log("farmerId:" + farmerId);

	if (objectID.isValid(farmerId)) {
		var getFarmerDetailsJSON = {"USER_ID": req.param("farmerId")};

		var callbackFunction = function (err, results) {
			if (err) {
				throw err;
				var json_responses = {"statusCode": 401};
				console.log("Error in getFarmerDetails");
				res.send(json_responses);
			}
			else {
				console.log("result is:" + results);
				var json_responses = {"statusCode": 200, "results": results};
				res.send(json_responses);
			}
		}

		console.log("json" + JSON.stringify(getFarmerDetailsJSON));
		mongo.findOne('USER_DETAILS', {'USER_ID': Number(farmerId)}, callbackFunction);
	}
	else {
		res.send({"statusCode": 401});
		console.log("invalid id format");
	}}

exports.doAddIntroduction = function(req,res)
{

	console.log("clicked");
	uploadFiles(req,res,function(err){
            if(err){
                	console.log("code has some errors");
                	console.log(err);
                 return err;
            }
             else
             	{

     //         		var productName = req.param("productName");
					// var unit = req.param("units");
					// var price = req.param("price");
					// var productDescription = req.param("productDescription");
					// var farmerName = req.session.firstName + " " + req.session.lastName;
					// var farmerId = req.session.userId;
					// var noOfUnits = req.param("noOfunits");
     //         		console.log("File uploaded successfully"+noOfUnits);

					// var ingredients = req.param("ingredients");

     //         		console.log("File uploaded successfully");

     //         			var insertJSON = {"PRODUCT_NAME" : productName,
					// 	"FARMER_ID" : farmerId,
					// 	"FARMER_NAME" : farmerName,
					// 	"PRICE" : price,
					// 	"NOOFUNITS" : noOfUnits,
					// 	"UNIT" : unit,
					// 	"PRODUCT_DESCRIPTION" : productDescription,
					// 	"FILE_NAME" : uploadFilename,
					// 	"IS_APPROVED" : 0,
					// 	"AVG_RATING" : 0,
					// 	"REVIEW_DETAILS" : []

					// 	};
     //         		mongo.insertOne('PRODUCTS',insertJSON,callbackFunction);

							             		json_responses = {"statusCode" : 200};
												// console.log("result is:"+results);
												res.send(json_responses);
												console.log("imageFilename"+imageFilename);
												console.log("videoFilename"+videoFilename);
							             	
             	}
        });



}

