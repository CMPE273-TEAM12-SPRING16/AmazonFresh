/**
 * Created by aneri on 18-04-2016.
 */
var ejs = require('ejs');
var mongo = require('./mongo');
var multer = require('multer');
uploadFilename = "";

var storage = multer.diskStorage({ //multers disk storage settings
        destination: function (req, file, cb) {
            cb(null, './public/uploads/');
        },
        filename: function (req, file, cb) {
            var datetimestamp = Date.now();
            uploadFilename = file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1];
            console.log("File name"+uploadFilename);
            cb(null, uploadFilename);
        }
    });

var upload = multer({ //multer settings
                    storage: storage
                }).single('file');



exports.addProduct = function(req, res)
{
    res.render('addProduct');
}




exports.doAddProduct = function(req,res)
{
	var callbackFunction = function(err, results) {
		if(err)
		{
			throw err;
			json_responses = {"statusCode" : 401};
			console.log("Error in renderHomepage");
			res.send(json_responses);
		}
		else
		{
			json_responses = {"statusCode" : 200,"results":results};
			console.log("result is:"+results);
			res.send(json_responses);
		}
	};



	upload(req,res,function(err){
            if(err){
                	console.log("code has some errors");
                 return err;
            }
             else
             	{

             		var productName = req.param("productName");
					var unit = req.param("units");
					var price = req.param("price");
					var productDescription = req.param("productDescription");
					var farmerFirstName = req.session.firstName;
					var farmerLastName = req.session.lastName;
					var farmerId = req.session.userId;
					var noOfUnits = req.param("noOfunits");
             		console.log("File uploaded successfully"+noOfUnits);

					var ingredients = req.param("ingredients");

             		console.log("File uploaded successfully");

             			var insertJSON = {"PRODUCT_NAME" : productName,
						"FARMER_ID" : farmerId,
						"FARMER_FIRST_NAME" : farmerFirstName,
						"FARMER_LAST_NAME" : farmerLastName,
						"PRICE" : price,
						"NOOFUNITS" : noOfUnits,
						"UNIT" : unit,
						"PRODUCT_DESCRIPTION" : productDescription,
						"FILE_NAME" : uploadFilename,
						"IS_APPROVED" : 0
						};
             		mongo.insertOne('PRODUCTS',insertJSON,callbackFunction);
             	}
        });
};

exports.doEditProduct = function(req,res)
{
	var callbackFunction = function(err, results) {
		if(err)
		{
			throw err;
			json_responses = {"statusCode" : 401};
			console.log("Error in renderHomepage");
			res.send(json_responses);
		}
		else
		{
			json_responses = {"statusCode" : 200,"results":results};
			console.log("result is:"+results);
			res.send(json_responses);
		}
	};


	console.log("Edit Product");
	upload(req,res,function(err){
            if(err){
                	console.log("code has some errors");
                 return err;
            }
             else
             	{
             		var productId = new require('mongodb').ObjectID(req.param("productId"));
             		var productName = req.param("productName");
					var unit = req.param("units");
					var price = req.param("price");
					var productDescription = req.param("productDescription");
					var farmerId = req.session.user_id;
					var noOfUnits = req.param("noOfunits");
             		console.log("File uploaded successfully"+noOfUnits);

					var updatedWhereJSON = {"_id" : productId};
					var updatedDetailJSON = {$set : {
						"PRODUCT_NAME" : productName,
						"FARMER_ID" : farmerId,
						"PRICE" : price,
						"NOOFUNITS" : noOfUnits,
						"UNIT" : unit,
						"PRODUCT_DESCRIPTION" : productDescription,
						"filename" : uploadFilename
					}
		};
					mongo.updateOne('PRODUCTS',updatedWhereJSON,updatedDetailJSON,callbackFunction);
             	}
        });
};

exports.doDeleteProduct = function(req,res){
	console.log("product.doDeleteProduct");
	var product_id = new require('mongodb').ObjectID(req.param("product_id"));
		console.log("product_id "+product_id);
	var deleteProductJSON = {"_id" : product_id};
	var callbackFunction = function(err, results) {
		if(err)
		{
			throw err;
			json_responses = {"statusCode" : 401};
			console.log("Error in renderHomepage");
			res.send(json_responses);
		}
		else
		{
			json_responses = {"statusCode" : 200,"results":results};
			console.log("result is:"+results);
			res.send(json_responses);
		}
	}
		mongo.removeOne('PRODUCTS',deleteProductJSON,callbackFunction);

};

exports.doSearch = function(req, res){

  var searchString = req.param("searchString");

  mongo.searchIt('PRODUCTS', searchString, function(err,searchRes){

    if(err){
      throw err;
    }
    else
    {
      if(searchRes){
        console.log("product.js : doSearch() --> " + searchRes);
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

exports.productHome = function(req, res)
{
	res.render('productHome');
}

exports.getProductId=function(req,res)
{

	var productId = req.param("id");
	console.log(productId);
	ejs.renderFile('./views/productHome.ejs',{sendProductId:productId},function(err, results) {
		if (!err) {
			res.end(results);
		}
		else{
			console.log("entered");
		}
	});
}

exports.getProductDetails=function(req,res)
{

	var productId = req.param("productId");
	var callbackFunction = function (err, results) {

		if (err) {
			console.log(err);
		}
		else {
			
			var reviews = getDateAndMonth(results);
			console.log("Updated date");
			//console.log(reviews);
			res.send({"productDetails":results});
		}
	}
	mongo.findOneUsingId("PRODUCTS", productId, callbackFunction);
}

function getDateAndMonth(results){
	console.log("getDateAndMonth");
	var monthName = ['January','February','March','April','May','June','July','August','September','October','November','December'];
	var reviewArr = results.REVIEW_DETAILS;
	for(var rev in results.REVIEW_DETAILS){
		var date = results.REVIEW_DETAILS[rev].TIMESTAMP;
		var d = new Date(date);
		var month = monthName[d.getMonth()];
		var day = d.getDate();
		var year = d.getFullYear();
		var reviewDate = month+" "+day+", "+year;
		console.log(reviewDate);
		results.REVIEW_DETAILS[rev].REVIEWDATE = reviewDate;
		
	}
	return results;
}

exports.doFetch10Products = function(req,res){

  getProductJSON = {};
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

    mongo.find('PRODUCTS',getProductJSON,callbackFunction);

}


exports.addProductReview = function(req,res){
	var product_id = new require('mongodb').ObjectID(req.param("product_id"));
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
 	var productWhereJSON = {"_id" : product_id};
	var productSetJSON = {$push : {"REVIEW_DETAILS" : reviewJSON}};
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
			console.log("---->>>>"+results);
			var updateAvgRating = {$set : {"AVG_RATING" : avg}};
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
    mongo.updateOne('PRODUCTS',productWhereJSON,productSetJSON,callbackFunction);
}
