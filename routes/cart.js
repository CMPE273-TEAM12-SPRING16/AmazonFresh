var mongo = require("./mongo");
var mysql = require("./mysql");
var geocoderProvider = 'google';
var ejs = require("ejs");
var httpAdapter = 'https';
var extra = {
	apiKey: 'AIzaSyD8Tz_zXflokyLiIqLdW02Oj5Y44T_GCCs',
	  formatter: null
	};
exports.addToCart = function(req,res)
{
	productId = req.param("productId");

	mongo.findOneUsingId("PRODUCTS",productId,function (err, results) {
        if (err) {
        console.log(err);
        }
        else {

        	var productName = results.PRODUCT_NAME;
        	var price = results.PRICE;
        	var fileName = results.FILE_NAME; //change filename
        	var qty = 1;
        	var insertionDate = new Date();

			var productDetails={"productName":productName,"price":price,"fileName":fileName,"qty":qty};

        	mongo.findOne("CART",{"USER_ID":req.session.userId},function (cartErr, cartResults) {
        		console.log("Cart Results"+JSON.stringify(cartResults));

		        if(cartResults)
		        {
		        	console.log("reached 1");
		        	var cartProductDetails = cartResults.CART_PRODUCTS;
		        	console.log("Length cartProductDetails"+cartProductDetails.length);
			        if (cartProductDetails.length>0)
			        {

			        	console.log("reached 2");
			        	var i = 0;
			        	var found = false;
			        	for( ; i<cartProductDetails.length;i++)
			        	{
			        		if(cartProductDetails[i].PRODUCT_ID == productId)
			        		{
			        			cartProductDetails[i].QTY = cartProductDetails[i].QTY + 1;
			        			console.log("found the same one");
			        			found =true;
			        			updateJSON = {"CART_PRODUCTS" : cartProductDetails};
				        		mongo.updateOne('CART',{ "USER_ID" : req.session.userId },{$set : updateJSON},function (err, updateResults) {
							        if (err) {
							        console.log(err);
							        }
							        else {
							        	var jsonResponse = {"statusCode":200};
							        	console.log("Updated database successfully");
							        	res.send(jsonResponse,productDetails);
							        }
		    					});
		    					break;

			        		}
			        	}
			        	if(i==cartProductDetails.length && !found)
			        	{
			        		var newJSON = {"PRODUCT_ID" : productId,
			        						"PRODUCT_NAME" : productName,
			        						"PRICE" : price,
			        						"QTY" : qty,
			        						"FILE_NAME" : fileName,
			        						"INSERTION_DATE":new Date()};
			        		cartProductDetails[i] = newJSON;

			        		console.log("add new product to cart");
			        		updateJSON = {"CART_PRODUCTS" : cartProductDetails};
			        		mongo.updateOne('CART',{ "USER_ID" : req.session.userId },{$set : updateJSON},function (err, updateResults) {
						        if (err) {
						        console.log(err);
						        }
						        else {
						        	var jsonResponse = {"statusCode":200};
						        	res.send(jsonResponse,productDetails);
						        }
	    					});
			        	}

			        }
			        else if(cartProductDetails.length == 0)
			        {
			         		var newJSON = {"PRODUCT_ID" : productId,
			         						"PRODUCT_NAME" : productName,
			         						"PRICE" : price,"QTY" : qty,
			         						"FILE_NAME" : fileName,
			         						"INSERTION_DATE":new Date()};
			        		cartProductDetails[0] = newJSON;

			        		console.log("add new product to cart");
			        		updateJSON = {"CART_PRODUCTS" : cartProductDetails};
			        		console.log("cart product:"+JSON.stringify(updateJSON));
			        		mongo.updateOne('CART',{ "USER_ID" : req.session.userId },{$set : updateJSON},function (err, updateResults) {
						        if (err) {
						        console.log(err);
						        }
						        else {
						        	var jsonResponse = {"statusCode":200};
						        	res.send(jsonResponse,productDetails);
						        }
	    					});
			        }
		    	}
		        else{
		        	console.log(cartErr);
		        	console.log("add new product to cart");
		        	insertCartJSON = {"USER_ID" : req.session.userId, "CART_PRODUCTS" : [{"PRODUCT_ID" : productId ,
			        																		"PRODUCT_NAME" : productName,
			        																		"PRICE" : price,
			        																		"QTY" : qty,
			        																		"FILE_NAME" : fileName,
			        																		"INSERTION_DATE":new Date()}]};
						mongo.insertOne('CART',insertCartJSON,function (err, results) {
					        if (err) {
					        console.log(err);
					        }
					        else {
					        	var jsonResponse = {"statusCode":200};
					        	res.send(jsonResponse,productDetails);
					        }
	    				});
		        }
    		});

		}
     });

}


