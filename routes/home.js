/**
 * Created by aneri on 17-04-2016.
 */
var ejs = require('ejs');
var mysql = require('./mysql');

function doLogin(req, res) {

    var email=req.param("email");
    var password=req.param("password");
console.log(email);
    var  getLoginDetails = "select * from users where email='" + email + "' and password='" + password + "'";

    mysql.fetchData(function (err, results) {

            if (results.length > 0)
            {
                console.log(results);
                console.log(results[0].USERTYPE);
                req.session.email=results[0].EMAIL;
                req.session.userType=results[0].USERTYPE;
                console.log("valid Login");

                res.send({"statusCode":200,userType:results[0].usertype});

               }

            else
            {
                res.send({"statusCode": 401});
            }



    }, getLoginDetails);


}
function redirectToHomepage(req,res)
{
    //Checks type of login(customer/admin/farmer) before redirecting and redirects accordingly
    if(req.session.userType==0)
    {
        //Set these headers to notify the browser not to maintain any cache for the page being loaded
        res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        res.render("adminhomepage");
    }
    else if(req.session.userType==1) {
        res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        res.render("customerhomepage");
    }
    else if(req.session.userType==2)
    {
        res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        res.render("farmerhomepage");
    }
    else {
        res.redirect('/');
    }
};
exports.doLogin=doLogin;
exports.redirectToHomepage=redirectToHomepage;