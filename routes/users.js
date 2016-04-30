/**
 * Created by aneri on 17-04-2016.
 */
var ejs = require('ejs');
const crypto = require('crypto');
var mysql = require('./mysql');
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/amazon_fresh";
var passport = require('passport');
require('./passport')(passport);
var mq_client = require('../rpc/client');

function signup(req, res) {
  res.render('signup');
};
exports.farmerSignup = function (req, res) {
  res.render('farmerSignup');
};

function login(req, res) {
  res.render('login');

};


function doLogin(req, res,next) {
  var loginSucess = false;
  var email = req.param("email");
  var password = req.param("password");
  passport.authenticate('doLogin', function (err, results, info) {
    console.log(results);
    req.logIn(results, {session: false}, function (err) {
      if (err) {
        return next(err);
      }

  else if(results.length>0) {
        console.log("inside results.affrows>0");

        var passwordDB = results[0].PASSWORD;
        var saltDB = results[0].SALT;

        passwordIN = crypto.pbkdf2Sync(password, saltDB, 100000, 64, 'sha256').toString('hex');

        if (passwordIN == passwordDB) {
          loginSucess = true;
        }

        if (loginSucess && results[0].IS_APPROVED == 1) {


          req.session.email = results[0].EMAIL;
          req.session.userType = results[0].USERTYPE;
          req.session.userId = results[0].USER_ID;

          if (results[0].USERTYPE != 0) {
            var callbackFunction = function (err, resultsMongo) {
              if (resultsMongo) {
                console.log(resultsMongo);
                req.session.firstName = resultsMongo.FIRST_NAME;
                req.session.lastName = resultsMongo.LAST_NAME;
                req.session.city = resultsMongo.CITY;
                req.session.state = resultsMongo.STATE;
                req.session.address = resultsMongo.ADDRESS;
                req.session.zip = resultsMongo.ZIP;
                req.session.phone = resultsMongo.PHONE_NUMBER;
                req.session.ssn = resultsMongo.SSN;

                var jsonResponse = {
                  "statusCode": 200,
                  "userType": results[0].USERTYPE,
                  "isApproved": 1
                };

                res.send(jsonResponse);
              }
              else {
                throw err;
              }
            };

            var queryJSON = {"USER_ID": req.session.userId};
            mongo.findOne('USER_DETAILS', queryJSON, callbackFunction);


          } else if (results[0].USERTYPE == 0) {   ////FOR ADMIN USER/////////////
            var jsonResponse = {
              "statusCode": 200,
              "userType": results[0].USERTYPE,
              "isApproved": 1
            };
            res.send(jsonResponse);
          }
        }
        else if (loginSucess && results[0].IS_APPROVED == 0) {
          var isApproved = {"isApproved": 0};
          res.send(isApproved);

        }
        else if (loginSucess && results[0].IS_APPROVED == 2) {
          console.log("rejected");
          var isApproved = {"isApproved": 2};
          res.send(isApproved);

        }
      }
     if (!loginSucess) {

        console.log("invalid login");
        var jsonResponse = {"statusCode": 401, "isApproved": 1};
        res.send(jsonResponse);
      }
    })

  })(req, res, next);

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
  var creditCardNumber = req.param("creditCardNumber");
  var creditCardName = req.param("creditCardName");
  var expiryMonth = req.param("expiryMonth");
  var expiryYear = req.param("expiryYear");
  var cvv = req.param("cvv");

var msg_payload =
{
  "firstName":firstName,
  "lastName":lastName,
  "ssn":ssn,
  "email": email,
  "password":password,
  "address":address,
  "city":city,
  "state": state,
  "zip": zip,
  "phone":phone,
  "userType":userType,
  "creditCardNumber" : creditCardNumber,
  "creditCardName" : creditCardName,
  "expiryMonth" : expiryMonth,
  "expiryYear" : expiryYear,
    "cvv" : cvv,
  "functionToBeImplemented":"signup"

}

  mq_client.make_request('loginSignupQueue', msg_payload, function (err, results) {
    console.log(results);
    if (err) {
      throw err;
    }
    else {
      if (results.code == 200) {
        console.log("value inserted");
        var json_response={"statusCode":200};
        res.send(json_response);
      }

      else {
        var json_response={"statusCode":401};
        res.send(json_response)

      }
    }


  });

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
    res.redirect("index");
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

exports.getLoggedCartUserDetails = function(req,res)
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
  var userId=({USER_ID:req.session.userId});
var msg_payload={"userId":userId, "functionToBeImplemented":"getCustomerAccountDetails"};

  var userDetails= {
    "firstName" : req.session.firstName,
    "lastName" : req.session.lastName,
    "email" : req.session.email,
    "city" : req.session.city,
    "userId" : req.session.userId,
    "state":req.session.state,
    "address":req.session.address,
    "ssn":req.session.ssn,
    "phone":req.session.phone,
    "zip":req.session.zip

  };

  mq_client.make_request('usersQueue', msg_payload, function (err, results) {
    console.log(results);
    if (results) {
     // console.log(results.customerDetails);
      var details={"userDetails":userDetails,"customerDetails": results.customerDetails};
      res.send(details);
    }
    else {
      console.log("get customer details failed");
      }
  });

}


