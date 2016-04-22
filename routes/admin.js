
var ejs = require('ejs');
var mysql = require('./mysql');
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/amazon_fresh";

exports.doShowPendingCustAprroval = function(req, res) {
	var user_id = req.session.user_id;
	var getCustomerPendingJSON = {$and : [{"ISAPPROVED" : 0},{"USER_TYPE":1}]};

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

 exports.doApproveCustomer = function(req,res){
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
			console.log("Pending customer requests ");
			console.log(results);
			json_responses = {"statusCode" : 200,"results":results};
			res.send(json_responses);
		}
    }

    var approvalWhereJSON = {"USERID" : cust_id};
    var approvalSetJSON = {$set : {"ISAPPROVED" : 1}};

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
			console.log("Pending customer requests ");
			console.log(results);
			json_responses = {"statusCode" : 200,"results":results};
			res.send(json_responses);
		}
    }

    var approvalWhereJSON = {"USERID" : cust_id};
    var approvalSetJSON = {$set : {"ISAPPROVED" : 2}};

    mongo.updateOne('USER_DETAILS',approvalWhereJSON,approvalSetJSON,callbackFunction);
 }

// Farmer approval/reject 
exports.doShowPendingFarmerAprroval = function(req, res) {
	var user_id = req.session.user_id;
	var getCustomerPendingJSON = {$and : [{"ISAPPROVED" : 0},{"USER_TYPE":2}]};

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
			console.log("Pending customer requests ");
			console.log(results);
			json_responses = {"statusCode" : 200,"results":results};
			res.send(json_responses);
		}
    }

    var approvalWhereJSON = {"USER_ID" : cust_id};
    var approvalSetJSON = {$set : {"ISAPPROVED" : 1}};

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
			console.log("Pending customer requests ");
			console.log(results);
			json_responses = {"statusCode" : 200,"results":results};
			res.send(json_responses);
		}
    }

    var approvalWhereJSON = {"USER_ID" : cust_id};
    var approvalSetJSON = {$set : {"ISAPPROVED" : 2}};

    mongo.updateOne('USER_DETAILS',approvalWhereJSON,approvalSetJSON,callbackFunction);
 }

 //Product approve/reject

 exports.doShowPendingProductAprroval = function(req, res) {
	var user_id = req.session.user_id;
	var getProductPendingJSON = {$and : [{"ISAPPROVED" : 0},{"USER_TYPE":2}]};

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
			json_responses = {"statusCode" : 200,"results":results};
			res.send(json_responses);
		}
    }

    mongo.find('PRODUCT_DETAILS',getProductPendingJSON,callbackFunction);
 };

 exports.doApproveProduct = function(req,res){
 	var product_id = req.param("product_id");
 	

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
    var approvalSetJSON = {$set : {"ISAPPROVED" : 1}};

    mongo.updateOne('PRODUCTS_DETAILS',approvalWhereJSON,approvalSetJSON,callbackFunction);
 }

 exports.doRejectProduct = function(req,res){
 	var product_id = req.param("product_id");
 	

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
    var approvalSetJSON = {$set : {"ISAPPROVED" : 2}};

    mongo.updateOne('PRODUCTS_DETAILS',approvalWhereJSON,approvalSetJSON,callbackFunction);
 }