exports.getCartDetails = function(req,res)
{
	mongo.findOne('CART',{"USER_ID" : req.session.userId},function (err, results) {
					        if (err) {
					        console.log(err);
					        }
					        else {
					        	var jsonResponse = {"statusCode":200,"results":results};
					        	res.send(jsonResponse);
					        }
	    				});
}

exports.removeItemFromCart = function(req,res)
{
	console.log(JSON.stringify(req.param("product")));
	mongo.updateOne('CART',{"USER_ID" : req.session.userId},{$pull : { "CART_PRODUCTS" : {"PRODUCT_ID" : req.param("product").PRODUCT_ID }}},function (err, results) {
																					        if (err) {
																					        console.log(err);
																					        }
																					        else {
																					        	var jsonResponse = {"statusCode":200};
																					        	res.send(jsonResponse);
																					        }
																	    				}
	);
}


exports.minusQtyInCart = function(req,res)
{
	var productOld = req.param("product");
	var product = productOld.constructor();

	for (var attr in productOld) {
        if (productOld.hasOwnProperty(attr)) product[attr] = productOld[attr];
    }

    product.QTY -= 1;

    if(productOld.QTY != 1)
	{
		mongo.updateOne('CART',{"USER_ID" : req.session.userId ,"CART_PRODUCTS" : productOld},{$set : { "CART_PRODUCTS.$" : product}},function (err, results) {
																					        if (err) {
																					        console.log(err);
																					        }
																					        else {
																					        	var jsonResponse = {"statusCode":200};
																					        	res.send(jsonResponse);
																					        }
																	    				}
		);
	}
	else
	{
		mongo.updateOne('CART',{"USER_ID" : req.session.userId},{$pull : { "CART_PRODUCTS" : {"PRODUCT_ID" : req.param("product").PRODUCT_ID }}},function (err, results) {
																					        if (err) {
																					        console.log(err);
																					        }
																					        else {
																					        	var jsonResponse = {"statusCode":200};
																					        	res.send(jsonResponse);
																					        }
																	    				}
		);
	}

}

