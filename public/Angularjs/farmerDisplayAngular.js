var app= angular.module("farmerDisplayAngular",[]);
app.controller('farmerDisplayAngular',function($scope,$http,farmerId)
{
	console.log('farmerId:'+farmerId);
	$http({

            method:"POST",
            url:'/getFarmerDetails',
            data : {
                "farmerId":farmerId
            }


        }).then(function(res){
            console.log(res.data.isApproved);
            if (res.data.statusCode == 200) {
            	$scope.farmerId = farmerId;
           		$scope.farmerFirstName = res.data.results.FIRST_NAME;
            	$scope.farmerLastName = res.data.results.LAST_NAME;
            	$scope.farmerSSN = res.data.results.SSN;
             	$scope.farmerEmailId = res.data.results.EMAIL_ID;
             	$scope.farmerAddress = res.data.results.ADDRESS;
             	$scope.farmerCity = res.data.results.CITY;
              	$scope.farmerState = res.data.results.STATE;
              	$scope.farmerZip = res.data.results.ZIP;
              	$scope.farmerPhone = res.data.results.PHONE_NUMBER;
 
			}
           else if (res.data.statusCode == 401) {


                    window.location.assign('/:error');

            }

        }, function(res) { //this will be called on error
          console.log(res.data);
        });

});