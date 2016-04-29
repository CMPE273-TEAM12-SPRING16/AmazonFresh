var mongo = require("./mongo");


exports.processDiscount =  function(){
    
	mongo.find('CART',{},function(err, results){
		var now = new Date();
		
		for(var i=0;i<results.length;i++)
		{
			var updateCART = false;
			var cartProductDetails = results[i].CART_PRODUCTS;
			if(cartProductDetails)
			{
				for(var j=0;j<cartProductDetails.length;j++)
				{
					var addedDate = cartProductDetails[j].INSERTION_DATE;
					var timeDiff = Math.abs(now.getTime() - addedDate.getTime());
					var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 

					if(diffDays>3)
					{
						console.log(cartProductDetails[j].PRODUCT_ID);
						// var productId = cartProductDetails[j].PRODUCT_ID.copy();
						var productId = JSON.parse(cartProductDetails[j]);
						console.log(productId);
						mongo.findOneUsingId('PRODUCTS',productId,function(errResults, searchResults){
							if(errResults)
							{
								console.log(errResults);
							}
							else
							{
								console.log(JSON.stringify(cartProductDetails[j]));
								console.log(searchResults.PRICE+"price is");
							//if(searchResults.PRICE==cartProductDetails[j].PRICE)
							//{
								cartProductDetails[j].PRICE = cartProductDetails[j].PRICE - cartProductDetails[j].PRICE * 0.1 ;
								updateCART = false;	
							//}
							}
						});
						console.log(JSON.stringify(cartProductDetails[j].PRICE));
					}


				}
				if(updateCART)
				{
					updateJSON = {"CART_PRODUCTS" : cartProductDetails};
					mongo.updateOne('CART',{ "USER_ID" : results[i].USER_ID },{$set : updateJSON},function(err, updateResults){

							if(err)
							{
								console.log(err);
							}
							else
							{
								console.log("records updated successfully");
							}
						});
				}
			}

		}
	});

    console.info('Cron done');
}