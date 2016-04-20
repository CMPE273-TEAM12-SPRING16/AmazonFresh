/**
 * Created by aneri on 18-04-2016.
 */
var ejs = require('ejs');
var mongo = require('./mongo');
var multer = require('multer');
uploadFilename = "";

var storage = multer.diskStorage({ //multers disk storage settings
        destination: function (req, file, cb) {
            cb(null, './uploads/');
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
    res.render('addproduct');
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
					var unit = req.param("unit"); 
					var price = req.param("price"); 
					var productDescription = req.param("productDescription"); 
					var ingredients = req.param("ingredients");
					var farmerId = "1";

             		console.log("File uploaded successfully");
             			var insertJSON = {"PRODUCT_NAME" : productName,
						"FARMER_ID" : farmerId,
						"PRICE" : price,
						"UNIT" : unit,
						"PRODUCT_DESCRIPTION" : productDescription,
						"INGREDIENTS" : ingredients,
						"filename" : uploadFilename
						};
             		mongo.insertOne('PRODUCTS',insertJSON,callbackFunction);
             	}
        });


}