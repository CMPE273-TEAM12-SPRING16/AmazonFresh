/**
 * Created by aneri on 21-04-2016.
 */
var customerAccount= angular.module("customerAccount",[]);
customerAccount.controller("customerAccount",function($scope,$http)
{
    $http({

        method: "GET",
        url: '/getCustomerAccountDetails',
        data: {
        }

    }).then(function (res) {
        $scope.userDetails = res.data.userDetails;
        console.log($scope.userDetails.FIRST_NAME);
        $scope.customerDetails=res.data.customerDetails;
       
    });

}
);