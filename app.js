
var express = require('express')
	, http = require('http')
	, path = require('path');

var expressSession = require("express-session");
var bodyParser = require('body-parser');
var mongoStore = require("connect-mongo")(expressSession);
var mongoSessionConnectURL = "mongodb://localhost:27017/amazon_fresh";   //Change this if needed ................................//
var home=require('./routes/home');
var product=require('./routes/product');
var cart=require('./routes/cart');
var farmer = require('./routes/farmer');
var admin = require('./routes/admin');
var users=require('./routes/users');
var app = express();
app.use(expressSession({
	secret: 'fjklowjafnkvnap',
	resave: false,  //don't save session if unmodified
	saveUninitialized: false,	// don't create session until something stored
	duration: 30 * 60 * 1000,
	activeDuration: 5 * 60 * 1000,
	store: new mongoStore({
		url: mongoSessionConnectURL
	})
}));

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));


//All GET methods...........................//
app.get('/', function(req, res){
	res.render('index', {});
});                     // Change this..........................................//

app.get('/product', function(req, res){
  res.render('productHome', {});
});



//app.get('/farmerHome', farmer.farmerHome);
app.get('/signup',users.signup);
app.get('/login',users.login);
app.get('/farmerHome',users.farmerHome);
app.get('/redirectToHomepage',users.redirectToHomepage);
//app.get('/addProduct',product.addProduct);

app.get('/productHome',product.productHome);

app.get('/signup',users.signup);
app.get('/farmerSignup', users.farmerSignup);
app.get('/login',users.login);

app.get('/getCustomerAccountDetails',users.getCustomerAccountDetails);

app.get('/adminHome', function(req, res){
  res.render('adminHome', {});
});
app.get('/apprReqCustomer', function(req, res){
  res.render('adminTemplates/apprReqCustomer', {});
});
app.get('/apprReqFarmer', function(req, res){
  res.render('adminTemplates/apprReqFarmer', {});
});
app.get('/apprReqProduct', function(req, res){
  res.render('adminTemplates/apprReqProduct', {});
});
app.get('/account', function(req, res){
  res.render('customerAccount', {});
});
app.get('/logout',users.logout);


app.post('/doShowProductList',farmer.doShowProductList);
app.post('/doShowProfile',farmer.doShowFarmerProfile);
app.post('/doUpdateProfile',farmer.doUpdateProfile);
//All POST methods.........................//
//app.post('/signUpUser', users.signUpUser);           // Change this..........................................//


app.post('/doAddProduct',product.doAddProduct);
app.post('/doDeleteProduct',product.doDeleteProduct);
app.post('/doEditProduct', product.doEditProduct);
app.post('/addToCart',cart.addToCart);
app.post('/getCartDetails',cart.getCartDetails);
app.post('/removeItemFromCart',cart.removeItemFromCart);
app.post('/doLogin',users.doLogin);
app.post('/doSignup',users.doSignup);
app.post('/getLoggedInUserDetails',users.getLoggedInUserDetails);



//----Admin Module for Customer-----
app.post('/doShowPendingCustAprroval',admin.doShowPendingCustAprroval);
app.post('/doApproveCustomer',admin.doApproveCustomer);
app.post('/doRejectCustomer',admin.doRejectCustomer);

//----Admin Module for Farmer-----
app.post('/doShowPendingFarmerAprroval',admin.doShowPendingFarmerAprroval);
app.post('/doApproveFarmer',admin.doApproveFarmer);
app.post('/doRejectFarmer',admin.doRejectFarmer);

//------Admin Module for Products ----
app.post('/doShowPendingProductAprroval',admin.doShowPendingProductAprroval);
app.post('/doApproveProduct',admin.doApproveProduct);
app.post('/doRejectProduct',admin.doRejectProduct);


app.get('/productList', function(req, res){

  res.render('farmerTemplate/productList', {});
});

app.get('/myProfile', function(req, res){

  res.render('farmerTemplate/editFarmerDetails', {});
});

app.post('/getProductDetails',product.getProductDetails);
app.get('/products/:id',product.getProductId);



app.get('/addProductTemplate', function(req, res) {
	console.log("AddProduct");

})

http.createServer(app).listen(app.get('port'), function(){
	console.log('AmazonFresh Node-Server listening on port ' + app.get('port'));
});
