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
					updateDiscount(cartProductDetails[j],results[i].USER_ID,diffDays);

				}
					
				}
			}

		});

    console.info('Cron done');
}

function updateDiscount(cartProductDetails,userId,diffDays)
{
	mongo.findOneUsingId('PRODUCTS',cartProductDetails.PRODUCT_ID,function(errFind,resultsFind){

						if(diffDays>3 && resultsFind.PRICE <= cartProductDetails.PRICE)
						{
							
							cartProductDetails.PRICE = cartProductDetails.PRICE - cartProductDetails.PRICE * 0.1; 
							updateJSON = {"CART_PRODUCTS.$.PRICE" : cartProductDetails.PRICE};
							mongo.updateOne('CART',{ "USER_ID" : userId,"CART_PRODUCTS.PRODUCT_ID" : cartProductDetails.PRODUCT_ID}
												,{$set : updateJSON},function(err, updateResults){

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
							
						console.log(JSON.stringify(cartProductDetails.PRICE));
					});

}