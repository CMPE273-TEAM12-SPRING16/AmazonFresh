var productDisplayAngular= angular.module("productDisplayAngular",[]);
productDisplayAngular.controller("ProductDisplayAngular",['$scope','$http','sendProductId',function($scope,$http,sendProductId)
    {
        $scope.isLoggedIn = false;
            $http({

                method: "POST",
                url: '/getProductDetails',
                data: {
                    "productId": sendProductId
                }

            }).then(function (res) {
                $scope.displayProductDetails = res.data.productDetails;
                $scope.farmerName=res.data.farmerName;
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
                            $scope.followShow = false;
                            $scope.followerCount +=1;  
                            }
                    }).error(function(error){
                        
            });
            } 

    }
]);

productDisplayAngular.controller("LoggedInUserDetails",['$scope','$http',function($scope,$http)
    {
            

    }
]);