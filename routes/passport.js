/**
 * Created by aneri on 25-04-2016.
 */

var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var mysql = require('./mysql');

module.exports = function(passport) {
    passport.use('doLogin', new LocalStrategy({usernameField: 'email',
        passwordField: 'password'},function(username, password, done) {

console.log("inside passport");
               var email=username;
                var password=password;


            process.nextTick(function() {

                var getLoginDetails = "SELECT * FROM USERS WHERE EMAIL='" + email + "' LIMIT 1";

                mysql.fetchData(function (err, results) {
                    console.log("fetched");

                    if (err) {
                        return done(err);
                    }

                    if (!results) {
                        return done(null, false);
                    }

                    if(results) {

                        done(null, results);
                    }
                }, getLoginDetails);
            });

    }));
}




