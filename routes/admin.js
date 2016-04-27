
var ejs = require('ejs');
var mysql = require('./mysql');
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/amazon_fresh";
var user_id_arr = [];


exports.doSearchAdmin = function(req, res){
  var searchString = req.param("searchString");
  var searchType = req.param("searchType");
	var collectionName;

	if(searchType == 1){
		collectionName = 'USER_DETAILS';
	}else if(searchType == 2){
		collectionName = 'USER_DETAILS';
	}else if(searchType == 3){
		collectionName = 'PRODUCTS';
	}

  mongo.searchItAdmin(collectionName, searchString, searchType, function(err,searchRes){

    if(err){
      throw err;
    }
    else
    {
      if(searchRes){
        var jsonResponse = {
          "searchResults" : searchRes,
          "statusCode" : 200
        };
        res.send(jsonResponse);
      }
      else {
        jsonResponse = {result : "Nothing Found", "status" : "OK"};
        res.send(jsonResponse);
      }
    }
  });
}


exports.doShowPendingCustAprroval = function(req, res) {
	var user_id = req.session.userId;
	var getCustomerPendingJSON = {$and : [{"IS_APPROVED" : 0},{"USER_TYPE":1}]};

	var callbackFunction = function (err, results) {
           if(err)
		{
			throw err;
			json_responses = {"statusCode" : 401};
			console.log("Error in doShowProductList");
			//res.send(json_responses);
		}
		else
		{
			Object.keys(results).forEach(function(index) {
								// here, we'll first bit a list of all LogIds

								var id = results[index].USER_ID;
								user_id_arr.push(id);
							});
			console.log(user_id_arr);
			var cardDetailJSON = {"USER_ID" : {$in : user_id_arr}};
			console.log(user_id_arr);
			mongo.find('CUSTOMER_DETAILS',cardDetailJSON,function(err,userDetails){
					 if(err)
					{
						throw err;
						json_responses = {"statusCode" : 401};
						console.log("Error in doShowProductList");
						res.send(json_responses);
					}
					else{



						Object.keys(results).forEach(function(user) {
							Object.keys(userDetails).forEach(function(card) {
								if(userDetails[card].USER_ID == results[user].USER_ID){
									console.log(userDetails[card].CREDIT_CARD_DETAILS.CREDIT_CARD_NUMBER);
									results[user].CARD_NUMBER = userDetails[card].CREDIT_CARD_DETAILS.CREDIT_CARD_NUMBER;

								}
									});
								});

						results.CARD_NUMBER = userDetails;
						json_responses = {"statusCode" : 200,"results":results};
						res.send(json_responses);
					}
				});

    }
}
    mongo.find('USER_DETAILS',getCustomerPendingJSON,callbackFunction);
 };

 exports.doApproveCustomer = function(req,res){
 	var cust_id = req.param("customer_id");
 	console.log("customer is id"+cust_id);

 	var callbackFunction = function (err, results) {
           if(err)
		{
			throw err;
			json_responses = {"statusCode" : 401};
			console.log("Error in doShowProductList");
			res.send(json_responses);
		}
		else {
			   var approveUser = "UPDATE USERS set IS_APPROVED= 1 where USER_ID='" + cust_id + "'";

			   mysql.fetchData(function (err, results) {

				   if (results.affectedRows > 0) {

			   console.log(results.IS_APPROVED);

			   console.log("Approve Requests ");
			   console.log(results);
			   json_responses = {"statusCode": 200, "results": results};
			   res.send(json_responses);
		   }
			   },approveUser);
		}
    }
		console.log("doApproveCustomer "+cust_id);

    var approvalWhereJSON = {"USER_ID" : cust_id};
    var approvalSetJSON = {$set : {"IS_APPROVED" : 1}};

    mongo.updateOne('USER_DETAILS',approvalWhereJSON,approvalSetJSON,callbackFunction);
 }

 exports.doRejectCustomer = function(req,res){
 	var cust_id = req.param("customer_id");


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
			var rejectUser = "update USERS set IS_APPROVED= 2 where USER_ID='" + cust_id + "'";

			mysql.fetchData(function (err, results) {

				if (results.affectedRows > 0) {

					console.log(results.IS_APPROVED);
			console.log("Pending customer requests ");
			console.log(results);
			json_responses = {"statusCode" : 200,"results":results};
			res.send(json_responses);
				}
			},rejectUser);
		}
    }

    var approvalWhereJSON = {"USER_ID" : cust_id};
    var approvalSetJSON = {$set : {"IS_APPROVED" : 2}};

    mongo.updateOne('USER_DETAILS',approvalWhereJSON,approvalSetJSON,callbackFunction);
 }

