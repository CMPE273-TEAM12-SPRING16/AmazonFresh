var mongo = require("./mongo");

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
        	fileName = results.filename; //change filename
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
			        		// cartProductDetails[i].PRODUCT_ID = productId;
			        		// cartProductDetails[i].PRODUCT_NAME = productName;
			        		// cartProductDetails[i].PRICE = price;
			        		// cartProductDetails[i].QTY = 1;
			        		// cartProductDetails[i].FILE_NAME = fileName;

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
			   //      	insertCartJSON = {"USER_ID" : req.session.userId, "CART_PRODUCTS" : {"PRODUCT_ID" : productId ,
			   //      																		"PRODUCT_NAME" : productName,
			   //      																		"PRICE" : price,
			   //      																		"QTY" : qty,
			   //      																		"FILE_NAME" : fileName}};
						// mongo.insertOne("CART",insertCartJSON,function (err, results) {
					 //        if (err) {
					 //        console.log(err);
					 //        }
					 //        else {
					 //        	var jsonResponse = {"statusCode":200};
					 //        	res.send(jsonResponse);
					 //        }
	    	// 			});
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
						mongo.insertOne("CART",insertCartJSON,function (err, results) {
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