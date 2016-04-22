/**
 * Created by aneri on 17-04-2016.
 */
var ejs = require('ejs');
var mysql = require('./mysql');
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/amazon_fresh";

function signup(req, res) {
  res.render('signup');

};

function login(req, res) {
  res.render('login');

};


function doLogin(req, res) {

  var email = req.param("email");
  var password = req.param("password");

console.log(email);
  var  getLoginDetails = "SELECT * FROM USERS WHERE EMAIL='" + email + "' AND PASSWORD='" + password + "'";

  mysql.fetchData(function (err, results) {

    if (results.length > 0)
    {
      console.log(results);
      console.log(results[0].USERTYPE);

      req.session.email = results[0].EMAIL;
      req.session.userType = results[0].USERTYPE;
      req.session.userId = results[0].USER_ID;
      console.log("valid Login");
      
      var callbackFunction = function(err,resultsMongo) 
      {
        if(resultsMongo)
        {
          console.log(resultsMongo);
          req.session.firstName = resultsMongo.FIRST_NAME;
          req.session.lastName = resultsMongo.LAST_NAME;
          req.session.city = resultsMongo.CITY;
          req.session.address = resultsMongo.ADDRESS;
          req.session.zip = resultsMongo.ZIP;
          req.session.phone = resultsMongo.PHONE_NUMBER;
          req.session.ssn = resultsMongo.SSN;
          var jsonResponse = {"statusCode":200};

          res.send(jsonResponse);
        }
        else
        {
          throw err;
        }
      };


      var queryJSON = {"USER_ID" : req.session.userId};
      mongo.findOne('USER_DETAILS',queryJSON,callbackFunction);
    }

    else
    {
      var jsonResponse={"statusCode":401};
      res.send(jsonResponse);
    }



  }, getLoginDetails);


}
function doSignup(req, res) {

  var firstName=req.param("firstName");
  var lastName=req.param("lastName");
  var ssn=req.param("ssn");
  var email=req.param("email");
  var password=req.param("password");
  var address=req.param("address");
  var city=req.param("city");
  var state=req.param("state");
  var zip=req.param("zip");
  var phone=req.param("phone");
  var userType=req.param("userType");

console.log(email);

  var emailExists = "select email from users where email='" + email + "'";
  mysql.fetchData(function (err, results) {

    if (results.length > 0) {
      console.log("email exists");
      json_responses = {"statusCode": 401};
      res.send(json_responses);


    }
    else {

      var insertSignUpDetails = "insert into users(EMAIL,PASSWORD,USERTYPE) values ('" + email + "','" + password + "','" + userType + "')";
      mysql.fetchData(function (err, results) {

        if (results.affectedRows > 0) {
          console.log(results);
          console.log(results.insertId);
          var userId = results.insertId;
          req.session.userType = userType;
          req.session.user_id = userId;
          console.log("sql values inserted");

          //insert remaining values in mongo

          var userDetails = {
            "USER_ID": userId,
            "FIRST_NAME": firstName,
            "LAST_NAME": lastName,
            "SSN": ssn,
            "ADDRESS": address,
            "CITY": city,
            "STATE": state,
            "ZIP": zip,
            "PHONE_NUMBER": phone,
          };

          var userDetailsCallbackFunction = function (err, results) {
            var json_responses;

            if (err) {
              console.log(err);
            }
            else {

              if(userType==1) {
                var creditCardNumber = req.param("creditCardNumber");
                var creditCardName = req.param("creditCardName");
                var expiryMonth = req.param("expiryMonth");
                var expiryYear = req.param("expiryYear");
                var cvv = req.param("cvv");

                var customerCreditCardDetails = {
                  "USER_ID": userId,
                  CREDIT_CARD_DETAILS:
                {
                  "CREDIT_CARD_NUMBER": creditCardNumber,
                  "CREDIT_CARD_NAME": creditCardName,
                  "EXPIRY_MONTH": expiryMonth,
                  "EXPIRY_YEAR": expiryYear,
                  "CVV": cvv}
                };
                var customerCreditCardDetailsCallbackFunction = function (err, results) {
                  var json_responses;

                  if (err) {
                    console.log(err);
                  }
                  else {
                    console.log("creditCardDetailsInserted");
                  }
                }
                mongo.insertOne("CUSTOMER_DETAILS", customerCreditCardDetails, customerCreditCardDetailsCallbackFunction);
              }

              json_responses = {"statusCode": 200};
              res.send(json_responses);

             //checking for credit card details and entering the details in CREDITCARDTABLE

            }

          }

          mongo.insertOne("USER_DETAILS", userDetails, userDetailsCallbackFunction);
        }
        else {
          console.log("data insertion failed");
        }
      }, insertSignUpDetails);
    }

  }, emailExists);
}

function redirectToHomepage(req,res)
{
  console.log("inside");
  //Checks type of login(customer/admin/farmer) before redirecting and redirects accordingly
  if(req.session.userType==0)
  {
    //Set these headers to notify the browser not to maintain any cache for the page being loaded
    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    res.render("adminHome");
  }
  else if(req.session.userType==1) {
    console.log("inside redirect");
    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    res.render("customerAccount");
  }
  else if(req.session.userType==2)
  {
    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    res.render("farmerHome");
  }
  else {
    res.redirect('/');
  }
};


exports.getLoggedInUserDetails = function(req,res)
{
  var jsonResponse={"statusCode" : 200,
                    "firstName" : req.session.firstName,
                    "lastName" : req.session.lastName,
                    "email" : req.session.email,
                    "city" : req.session.city,
                    "userId" : req.session.userId};
  res.send(jsonResponse);
}


function farmerHome(req,res)
{
res.render('farmerHome');

}

function getCustomerAccountDetails(req,res)
{
  var userId=({USER_ID:req.session.user_id});
  var callbackFunction = function (err, results) {


    if (err) {
      console.log(err);
    }
    else {
      var userName=results.FIRST_NAME;
      var callbackFunction = function (err, result) {

        if (err) {
          console.log(err);
        }
        else {
console.log(results.FIRST_NAME);
          res.send({"userDetails":results,"customerDetails":result,"email":req.session.email});
        }
      }
      mongo.findOne("CUSTOMER_DETAILS",userId, callbackFunction);
    }
  }
  mongo.findOne("USER_DETAILS",userId, callbackFunction);

}

exports.signup=signup;
exports.login=login;
exports.doLogin=doLogin;
exports.doSignup=doSignup;
exports.redirectToHomepage=redirectToHomepage;
exports.farmerHome=farmerHome;
exports.getCustomerAccountDetails=getCustomerAccountDetails;
