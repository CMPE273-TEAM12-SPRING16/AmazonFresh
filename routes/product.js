/**
 * Created by aneri on 18-04-2016.
 */
var ejs = require('ejs');
function addProduct(req, res)
{
    res.render('addproduct');
}
exports.addProduct=addProduct;