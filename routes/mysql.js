/**
 * Created by aneri on 17-04-2016.
 */
/**
 * New node file
 */
var ejs= require("ejs");
var mysql= require("mysql");

function getConnection()
{
    var connection = mysql.createConnection({
        host     : 'localhost', //host where mysql server is running
        user     : 'root', //user for the mysql application
        password : 'root', //password for the mysql application
        database : 'amazon_fresh', //database name
        port  : 3306 //port, it is 3306 by default for mysql  });
    });
    return connection;
}

function fetchData(callback,sqlQuery)
{
    console.log("\nSQL Query::"+sqlQuery);
    var connection=getConnection();
    connection.query(sqlQuery, function(err, rows, fields){
            if(err)
            {
                console.log("ERROR: " + err.message);
            }
            else
            { // return err or result
                console.log("DB Results:"+rows);
                callback(err, rows);

            }

        }
    );
    console.log("\nConnection closed..");
    connection.end();

}

function insertData(sqlQuery,inputJSON,callback)
{
    console.log("\n SQL Query:"+sqlQuery);
    var connection=getConnection();
    connection.query(sqlQuery,inputJSON,function(err,result){
        if(err)
        {
            console.log("ERROR: " + err.message);
            console.log("insert1");
        }
        else
        { // return err or result
            console.log("Inserted Successfully in MySql");
            callback(err, result);
        }
    });
    connection.end();
}


exports.insertDataWithoutJSON = function(sqlQuery,callback)
{

    console.log("\n SQL Query:"+sqlQuery);
    var connection=getConnection();
    connection.query(sqlQuery,function(err,result){
        if(err)
        {
            console.log("ERROR: " + err.message);
            console.log("insert1");
        }
        else
        { // return err or result
            console.log("Inserted Successfully in MySql");
            callback(err, result);
        }
    });
    connection.end();
}

exports.deleteData =  function(sqlQuery,callback)
{

    console.log("\n SQL Query:"+sqlQuery);
    var connection=getConnection();
    connection.query(sqlQuery,function(err,result){
        if(err)
        {
            console.log("ERROR: " + err.message);
            console.log("insert1");
        }
        else
        { // return err or result
            console.log("Inserted Successfully in MySql");
            callback(err, result);
        }
    });
    connection.end();
}

exports.updateData =  function(sqlQuery,callback)
{

    console.log("\n SQL Query:"+sqlQuery);
    var connection=getConnection();
    connection.query(sqlQuery,function(err,result){
        if(err)
        {
            console.log("ERROR: " + err.message);
            console.log("insert1");
        }
        else
        { // return err or result
            console.log("updated Successfully in MySql");
            callback(err, result);
        }
    });
    connection.end();
}


exports.fetchData=fetchData;
exports.insertData=insertData;
