var productDisplayAngular= angular.module("productDisplayAngular",[]);
productDisplayAngular.controller("ProductDisplayAngular",['$scope','$http','sendProductId',function($scope,$http,sendProductId)
{
        $scope.reviewReq = true;
        $scope.cart = [];
        $scope.isLoggedIn = false;
        $scope.checkOutBtnClass = "btn btn-primary btn-block btn-proceed-to-checkout-disabled";

            $http({

                method: "POST",
                url: '/getProductDetails',
                data: {
                    "productId": sendProductId
                }

            }).then(function (res) {
                $scope.displayProductDetails = res.data.productDetails;
            });

            $http({

                method: "POST",
                url: '/getLoggedInUserDetails',
                data: {
                }

            }).then(function (res) {
                    $scope.firstName = res.data.firstName;
                    $scope.lastName = res.data.lastName;
                    $scope.email = res.data.email;
                    $scope.city = res.data.city;
                    $scope.userId = res.data.userId;
                    if(res.data.firstName)
                    {
                        $scope.isLoggedIn = true;
                    }
            });

            $http({

                method: "POST",
                url: '/getCartDetails',
                data: {
                }

            }).then(function (res) {
                    $scope.cart = res.data.results.CART_PRODUCTS;
            });

            $scope.addToCart = function(productId){
                console.log("Clicked"+productId);
                $http({
                    method:"POST",
                    url:"/addToCart",
                    data:{
                        "productId" : productId
                    }
                    }).success(function(data){
                        if(data.statusCode==401)
                            {

                            }
                        else
                            {
                                var length = $scope.cart.length;
                                $scope.checkOutBtnClass = "btn btn-primary btn-block btn-proceed-to-checkout-enabled";
                                $scope.cart[length] = {"PRODUCT_ID" : $scope.displayProductDetails.PRODUCT_ID,
                                                        "PRODUCT_NAME" : $scope.displayProductDetails.PRODUCT_NAME,
                                                        "PRICE" : $scope.displayProductDetails.PRICE,
                                                        "QTY" : 1,
                                                        "FILE_NAME" : $scope.displayProductDetails.FILE_NAME}; //change this
                            }
                    }).error(function(error){

            });
            }

            $scope.removeItemFromCart = function(index){

                $http({
                    method:"POST",
                    url:"/removeItemFromCart",
                    data:{
                        "product" : $scope.cart[index]
                    }
                    }).success(function(data){
                        if(data.statusCode==401)
                            {

                            }
                        else
                            {

                            }
                    }).error(function(error){

                });

                console.log(index);
                if($scope.cart.length == 1){
                  $scope.checkOutBtnClass = "btn btn-primary btn-block btn-proceed-to-checkout-disabled";
                  $scope.cart =[];
                 }
                var length = scope.cart.length;
                $scope.cart = $scope.cart.splice(index,length-1); //check this one

            }

            // $scope.updateQTY = function(operation){
            //   if(operation == "plus"){
            //     $scope.QTY = $scope.QTY + 1;
            //   } else if(operation == "minus") {
            //     if($scope.QTY != 0){
            //       $scope.QTY = $scope.QTY - 1;
            //     }
            //   }
            //   console.log($scope.QTY);
            // }

            $scope.addReview = function(product_id,avg_rating){
                console.log("product_id"+avg_rating);
                
                 $http({
                    method: "POST",
                    url: '/addProductReview',
                    data: {
                        "avg_rating" : avg_rating,
                        "product_id" : product_id,
                        "ratings" : $scope.rating,
                        "title" : $scope.title,
                        "review" : $scope.review
                    }
                }).then(function (res) {
                    $scope.firstName = res.data.firstName;
                    $scope.lastName = res.data.lastName;
                    $scope.email = res.data.email;
                    $scope.city = res.data.city;
                    $scope.userId = res.data.userId;
                    if(res.data.firstName)
                    {
                        $scope.isLoggedIn = true;
                    }
            },function(err){
                console.log(err);
            });
            }
    }
]);
