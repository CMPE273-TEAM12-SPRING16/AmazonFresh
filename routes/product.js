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

					var farmerId = req.session.user_id;
					var noOfUnits = req.param("noOfunits");
             		console.log("File uploaded successfully"+noOfUnits);

					var ingredients = req.param("ingredients");
					var farmerId = 6;

             		console.log("File uploaded successfully");

             			var insertJSON = {"PRODUCT_NAME" : productName,
						"FARMER_ID" : farmerId,
						"PRICE" : price,
						"NOOFUNITS" : noOfUnits,
						"UNIT" : unit,
						"PRODUCT_DESCRIPTION" : productDescription,
						"filename" : uploadFilename
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
			console.log(results.PRODUCT_NAME);
			var farmerId = {"USER_ID":results.FARMER_ID};

			var callbackFunction = function (err, result) {
				var json_responses;

				if (err) {
					console.log(err);
				}
				else {
					var farmerName=result.FIRST_NAME+" "+ result.LAST_NAME;
					res.send({"productDetails":results,"farmerName":farmerName});
				}
			}
			mongo.findOne("USER_DETAILS",farmerId, callbackFunction);
		}
	}
	mongo.findOneUsingId("PRODUCTS", productId, callbackFunction);
}
