
var express = require('express')
  ,  app = express()
	, http = require('http').Server(app)
  , io = require('socket.io')(http) //socket Implementation
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
var passport = require('passport');
require('./routes/passport')(passport);

app.use(expressSession({
	secret: 'fjklowjafnkvnap',
    resave: false,
    saveUninitialized: false,
	duration: 30 * 60 * 1000,
	activeDuration: 5 * 60 * 1000,
	store: new mongoStore({
		url: mongoSessionConnectURL
	})
}));
app.use(passport.initialize());
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
});
app.post('/', function(req, res){
	res.render('index', {});
});

app.get('/newSignUpCustomer', function(req, res){
	res.redirect('/#newSignUpCustomer');
});
app.get('/newSignUpFarmer', function(req, res){
	res.redirect('/#newSignUpFarmer');
});

app.get('/product', function(req, res){
  res.render('productHome', {});
});

app.get('/checkout', function(req, res){
	res.render('checkout', {});
});

app.get('/signup',users.signup);
app.get('/login',users.login);
app.get('/farmerHome',users.farmerHome);
app.get('/redirectToHomepage',users.redirectToHomepage);

app.get('/productHome',product.productHome);

app.get('/signup',users.signup);
app.get('/farmerSignup', users.farmerSignup);

app.get('/getCustomerAccountDetails',users.getCustomerAccountDetails);

app.get('/customerAccount', function(req, res){
  res.render('customerAccount', {});
});


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



app.get('/reviewCustomer', function(req, res){
  res.render('adminTemplates/reviewCustomer', {});
});
app.get('/reviewFarmer', function(req, res){
  res.render('adminTemplates/reviewFarmer', {});
});
app.get('/reviewProduct', function(req, res){
  res.render('adminTemplates/reviewProduct', {});
});



app.get('/deliveryDetailsCheckout', function(req, res){
  res.render('checkOutTemplates/deliveryDetails', {});
});
app.get('/paymentDetailsCheckout', function(req, res){
  res.render('checkOutTemplates/paymentDetails', {});
});
app.get('/reviewDetailsCheckout', function(req, res){
  res.render('checkOutTemplates/reviewDetails', {});
});
app.get('/confirmDetailsCheckout', function(req, res){
  res.render('checkOutTemplates/confirmDetails', {});
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
app.post('/minusQtyInCart',cart.minusQtyInCart);
app.post('/doLogin',users.doLogin);
app.post('/doSignup',users.doSignup);
app.post('/getLoggedInUserDetails',users.getLoggedInUserDetails);
app.post('/doSearch', product.doSearch);
app.post('/doUpdateUserDetails',users.doUpdateUserDetails);


//----Admin Module for Notification :  Customer-----
app.post('/doShowPendingCustAprroval',admin.doShowPendingCustAprroval);
app.post('/doApproveCustomer',admin.doApproveCustomer);
app.post('/doRejectCustomer',admin.doRejectCustomer);

//----Admin Module for Notification : Farmer-----
app.post('/doShowPendingFarmerAprroval',admin.doShowPendingFarmerAprroval);
app.post('/doApproveFarmer',admin.doApproveFarmer);
app.post('/doRejectFarmer',admin.doRejectFarmer);

//------Admin Module for Notification : Products ----
app.post('/doShowPendingProductAprroval',admin.doShowPendingProductAprroval);
app.post('/doApproveProduct',admin.doApproveProduct);
app.post('/doRejectProduct',admin.doRejectProduct);


//----Admin Module for Review :  Customer-----
app.post('/doShowAllCustomer',admin.doShowAllCustomer);
// app.post('/doApproveCustomer',admin.doApproveCustomer);
// app.post('/doRejectCustomer',admin.doRejectCustomer);
app.post('/reviewFarmer',admin.reviewFarmer);
//----Admin Module for Reveiw : Farmer-----
// app.post('/doShowPendingFarmerAprroval',admin.doShowPendingFarmerAprroval);
// app.post('/doApproveFarmer',admin.doApproveFarmer);
// app.post('/doRejectFarmer',admin.doRejectFarmer);
app.post('/reviewProduct',admin.reviewProduct);
//------Admin Module for Review : Products ----
// app.post('/doShowPendingProductAprroval',admin.doShowPendingProductAprroval);
// app.post('/doApproveProduct',admin.doApproveProduct);
// app.post('/doRejectProduct',admin.doRejectProduct);


app.get('/productList', function(req, res){
  res.render('farmerTemplate/productList', {});
});

app.get('/myProfile', function(req, res){
  res.render('farmerTemplate/editFarmerDetails', {});
});

app.get('/addProductTemplate', function(req, res) {
	res.render('farmerTemplate/addProduct', {});
})

app.post('/getProductDetails',product.getProductDetails);
app.get('/products/:id',product.getProductId);
app.post('/doFetch10ProductsOnIndex', product.doFetch10Products);
app.post('/addProductReview', product.addProductReview);


//Socket inplementation
io.on('connection',function(socket){
  console.log("a user is connected");
  socket.on("test",function(data){
    console.log(data);
  });
});

app.get('/doLogin',isAuthenticated,users.doLogin);

function isAuthenticated(req, res, next) {
  if(req.session.userId) {
    console.log(req.session.userId);
    return next();
  }

  res.redirect('/');
};


app.get('/:error',function(req, res){
  res.render('error');
});
app.post('/:error',function(req, res){
  res.render('error');
});
http.listen(app.get('port'), function(){
	console.log('AmazonFresh Node-Server listening on port ' + app.get('port'));
});
