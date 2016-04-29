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
