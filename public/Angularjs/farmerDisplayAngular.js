var app= angular.module("farmerDisplayAngular",['ngSanitize']);
app.controller('farmerDisplayAngular',['$scope','$http','farmerId','$sce',function($scope,$http,farmerId,$sce)
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

    $scope.trustHtml = function(html) {
        // Sanitize manually if necessary. It's likely this 
        // html has already been sanitized server side 
        // before it went into your database. 
        // Don't hold me liable for XSS... never assume :~) 
        return $sce.trustAsHtml(html);
    };

    $scope.videoResourceUrl = function() {
        // Sanitize manually if necessary. It's likely this 
        // html has already been sanitized server side 
        // before it went into your database. 
        // Don't hold me liable for XSS... never assume :~) 
        console.log($scope.farmerVideo);
        return $sce.trustAsResourceUrl("../uploads/"+$scope.farmerVideo);
    };

}]);