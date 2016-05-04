
var ejs = require('ejs');
var mysql = require('./mysql');
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/amazon_fresh";
var user_id_arr = [];
var mq_client = require('../rpc/client');


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
	}else if(searchType == 4){
		collectionName = 'BILLING_INFORMATION';
	}

  var functionName = "doSearchAdmin";
	var msg_payload = {"searchString":searchString,"searchType":searchType,"collectionName":collectionName,"functionName":functionName};


	mq_client.make_request('AdminQueue', msg_payload, function (err, results) {
    console.log(results);
    if (err) {
      throw err;
    }
    else {
      if (results.statusCode == 200) {
        console.log("value inserted");
        var json_response={"statusCode":200};
        res.send(results);
      }

      else {
        var json_response={"statusCode":401};
        res.send(json_response)

      }
    }


  });
}


exports.doShowPendingCustAprroval = function(req, res) {
	var userId = req.session.userId;
	var getCustomerPendingJSON = {$and : [{"IS_APPROVED" : 0},{"USER_TYPE":1}]};
	var functionName = "doShowPendingCustAprroval";

	var msg_payload = {"userId":userId,"getCustomerPendingJSON":getCustomerPendingJSON,"functionName":functionName};

	mq_client.make_request('AdminQueue', msg_payload, function (err, results) {
    console.log(results);
    if (err) {
      throw err;
    }
    else {
      if (results.statusCode == 200) {
        console.log("value inserted");
        res.send(results);
      }

      else {
        var json_response={"statusCode":401};
        res.send(json_response)

      }
    }


  });

};

 exports.doApproveCustomer = function(req,res){
 	var customerId = req.param("customer_id");
 	var msg_payload = {"customerId":customerId,"functionName":"doApproveCustomer"};

	mq_client.make_request('AdminQueue', msg_payload, function (err, results) {
	    console.log(results);
	    if (err) {
	      throw err;
	    }
	    else {
	      if (results.statusCode == 200) {
	        console.log("value inserted");
	        res.send(results);
	      }

	      else {
	        var json_response={"statusCode":401};
	        res.send(json_response)

	      }
	    }


  });

}

exports.doRejectCustomer = function(req,res){
 	var customerId = req.param("customer_id");
 	var msg_payload = {"customerId":customerId,"functionName":"doRejectCustomer"};

 	mq_client.make_request('AdminQueue', msg_payload, function (err, results) {
    console.log(results);
    if (err) {
      throw err;
    }
    else {
      if (results.statusCode == 200) {
        console.log("value inserted");
        res.send(results);
      }

      else {
        var json_response={"statusCode":401};
        res.send(json_response)

      }
    }


  });

}

// Farmer approval/reject
exports.doShowPendingFarmerAprroval = function(req, res) {
	var userId = req.session.userId;
	var getCustomerPendingJSON = {$and : [{"IS_APPROVED" : 0},{"USER_TYPE":2}]};

	var msg_payload = {"userId" : userId , "getCustomerPendingJSON" : getCustomerPendingJSON ,"functionName":"doShowPendingFarmerAprroval"};

	mq_client.make_request('AdminQueue', msg_payload, function (err, results) {
    console.log(results);
    if (err) {
      throw err;
    }
    else {
      if (results.statusCode == 200) {
        console.log("value inserted");
        res.send(results);
      }

      else {
        var json_response={"statusCode":401};
        res.send(json_response)

      }
    }


  });

 };

 exports.doApproveFarmer = function(req,res){
 	var customerId = req.param("customer_id");

 	var msg_payload = {"customerId" : customerId ,"functionName" : "doApproveFarmer"};

	mq_client.make_request('AdminQueue', msg_payload, function (err, results) {
	    console.log(results);
	    if (err) {
	      throw err;
	    }
	    else {
	      if (results.statusCode == 200) {
	        console.log("value inserted");
	        res.send(results);
	      }

	      else {
	        var json_response={"statusCode":401};
	        res.send(json_response)

	      }
	    }


	  });


 }

 exports.doRejectFarmer = function(req,res){
 	var customerId = req.param("customer_id");

 	var msg_payload = {"customerId" : customerId , "functionName" : "doRejectFarmer"};

 	mq_client.make_request('AdminQueue', msg_payload, function (err, results) {
	    console.log(results);
	    if (err) {
	      throw err;
	    }
	    else {
	      if (results.statusCode == 200) {
	        console.log("value inserted");
	        res.send(results);
	      }

	      else {
	        var json_response={"statusCode":401};
	        res.send(json_response)

	      }
	    }


	  });

 }

 //Product approve/reject

 exports.doShowPendingProductAprroval = function(req, res) {
	var userId = req.session.userId;
	var getProductPendingJSON = {"IS_APPROVED" : 0};

	var msg_payload = {"userId" : userId , "getProductPendingJSON" : getProductPendingJSON ,"functionName" : "doShowPendingProductAprroval"};

	mq_client.make_request('AdminQueue', msg_payload, function (err, results) {
	    console.log(results);
	    if (err) {
	      throw err;
	    }
	    else {
	      if (results.statusCode == 200) {
	        console.log("value inserted");
	        res.send(results);
	      }

	      else {
	        var json_response={"statusCode":401};
	        res.send(json_response)

	      }
	    }


	  });

 };

 exports.doApproveProduct = function(req,res){

 	var productId = req.param("product_id");
 	var msg_payload = {"productId":productId,"functionName":"doApproveProduct"};

 	mq_client.make_request('AdminQueue', msg_payload, function (err, results) {
	    console.log(results);
	    if (err) {
	      throw err;
	    }
	    else {
	      if (results.statusCode == 200) {
	        console.log("value inserted");
	        res.send(results);
	      }

	      else {
	        var json_response={"statusCode":401};
	        res.send(json_response)

	      }
	    }


	  });
 }

 exports.doRejectProduct = function(req,res){
	var productId = new require('mongodb').ObjectID(req.param("product_id"));
	var msg_payload = {"productId":productId , "functionName" : "doRejectProduct"};

 	mq_client.make_request('AdminQueue', msg_payload, function (err, results) {
	    console.log(results);
	    if (err) {
	      throw err;
	    }
	    else {
	      if (results.statusCode == 200) {
	        console.log("value inserted");
	        res.send(results);
	      }

	      else {
	        var json_response={"statusCode":401};
	        res.send(json_response)

	      }
	    }


	  });

 }

