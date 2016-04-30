/**
 * Created by aneri on 29-04-2016.
 */
/**
 * Created by aneri on 08-04-2016.
 */
/**
 * Created by aneri on 07-04-2016.
 */
var amqp = require('amqp');

var connection = amqp.createConnection({host:'127.0.0.1'});
var rpc = new (require('./amqprpc'))(connection);

//make request to rabbitmq
function make_request(queue_name, msg_payload, callback){
    console.log("inside client");

    rpc.makeRequest(queue_name, msg_payload, function(err, response){
        if(err)
            console.error(err);
        else{
            console.log("response", response);
            callback(null, response);
        }
    });
}





exports.make_request = make_request;