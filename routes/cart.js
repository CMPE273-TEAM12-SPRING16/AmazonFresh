var mongo = require("./mongo");
var mysql = require("./mysql");

exports.addToCart = function(req,res)
{
	productId = req.param("productId");

	mongo.findOneUsingId("PRODUCTS",productId,function (err, results) {
        if (err) {
        console.log(err);
        }
        else {

        	productName = results.PRODUCT_NAME;
        	price = results.PRICE;
        	fileName = results.FILE_NAME; //change filename
        	qty = 1;

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
							        	res.send(jsonResponse);
							        }
		    					});
		    					break;

			        		}
			        	}
			        	if(i==cartProductDetails.length && !found)
			        	{
			        		var newJSON = {"PRODUCT_ID" : productId,"PRODUCT_NAME" : productName,"PRICE" : price,"QTY" : qty,"FILE_NAME" : fileName};
			        		cartProductDetails[i] = newJSON;

			        		console.log("add new product to cart");
			        		updateJSON = {"CART_PRODUCTS" : cartProductDetails};
			        		mongo.updateOne('CART',{ "USER_ID" : req.session.userId },{$set : updateJSON},function (err, updateResults) {
						        if (err) {
						        console.log(err);
						        }
						        else {
						        	var jsonResponse = {"statusCode":200};
						        	res.send(jsonResponse);
						        }
	    					});
			        	}

			        }
			        else if(cartProductDetails.length == 0)
			        {
			         		var newJSON = {"PRODUCT_ID" : productId,"PRODUCT_NAME" : productName,"PRICE" : price,"QTY" : qty,"FILE_NAME" : fileName};
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
						        	res.send(jsonResponse);
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
			        																		"FILE_NAME" : fileName}]};
						mongo.insertOne('CART',insertCartJSON,function (err, results) {
					        if (err) {
					        console.log(err);
					        }
					        else {
					        	var jsonResponse = {"statusCode":200};
					        	res.send(jsonResponse);
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
	mongo.updateOne('CART',{"USER_ID" : req.session.userId},{$pull : { "CART_PRODUCTS" : req.param("product")}},function (err, results) {
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
		mongo.updateOne('CART',{"USER_ID" : req.session.userId},{$pull : { "CART_PRODUCTS" : req.param("product")}},function (err, results) {
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
	var address = req.param("address");
	var city = req.param("city");
	var state= req.param("state");
	var zip = req.param("zip");
	var phone = req.param("phone");
	var products = req.param("products");
	var totalAmount = 0;

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
						"TOTAL_AMOUNT" : totalAmount,
						"CUSTOMER_ID" : req.session.userId,
						"CUSTOMER_NAME" : req.session.firstName +" "+req.session.lastName
					};

		mongo.insertOne('BILLING_INFORMATION',insertBillJSON,function (err, results) {
																					if (err) {
																					        console.log(err);
																						}
																					    else {
																					    	var jsonResponse = {"statusCode":200};
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

																				mongo.updateOne('DELIVERY_HISTORY',{"FARMER_ID" : farmerId}
																												  ,{$push : insertFarmerDetailsJSON}
																												  ,function (err, results) {
																					if (err) {
																					        console.log(err);
																						}
																					    else {
																					    	console.log("purchase history inserted");
																					    }});


			});
		}

		mongo.removeOne('CART',{"USER_ID" : req.session.userId},unction (err, results) {
																					if (err) {
																					        console.log(err);
																						}
																					    else {
																					    	console.log("cart cleared");
																					    }});

	});

}