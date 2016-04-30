var ejs = require('ejs');
var mysql = require('./mysql');
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/amazon_fresh";
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
 	var user_id = req.session.userId;
 	console.log(user_id);
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

	var getFarmerDetailsJSON = {"USER_ID": req.param("farmerId")};
	var callbackFunction = function (err, results) {
			if (results) {

				console.log("result is:" + results);
				var callbackFunctionFarmerDetails = function (err, result) {
					if (result) {
console.log(result.USER_ID);
						//console.log("result is:" + result.IMAGE);
						var json_responses = {"statusCode": 200, "result": result,"results":results};
						 res.send(json_responses);
					}
					else {
						console.log("video and image not found");
					}
				}

				mongo.findOne('FARMER_DETAILS', {'USER_ID': Number(farmerId)},callbackFunctionFarmerDetails);
			}
			else {
                var json_responses={"statusCode":401};
				res.send(json_responses);
			}
		}

		console.log("json" + JSON.stringify(getFarmerDetailsJSON));
		mongo.findOne('USER_DETAILS', {'USER_ID': Number(farmerId)}, callbackFunction);



	}

exports.doAddIntroduction = function(req,res)
{

	var farmerId=req.session.userId;
	console.log("farmer id id"+farmerId);
	console.log("clicked");
	uploadFiles(req,res,function(err){
            if(err){
                	console.log("code has some errors");
                	console.log(err);
                 return err;
            }
             else
             	{
					var farmerDescription = req.param("farmerDescription");
					console.log(farmerDescription+ "farmer description is");
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


						var callbackFunction = function (err, results) {
							if(err)
							{
								throw err;
								json_responses = {"statusCode" : 401};
								console.log("Error in doAddIntroduction,farmer.js");
								res.send(json_responses);
							}
							else {
								console.log("image and video inserted");

							}
						}
					    var WhereJSON = {"USER_ID" : farmerId};
						var introductionSetJSON = {$set : {"INTRODUCTION_DETAILS":farmerDescription,"IMAGE" : imageFilename ,"VIDEO" : videoFilename}};

						mongo.updateOne('FARMER_DETAILS',WhereJSON,introductionSetJSON,callbackFunction);
					}




        });



}

exports.doDeleteProfile = function(req,res){
	var farmer_id = req.param("farmer_id");
	console.log("Farmer "+farmer_id);
	var deleteWhereJSON = {USER_ID : farmer_id};
	var deleteSetJSON = {$set : {IS_APPROVED : 0}};
	var deleteQuery = "UPDATE USERS SET IS_APPROVED = " + 0 +" WHERE USER_ID = "+ farmer_id;
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
			res.redirect("/logout");
		}
    }
    mysql.updateData(deleteQuery,function (err, results) {
    	if(err){
    		console.log(err);
    	}
    	else{
    		 mongo.updateOne('USER_DETAILS',deleteWhereJSON,deleteSetJSON,callbackFunction);
    	}
    })
   

}

exports.addFarmerReview = function(req,res){
	var farmer_id = req.param("farmer_id");
	var ratings = Number(req.param("ratings"));
	var review = req.param("review");
	var avgRating = Number(req.param("avg_rating"));
	var avg = 0;
	if(avgRating != 0){
		avg = Math.round((ratings+avgRating)/2);
		console.log("Avg if !0"+avg);
	}
	else{
		avg = ratings;
		console.log("Avg if 0 "+avg);
	}


	var title = req.param("title");
	var date = new Date();
	var name = req.session.firstName+" "+req.session.lastName;
	var user_id = req.session.userId;
	var reviewJSON = {
		"RATINGS" : ratings,
		"TITLE" : title,
		"REVIEW" : review,
		"CUSTOMER_NAME" : name,
		"TIMESTAMP" : date,
		"USER_ID" : user_id
	}
	var productWhereJSON = {"USER_ID" : farmer_id};
	var productSetJSON = {$push : {"REVIEW_DETAILS" : reviewJSON}};
	var callbackFunction = function (err, results) {
		if(err)
		{
			throw err;
			json_responses = {"statusCode" : 401};
			console.log("Error in add review farmer");
			res.send(json_responses);
		}
		else
		{
			console.log("---->>>>"+results);
			var updateAvgRating = {$set : {"AVERAGE_RATING" : avg}};
			mongo.updateOne('PRODUCTS',productWhereJSON,updateAvgRating,function(err,reviews){
				if(err){
					throw err;
					json_responses = {"statusCode" : 401};
					console.log("Error in doShowProductList");
					res.send(json_responses);
				}
				else{
					console.log("----->>>> send "+reviews.AVG_RATING);
					json_responses = {"statusCode" : 200,"results":reviews};
					res.send(json_responses);
				}


			});
		}
	}
	mongo.updateOne('FARMER_DETAILS',productWhereJSON,productSetJSON,callbackFunction);
}