//------------------Reveiw----------------------------

exports.doShowAllCustomer = function(req,res){

	var msg_payload = {"functionName" : "doShowAllCustomer"};

	mq_client.make_request('AdminQueue', msg_payload, function (err, results) {
	    console.log(results);
	    if (err) {
	      throw err;
	    }
	    else {
	      if (results.statusCode == 200) {
	        console.log("value inserted");
	        res.send(results);
	      }

	      else {
	        var json_response={"statusCode":401};
	        res.send(json_response)

	      }
	    }


	  });

}

exports.reviewFarmer = function(req, res) {
	var user_id = req.session.userId;
	var msg_payload = {"functionName" : "reviewFarmer"};

	mq_client.make_request('AdminQueue', msg_payload, function (err, results) {
	    console.log(results);
	    if (err) {
	      throw err;
	    }
	    else {
	      if (results.statusCode == 200) {
	        console.log("value inserted");
	        res.send(results);
	      }

	      else {
	        var json_response={"statusCode":401};
	        res.send(json_response)

	      }
	    }


	  });

 };

 exports.reviewProduct = function(req, res) {

	var msg_payload = {"functionName" : "reviewProduct"};


	mq_client.make_request('AdminQueue', msg_payload, function (err, results) {
	    console.log(results);
	    if (err) {
	      throw err;
	    }
	    else {
	      if (results.statusCode == 200) {
	        console.log("value inserted");
	        res.send(results);
	      }

	      else {
	        var json_response={"statusCode":401};
	        res.send(json_response)

	      }
	    }


	  });

 };

//FETCH ALL BILLS
exports.fetchAllBills = function(req, res){
var billId=req.param("billId");


  if(req.param("billId")){
    var billId = req.param("billId");
	  console.log("billid"+billId);
    var queryJSON = { BILL_ID : Number(billId)};
  } else {
    var queryJSON = {};
  }
	var msg_payload={"queryJSON":queryJSON,"functionName" : "fetchAllBills"};

	mq_client.make_request('AdminQueue', msg_payload, function (err, results) {
		console.log(results);
		if (err) {
			throw err;
		}
		else {
			if (results.statusCode == 200) {
				console.log("value fetched");
				res.send(results);
			}

			else {
				var json_response={"statusCode":401};
				res.send(json_response)

			}
		}


	});




};

//FETCH ALL TRIPS

exports.showDeliveriesStat = function(req,res){
	var msg_payload={"functionName" : "showDeliveriesStat"};
	 var queryJSON = {};

	mq_client.make_request('AdminQueue', msg_payload, function (err, results) {
		console.log(results);
		if (err) {
			throw err;
		}
		else {

				console.log("delivery stats");
				res.send(results);

		}


	});

}


//FETCH DAILY Revenue
exports.fetchDailyRevenue = function(req, res){
  var month = req.param("chartMonth");
  //var month = "04";
  var start = "2016-" + month + "-01T00:00:00.000+0000";
  var end = "2016-" + month + "-31T00:00:00.000+0000";

  var queryJSON = {BILLING_DATE: { $gte:new Date(start), $lt: new Date(end) }};
  var projectionJSON = { _id : 0, BILLING_DATE : 1, TOTAL_AMOUNT : 1 };

  mongo.findWithProjection("BILLING_INFORMATION", queryJSON, projectionJSON, function(err, results){
    if(err){
      console.log(err);
    } else {

      var currentAmount = 0;
      var catArray = [];
      var valArray = [];
      var average = 0;
      var found = false;
      var i = 1;
      for(i=1; i<=31; i++){

        catArray.push({
            "label": "'" + i + "'"
        });

        for (j=0; j<results.length; j++) {
          var d = new Date(results[j].BILLING_DATE);
            if(d.getDate() == i){
              currentAmount = currentAmount + results[j].TOTAL_AMOUNT;
            }
        }

        valArray.push({
          "value" : currentAmount
        });
        average = average + currentAmount
        currentAmount = 0;
      }

      average = average/i;
      var jsonResponse = {
        "statusCode" : 200,
        "catArray" : catArray,
        "valArray" : valArray,
        "average" : average
      };
      res.send(jsonResponse);
    }
  });
};
