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
    var details = res.data.TRIP_DETAILS;
    var mapOptions = {
        zoom: 16,
        center: new google.maps.LatLng(res.data.TRIP_DETAILS[0].SOURCE_LOC.LATITUDE, res.data.TRIP_DETAILS[0].SOURCE_LOC.LONGITUDE),
        mapTypeId: google.maps.MapTypeId.TERRAIN
    }
    console.log("Map");
    $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);
    console.log("Source Location "+res.data.TRIP_DETAILS[0].SOURCE_LOC.LATITUDE);
    var start = new google.maps.LatLng(Number(res.data.TRIP_DETAILS[0].SOURCE_LOC.LATITUDE), Number(res.data.TRIP_DETAILS[0].SOURCE_LOC.LONGITUDE));
    $scope.mymarker = new google.maps.Marker({
        map: $scope.map,
        animation: google.maps.Animation.DROP,
        position: start,
        title: res.data.TRIP_DETAILS[0].SOURCE_LOC.ADDRESS,
        icon : '../images/support_images/map-pin-farmer.png'
    });



    var waypts = [];
    var end;
    for(var res in details){

    var directionsService = new google.maps.DirectionsService();
    var directionsDisplay = new google.maps.DirectionsRenderer();


	directionsDisplay.setMap(map);

	
     end = new google.maps.LatLng(Number(details[res].DESTINATION_LOC.LATITUDE),Number(details[res].DESTINATION_LOC.LONGITUDE));
	waypts.push({
              location: details[res].DESTINATION_LOC.ADDRESS,
              stopover: true
            });
        }

         var request = {
            origin: start,
            destination: end,
             waypoints: waypts,
            travelMode: google.maps.TravelMode.DRIVING
        };
        directionsService.route(request, function (response, status) {

            if (status == google.maps.DirectionsStatus.OK) {
                directionsDisplay.setDirections(response);
                directionsDisplay.setMap($scope.map);
            } else {
                alert("Directions Request from " + start.toUrlValue(6) + " to " + end.toUrlValue(6) + " failed: " + status);
            }
        });
    })

});