// Farmer approval/reject
exports.doShowPendingFarmerAprroval = function(req, res) {
	var user_id = req.session.userId;
	var getCustomerPendingJSON = {$and : [{"IS_APPROVED" : 0},{"USER_TYPE":2}]};

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

    mongo.find('USER_DETAILS',getCustomerPendingJSON,callbackFunction);
 };

 exports.doApproveFarmer = function(req,res){
 	var cust_id = req.param("customer_id");


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
			var approveFarmer = "UPDATE USERS set IS_APPROVED= 1 where USER_ID='" + cust_id + "'";

			mysql.fetchData(function (err, results) {

				if (results.affectedRows > 0) {

					console.log(results.IS_APPROVED);
			console.log("Pending customer requests ");
			console.log(results);
			json_responses = {"statusCode" : 200,"results":results};
			res.send(json_responses);
		}
			},approveFarmer);
		}
    }

    var approvalWhereJSON = {"USER_ID" : cust_id};
    var approvalSetJSON = {$set : {"IS_APPROVED" : 1}};

    mongo.updateOne('USER_DETAILS',approvalWhereJSON,approvalSetJSON,callbackFunction);
 }

 exports.doRejectFarmer = function(req,res){
 	var cust_id = req.param("customer_id");


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
			var rejectFarmer = "update USERS set IS_APPROVED=2  where USER_ID='" + cust_id + "'";

			mysql.fetchData(function (err, results) {

				if (results.affectedRows > 0) {
			console.log("Pending customer requests ");
			console.log(results);
			json_responses = {"statusCode" : 200,"results":results};
			res.send(json_responses);
		}
			},rejectFarmer);
		}
    }

    var approvalWhereJSON = {"USER_ID" : cust_id};
    var approvalSetJSON = {$set : {"IS_APPROVED" : 2}};

    mongo.updateOne('USER_DETAILS',approvalWhereJSON,approvalSetJSON,callbackFunction);
 }

 //Product approve/reject

 exports.doShowPendingProductAprroval = function(req, res) {
	var user_id = req.session.userId;
	var getProductPendingJSON = {"IS_APPROVED" : 0};

	console.log("doShowPendingProductAprroval" +user_id);
	var callbackFunction = function (err, results) {
           if(err)
		{
			throw err;
			json_responses = {"statusCode" : 401};
			console.log("Error in doShowPendingProductAprroval");
			res.send(json_responses);
		}
		else
		{
			console.log(results);
			json_responses = {"statusCode" : 200,"results":results};
			res.send(json_responses);
		}
    }

    mongo.find('PRODUCTS',getProductPendingJSON,callbackFunction);
 };

 exports.doApproveProduct = function(req,res){

 	var product_id = new require('mongodb').ObjectID(req.param("product_id"));
 	var callbackFunction = function (err, results) {
           if(err)
		{
			throw err;
			json_responses = {"statusCode" : 401};
			console.log("Error in doApproveProduct");
			res.send(json_responses);
		}
		else
		{
			console.log("Pending customer requests ");
			console.log(results);
			json_responses = {"statusCode" : 200,"results":results};
			res.send(json_responses);
		}
    }

    var approvalWhereJSON = {"_id" : product_id};
    var approvalSetJSON = {$set : {"IS_APPROVED" : 1}};

    mongo.updateOne('PRODUCTS',approvalWhereJSON,approvalSetJSON,callbackFunction);
 }

 exports.doRejectProduct = function(req,res){
 var product_id = new require('mongodb').ObjectID(req.param("product_id"));
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
			console.log("Pending customer requests ");
			console.log(results);
			json_responses = {"statusCode" : 200,"results":results};
			res.send(json_responses);
		}
    }

    var approvalWhereJSON = {"_id" : product_id};
    var approvalSetJSON = {$set : {"IS_APPROVED" : 2}};

    mongo.updateOne('PRODUCTS',approvalWhereJSON,approvalSetJSON,callbackFunction);
 }

//------------------Reveiw----------------------------

exports.doShowAllCustomer = function(req,res){
var getCustomerPendingJSON = {"USER_TYPE":1};

	var callbackFunction = function (err, results) {
           if(err)
		{
			throw err;
			json_responses = {"statusCode" : 401};
			console.log("Error in doShowProductList");
			//res.send(json_responses);
		}
		else
		{
			Object.keys(results).forEach(function(index) {
								// here, we'll first bit a list of all LogIds

								var id = results[index].USER_ID;
								user_id_arr.push(id);
							});

			var cardDetailJSON = {"USER_ID" : {$in : user_id_arr}};
			console.log(user_id_arr);
			mongo.find('CUSTOMER_DETAILS',cardDetailJSON,function(err,userDetails){
					 if(err)
					{
						throw err;
						json_responses = {"statusCode" : 401};
						console.log("Error in doShowProductList");
						res.send(json_responses);
					}
					else{



						Object.keys(results).forEach(function(user) {
							Object.keys(userDetails).forEach(function(card) {
								if(userDetails[card].USER_ID == results[user].USER_ID){

									results[user].CARD_NUMBER = userDetails[card].CREDIT_CARD_DETAILS.CREDIT_CARD_NUMBER;

								}
									});
								});

						results.CARD_NUMBER = userDetails;
						json_responses = {"statusCode" : 200,"results":results};
						res.send(json_responses);
					}
				});

    }
}
    mongo.find('USER_DETAILS',getCustomerPendingJSON,callbackFunction);

}

exports.reviewFarmer = function(req, res) {
	var user_id = req.session.userId;
	var getCustomerPendingJSON = {"USER_TYPE":2};

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

    mongo.find('USER_DETAILS',getCustomerPendingJSON,callbackFunction);
 };

 exports.reviewProduct = function(req, res) {

	var getProductPendingJSON = {};

	console.log("review product");
	var callbackFunction = function (err, results) {
           if(err)
		{
			throw err;
			json_responses = {"statusCode" : 401};
			console.log("Error in doShowPendingProductAprroval");
			res.send(json_responses);
		}
		else
		{
			console.log(results);
			json_responses = {"statusCode" : 200,"results":results};
			res.send(json_responses);
		}
    }

    mongo.find('PRODUCTS',getProductPendingJSON,callbackFunction);
 };
