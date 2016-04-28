var app = angular.module("rideControl",[]);
app.controller('rideControl', function($scope, $http, billId) {
    console.log("Bill Id "+billId);
 $http({
    method:"POST",
    url:'/doTrackOrder',
    data : {
            "billId" : billId
            }
     }).then(function (res) {
    console.log(res.data);
    console.log(res.data.TRIP_DETAILS);
    var details = res.data.TRIP_DETAILS[0];
    $scope.source_address = details.SOURCE_LOC.ADDRESS;
    $scope.dest_address = details.DESTINATION_LOC.ADDRESS
  });
});