exports.doOrder = function(req,res)
{
	var name = req.param("name");
	var userId = req.session.userId
	var address = req.param("address");
	var city = req.param("city");
	var state= req.param("state");
	var zip = req.param("zip");
	var phone = req.param("phone");
	var deliveryDate = req.param("deliveryDate");
	var products = req.param("products");
	console.log("Products --->> ");
	console.log(products);
	var totalAmount = 0;
	var cust_lat,cust_long,sourceLocJSON;
	var cust_address = address+" ,"+city+" ,"+state+" "+zip;
	var geocoder = require('node-geocoder')(geocoderProvider,httpAdapter,extra);
	geocoder.geocode( { 'address': address}, function(err, results) {

      								cust_lat = results[0].latitude;
      								cust_long = results[0].longitude;

      								sourceLocJSON = {"ADDRESS": address,"LATITUDE" : cust_lat,"LONGITUDE" : cust_long};
      								console.log('---->>>>SOURCE LOCATION SET');

     });

	console.log("products"+JSON.stringify(products));
	for(var i=0;i<products.length;i++)
	{
		console.log("TOTAL_AMOUNT "+totalAmount+" price "+products[i].PRICE+" qty "+products[i].QTY);
		totalAmount += products[i].PRICE * products[i].QTY;
	}

	console.log("Total amount"+totalAmount);
	paymentJSON = {"BILLING_DATE": new Date(),
					"CUSTOMER_ID" : req.session.userId,
					"IS_PAYMENT_DONE": 1,
					"STATUS" : 1,
					"TOTAL_AMOUNT" : totalAmount};

	var query = "INSERT INTO PAYMENTS SET ? " ;
	var farmerIds = [];
	var farmerIdsByUse = {};
	mysql.insertData(query , paymentJSON ,function (err, results) {

		var billId = results.insertId;

		var insertBillJSON = {"BILL_ID" : billId,
					  	"BILLING_DATE" : new Date(),
					  	"PRODUCTS" : products,
					  	"ADDRESS" : address,
					  	"CITY" : city,
						"STATE" : state,
						"ZIP" : zip,
						"PHONE" : phone,
						"DELIVERY_DATE" : deliveryDate,
						"TOTAL_AMOUNT" : totalAmount,
						"CUSTOMER_ID" : req.session.userId,
						"CUSTOMER_NAME" : req.session.firstName +" "+req.session.lastName
					};

		mongo.insertOne('BILLING_INFORMATION',insertBillJSON,function (err, results) {
																					if (err) {
																					        console.log(err);
																						}
																					    else {
																					    	var jsonResponse = {"statusCode":200,"BILL_ID" : billId};
																					    	res.send(jsonResponse);
																					    }});


		mongo.updateOne('CUSTOMER_DETAILS', {"USER_ID" : req.session.userId}, {$push : {"PURCHASE_HISTORY":insertBillJSON}},function (err, results) {
																					if (err) {
																					        console.log(err);
																						}
																					    else {
																					    	console.log("purchase history inserted");
																					    }});
		for(var i=0;i<products.length;i++)
		{
			mongo.findOneUsingId('PRODUCTS', products[i].PRODUCT_ID,function(err,results){
					farmerId = results.FARMER_ID;
					console.log("Farmer"+farmerId);
					if(!isInArray(farmerId,farmerIds)){
					console.log("Push Farmer");
					farmerIds.push(farmerId);
				}
				var insertFarmerDetailsJSON = {
					"DELIVERY_HISTORY" : {
					"BILL_ID" : billId,
					"BILL_DATE" : new Date(),
					"PRODUCT_ID" : results.PRODUCT_ID,
					"PRODUCT_NAME" : results.PRODUCT_NAME,
					"PRICE" : results.PRICE,
					"QTY" : results.QTY,
					"FILE_NAME" : results.FILE_NAME,
					"CUSTOMER_NAME" : req.session.firstName +" "+req.session.lastName,
					"ADDRESS" : address,
					"CITY" : city,
					"STATE" : state,
					"ZIP" : zip,
					"PHONE" : phone,
					"TOTAL_AMOUNT" : totalAmount,
				}
			}

		mongo.updateOne('FARMER_DETAILS',{"USER_ID" : farmerId}
			,{$push : {"DELIVERY_HISTORY": insertFarmerDetailsJSON}}
			 ,function (err, results) {
				if (err) {
					console.log(err);
				}
				else {
					console.log("purchase history inserted");
					console.log("---->>>Farmers");
					var farmerJSON = {"USER_ID" : {$in : farmerIds}}
					mongo.find('USER_DETAILS',farmerJSON,function(err,results){
						if(err){
							console.log(err);
						}
						else{
							console.log(results);
							var deliveryDate = new Date();
							deliveryDate.setDate(deliveryDate.getDate() + 1);

							Object.keys(results).forEach(function(index){
								console.log("ADDRESS "+results[index].ADDRESS);
								var address = results[index].ADDRESS+", "+results[index].CITY+" ,"+results[index].STATE+" "+results[index].ZIP
  								geocoder.geocode( { 'address': address}, function(err, results) {
  									console.log(results);
      								var latitude = results[0].latitude;
      								var longitude = results[0].longitude;
      								console.log(latitude, longitude);
      								console.log(sourceLocJSON);
      								var destLocJSON = {"ADDRESS": address,"LATITUDE" : latitude, "LONGITUDE": longitude};
      								var insertTripJSON = {
      									"TRUCK_ID" : 1,
      									"DRIVER_ID" : 1,
      									"SOURCE_LOC" : sourceLocJSON,
      									"DESTINATION_LOC" : destLocJSON,
      									"DELIVERY_DATE" : deliveryDate,
      									"CUSTOMER_ID" : userId,
      									"BILLING_ID" : billId

      								}
      								mongo.insertOne('TRIP_DETAILS',insertTripJSON,function(err,tripResults){
      									if(err){
      										console.log(err);
      									}
      									else{
      										console.log("Trip inserted");
      									}
      								});
      							});
      						});
  						}
				});
		 }});
		});
	}

		mongo.removeOne('CART',{"USER_ID" : req.session.userId},function (err, results) {
																					if (err) {
																					        console.log(err);
																						}
																					    else {
																					    	console.log("cart cleared");
																					    }});
				});

}


function getLocation(address) {



}

function isInArray(value, array) {
  return array.indexOf(value) > -1;
}

exports.doTrackOrder = function(req,res){

	var billId = req.param("billId");
	ejs.renderFile('./views/trackOnMap.ejs',{billId:billId},function(err, results) {
		if (!err) {
			res.end(results);
		}
		else{
			console.log("entered");
		}
	});
}

exports.getTrackOrder = function(req,res){
		var billId = Number(req.param("billId"));
		console.log("Billing id "+billId);
		var tripJSON = {"BILLING_ID" : billId};
		mongo.find('TRIP_DETAILS',tripJSON,function(err,results){
		if(err){
	 		console.log(err);
	 	}
	 	else{

	 		json_responses = {"statusCode" : 200,"TRIP_DETAILS":results};
	 		res.send(json_responses);
	 	}
	 });
}