exports.fetchPurchaseHistory = function(req, res){
  var userId = req.session.userId;

  var msg_payload={"userId":userId, "functionToBeImplemented":"fetchPurchaseHistory"};
  mq_client.make_request('usersQueue', msg_payload, function (err, results) {
    console.log(results);
    if (results) {
      console.log(results+"result is");
      var projection={"statusCode":results.code,"result":results.projection};
      res.send(projection);

    }
    else {

      console.log("fetch purchase history failed");
    }
  });

}


exports.logout = function(req,res)
{
  console.log("in logout");
  req.session.destroy();
  res.redirect('/');
}

exports.doUpdateUserDetails = function(req, res) {
console.log(req.param("ssn")+"ssn");
  var firstName = req.param("firstName");
  var lastName = req.param("lastName");
  var ssn = req.param("ssn");
  var password = req.param("password");
  var address = req.param("address");
  var city = req.param("city");
  var state = req.param("state");
  var zip = req.param("zip");
  var phone = req.param("phone");
  var userType = req.param("userType");
console.log("password");
  var updateSignUpDetails = "update users set PASSWORD= '" + password + "' where USER_ID='" + req.session.userId+ "' ";
  mysql.fetchData(function (err, results) {

    if (results.affectedRows > 0) {



      console.log("values updated");

console.log("ssn is"+ssn);

      var userDetails = {
        "USER_ID": req.session.userId,
        "FIRST_NAME": firstName,
        "LAST_NAME": lastName,
        "SSN": ssn,
        "ADDRESS": address,
        "CITY": city,
        "STATE": state,
        "ZIP": zip,
        "PHONE_NUMBER": phone,
        "USER_TYPE": userType,
        "IS_APPROVED":1
      };
      var whereJson={"USER_ID":req.session.userId};

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
              "USER_ID": req.session.userId,
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
            mongo.updateOne("CUSTOMER_DETAILS",whereJson, customerCreditCardDetails, customerCreditCardDetailsCallbackFunction);
          }

          json_responses = {"statusCode": 200};
          res.send(json_responses);

          //checking for credit card details and entering the details in CREDITCARDTABLE

        }

      }

      mongo.updateOne("USER_DETAILS",whereJson, userDetails, userDetailsCallbackFunction);
    }



    else {
      console.log("data update failed");
    }
  },  updateSignUpDetails);



}



exports.signup=signup;
exports.login=login;
exports.doLogin=doLogin;
exports.doSignup=doSignup;
exports.redirectToHomepage=redirectToHomepage;
exports.farmerHome=farmerHome;
exports.getCustomerAccountDetails=getCustomerAccountDetails;
