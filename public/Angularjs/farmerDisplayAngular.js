var app= angular.module("farmerDisplayAngular",[]).filter("trustUrl", ['$sce', function ($sce) {
    return function (recordingUrl) {
        return $sce.trustAsResourceUrl(recordingUrl);
    };
}]);
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
                $scope.farmerImage = res.data.result.IMAGE;
                $scope.farmerVideo = res.data.result.VIDEO;
                $scope.farmerUserId = res.data.result.USER_ID;
                $scope.farmerIntroductionDetails = res.data.result.INTRODUCTION_DETAILS;
                $scope.farmerAverageRating = res.data.result.AVERAGE_RATING;
                $scope.farmerReviewDetails = res.data.result.REVIEW_DETAILS;
                console.log();
			}
           else if (res.data.statusCode == 401) {


                    window.location.assign('/:error');

            }

        }, function(res) { //this will be called on error
          console.log(res.data);
        });
    $scope.addReview = function(farmer_id,avg_rating){

        $http({
            method: "POST",
            url: '/addFarmerReview',
            data: {
                "avg_rating" : avg_rating,
                "farmer_id" : farmer_id,
                "ratings" : $scope.rating,
                "title" : $scope.title,
                "review" : $scope.review
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

});