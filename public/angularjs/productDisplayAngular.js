/**
 * Created by aneri on 19-04-2016.
 */

var productDisplayAngular= angular.module("productDisplayAngular",[]);
console.log("insoide");
productDisplayAngular.controller("productDisplayAngular",['$scope','$http','sendProductId',function($scope,$http,sendProductId)
    {
    //$scope.sendProductId =sendProductId;
    //console.log($scope.productId);
        console.log("hello");
        console.log("dbflkhf");
console.log("product id is"+sendProductId);

            $http({

                method: "POST",
                url: '/getProductDetails',
                data: {
                    "productId": sendProductId

                }

            }).then(function (res) {
                $scope.displayProductDetails = res.data.productDetails;
                $scope.farmerName=res.data.farmerName;
                console.log(res.data.productDetails.PRODUCT_NAME);
                console.log($scope.displayProductDetails.PRODUCT_NAME + "pruduct name is");


            });





    }]);