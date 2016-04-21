var productDisplayAngular= angular.module("productDisplayAngular",[]);
productDisplayAngular.controller("productDisplayAngular",['$scope','$http','sendProductId',function($scope,$http,sendProductId)
    {
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

    }
]);