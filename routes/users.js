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
      req.session.user_id=results[0].USER_ID;
      req.session.email=results[0].EMAIL;
      req.session.userType=results[0].USERTYPE;
      console.log("valid Login");
      var jsonResponse1 = {"statusCode":200};
      res.send(jsonResponse1);

    }

    else
    {
      var jsonResponse2={"statusCode":401};
      res.send(jsonResponse2);
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
          var email = results.email;
          req.session.userType = userType;
          console.log("sql values inserted");

          //insert remaining values in mongo

          var userDetails = {
            "USERID": userId,
            "FIRST_NAME": firstName,
            "LAST_NAME": lastName,
            "EMAIL_ID": email,
            "SSN": ssn,
            "ADDRESS": address,
            "CITY": city,
            "STATE": state,
            "ZIP": zip,
            "PHONE": phone,
            "USER_TYPE": userType,
            "ISAPPROVED" : 0
          };

          var callbackFunction = function (err, results) {
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
                  "USERID": userId,
                  CREDIT_CARD_DETAILS:
                {
                  "CREDIT_CARD_NUMBER": creditCardNumber,
                  "CREDIT_CARD_NAME": creditCardName,
                  "EXPIRY_MONTH": expiryMonth,
                  "EXPIRY_YEAR": expiryYear,
                  "CVV": cvv}
                };
                var callbackFunction = function (err, results) {
                  var json_responses;

                  if (err) {
                    console.log(err);
                  }
                  else {
                    console.log("creditCardDetailsInserted");
                  }
                }
                mongo.insertOne("CUSTOMER_DETAILS", customerCreditCardDetails, callbackFunction);
              }

              json_responses = {"statusCode": 200};
              res.send(json_responses);

             //checking for credit card details and entering the details in CREDITCARDTABLE

            }

          }

          mongo.insertOne("USERS", userDetails, callbackFunction);
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
  //Checks type of login(customer/admin/farmer) before redirecting and redirects accordingly
  if(req.session.userType==0)
  {
    //Set these headers to notify the browser not to maintain any cache for the page being loaded
    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    res.render("adminHome");
  }
  else if(req.session.userType==1) {
    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    res.render("customerHome");
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

function farmerHome(req,res)
{
res.render('farmerHome');

}

exports.signup=signup;
exports.login=login;
exports.doLogin=doLogin;
exports.doSignup=doSignup;
exports.redirectToHomepage=redirectToHomepage;
exports.farmerHome=farmerHome;
