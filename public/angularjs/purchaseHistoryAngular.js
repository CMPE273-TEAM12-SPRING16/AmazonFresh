var purchaseHistoryApp = angular.module("purchaseHistoryApp", ['ngRoute']);


purchaseHistoryApp.controller('purchaseHistoryController', function($scope, $http){

  $scope.noPurchaseHistory = false;

  $http({ //GET LOGGED IN USER DETAILS

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
          console.log("first name"+$scope.firstName+"lastName"+$scope.lastName+" isLoggedIn "+$scope.isLoggedIn);
  });


  $http({
    method : "GET",
    url : '/fetchPurchaseHistory',

  }).then(function(res) {
    if(res.data.statusCode == 200){
      $scope.purchaseHistory = res.data.result.PURCHASE_HISTORY;
      console.log($scope.purchaseHistory);
      if($scope.purchaseHistory.length == 0){
        $scope.noPurchaseHistory = true;
      }
    }
  },function(err) {
    console.log(err);
  });



});
