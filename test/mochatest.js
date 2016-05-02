/**
 * Created by aneri on 01-05-2016.
 */
var request = require('request')
    , express = require('express')
    ,assert = require("assert")
    ,http = require("http");

describe('http tests', function(){

    it('should return the homepage if the url is correct', function(done){
        request.post(
            'http://localhost:3000/doFetch10ProductsOnIndex', function(error,response,body) {

                assert.equal(body.includes('PRODUCT_NAME'),true);
            done();
        }
        );
    });

    it('should display details about a product if the product exists', function(done) {
        request.post(
            'http://localhost:3000/getProductDetails',
            { form: { productId: "5725e4bac2e30030228c789a"} },
            function (error, response, body) {

                assert.equal(body.includes('PRODUCT_NAME'),true);
                done();
            }
        );
    });

    it('should display pending approval requests of customers ', function(done) {
        request.get(
            'http://localhost:3000/reviewCustomer',
            function (error, response, body) {

                assert.equal(body.includes('SSN'),true);
                done();
            }
        );
    });

    it('should display fetched product', function(done) {
        request.post(
            'http://localhost:3000/doSearch',
            { form: { searchString: "Peach Conserve"} },
            function (error, response, body) {

                assert.equal(body.includes('PRODUCT_NAME'),true);
                done();
            }
        );
    });
    it('should display details about a farmer if the farmer exists ', function(done) {
        request.post(
            'http://localhost:3000/getFarmerDetails',
            { form: { farmerId: 25} },
            function (error, response, body) {

                assert.equal(body.includes('EMAIL_ID'),true);
                done();
            }
        );
    });

});