var app = angular.module("rideControl",[]);
app.controller('rideControl', function($scope, $http, billId) {

 $http({
    method:"POST",
    url:'/doTrackOrder',
    data : {
            "billId" : billId
            }
     }).then(function (res) {
    var details = res.data.TRIP_DETAILS[0];
    $scope.source_address = details.SOURCE_LOC.ADDRESS;
    $scope.dest_address = details.DESTINATION_LOC.ADDRESS
  });

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
    method : "POST",
    url : '/fetchAllBills',
    data : {
            "billId" : billId
            }

  }).then(function(res) {
    if(res.data.statusCode == 200){
      $scope.bill = res.data.result[0];
      console.log($scope.bill);
    }
  },function(err) {
    console.log(err);
  });



});
