var productDisplayAngular= angular.module("productDisplayAngular",['ngFileUpload', 'ngSanitize']);
productDisplayAngular.controller('LoginController',function($scope,$http)
{
    $scope.isNotApproved=true;
    $scope.isPending=true;
    $scope.invalidLogin=true;
    $scope.unexpectedError=true;

    $scope.submit=function()
    {


        console.log($scope.email);

        $http({

            method:"POST",
            url:'/doLogin',
            data : {
                "email":$scope.email,
                "password":$scope.password
            }


        }).then(function(res){
            console.log(res.data.isApproved);
            if(res.data.isApproved==1) {

                if (res.data.statusCode == 200) {

                    console.log("valid login");
                } else if (res.data.statusCode == 401) {
                    $scope.invalidLogin = false;
                    $scope.unexpectedError = true;
                }

            }
            else if(res.data.isApproved==0)
            {
                $scope.isPending=false;
            }
            else if(res.data.isApproved==2)
            {
                console.log("is approved is 2")
                $scope.isNotApproved=false;
            }
        }, function(res) { //this will be called on error
            console.log(res.data);
        });


    };


});

productDisplayAngular.controller("ProductDisplayAngular",['$scope','$http','sendProductId','socket','Upload','$sce',function($scope,$http,sendProductId,socket,Upload,$sce)
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
                if(res.data.statusCode=="401")
                {
                    window.location.assign('/:error');
                }
                else {
                    console.log("inside succed function");
                    $scope.displayProductDetails = res.data.productDetails;
                }
            });

            //Cart start
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
                    if($scope.cart.length>0)
                    {
                        $scope.checkOutBtnClass = "btn btn-primary btn-block btn-proceed-to-checkout-enabled";
                    }
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
                                console.log("cart length: "+$scope.cart.length);
                                console.log("cart"+$scope.cart);
                                $scope.checkOutBtnClass = "btn btn-primary btn-block btn-proceed-to-checkout-enabled";
                                var productFound = false;
                                for(var i=0;i<$scope.cart.length;i++)
                                {
                                    console.log("reached here");
                                    console.log("product id from cart"+$scope.cart[i].PRODUCT_ID );
                                    console.log("produc id passed for product"+productId);
                                    if($scope.cart[i].PRODUCT_ID == productId)
                                    {
                                        $scope.cart[i].QTY += 1;
                                        productFound = true;
                                    }
                                }
                                if(!productFound)
                                {
                                    $scope.cart[length] = {"PRODUCT_ID" : productId,
                                        "PRODUCT_NAME" : data.productName,
                                        "PRICE" : data.price,
                                        "QTY" : 1,
                                        "FILE_NAME" : data.fileName}; //change this
                            }
                                }
                                socket.emit('test',{id:"test"});

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
                var length = $scope.cart.length;
                $scope.cart = $scope.cart.splice($scope.cart.indexOf($scope.cart[index],1)); //check this one

            }

            $scope.plusQTY = function(index){
                console.log("index"+index);
                $http({
                    method:"POST",
                    url:"/addToCart",
                    data:{
                        "productId" : $scope.cart[index].PRODUCT_ID
                    }
                    }).success(function(data){
                        if(data.statusCode==401)
                            {

                            }
                        else
                            {
                                $scope.cart[index].QTY+=1;
                            }
                    }).error(function(error){

                });


            }

            $scope.minusQTY = function(index){

                $http({
                    method:"POST",
                    url:"/minusQtyInCart",
                    data:{
                        "product" : $scope.cart[index]
                    }
                    }).success(function(data){
                        if(data.statusCode==401)
                            {

                            }
                        else
                            {
                                if($scope.cart[index].QTY == 1)
                                {
                                    $scope.cart = $scope.cart.splice(index,1);
                                }
                                else
                                {
                                    $scope.cart[index].QTY-=1;
                                }
                            }
                    }).error(function(error){

                });
            }


            $scope.getTotal = function(){
                var total = 0;
                for(var i = 0; i < $scope.cart.length; i++){
                    total += ($scope.cart[i].PRICE * $scope.cart[i].QTY);
                }
                return total;
            }

            $scope.doProceedToCheckout = function()
            {
                window.location.assign('/checkout');
            }

            //Cart End
            $scope.addReview = function(product_id,avg_rating){
                console.log("product_id"+avg_rating);
                Upload.upload({
                    url: '/addProductReview',
                    data: {
                        "avg_rating" : avg_rating,
                        "product_id" : product_id,
                        "ratings" : $scope.rating,
                        "title" : $scope.title,
                        "review" : $scope.review,
                        "imageFile" : $scope.imageFile,
                        "videoFile" : $scope.videoFile
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

            $scope.trustHtml = function(html) {
                // Sanitize manually if necessary. It's likely this
                // html has already been sanitized server side
                // before it went into your database.
                // Don't hold me liable for XSS... never assume :~)
                return $sce.trustAsHtml(html);
            };

            $scope.videoResourceUrl = function(url) {
                // Sanitize manually if necessary. It's likely this
                // html has already been sanitized server side
                // before it went into your database.
                // Don't hold me liable for XSS... never assume :~)
                //console.log($scope.farmerVideo);
                console.log(url);
                return $sce.trustAsResourceUrl("../uploads/"+url);
            };

    }
]);


productDisplayAngular.factory('socket', ['$rootScope', function ($rootScope) {
    var socket = io.connect();
    console.log("socket created");

    return {
        on: function (eventName, callback) {
            function wrapper() {
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(socket, args);
                });
            }

            socket.on(eventName, wrapper);

            return function () {
                socket.removeListener(eventName, wrapper);
            };
        },

        emit: function (eventName, data, callback) {
            socket.emit(eventName, data, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    if(callback) {
                        callback.apply(socket, args);
                    }
                });
            });
        }
    };
}]);
