/**
 * Created by aneri on 21-04-2016.
 */
var signupFarmer=angular.module('signupFarmer',[]);
signupFarmer.controller('SignupFarmerCntrl',function($scope,$http)
{
    $scope.registeredEmail=true;
    $scope.unexpectedError=true;
    $scope.invalidAddress = false;

    $scope.removeValidation = function(){
         $scope.invalidAddress = false;
    }


    $scope.submit=function()
    {
       var address = $scope.address+" ,"+$scope.city+" ,"+$scope.state+" "+$scope.zip;
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode( { 'address': $scope.address}, function(results, status) {
            console.log(google.maps.GeocoderStatus);
        if (status == google.maps.GeocoderStatus.OK) {
        $http({

            method:"POST",
            url:'/doSignup',
            data : {
                "firstName":$scope.firstName,
                "lastName":$scope.lastName,
                "ssn":$scope.ssn,
                "email":$scope.email,
                "password":$scope.password,
                "address":$scope.address,
                "city":$scope.city,
                "state":$scope.state,
                "zip":$scope.zip,
                "phone":$scope.phone,
                "userType":2,

            }

        }).success(function(data)
        {
            if (data.statusCode == 401) {
                 
                    $scope.registeredEmail = false;
                    $scope.unexpectedError = true;
            
            }
            if(data.statusCode==200)
            {
                window.location.assign("/newSignUpFarmer");
            }
        })
            .error(function(error) {
               
                    $scope.unexpectedError = false;
                    $scope.registeredEmail = true;
                
            }); 
        }else if(status == google.maps.GeocoderStatus.ZERO_RESULTS){
        
        console.log("Invalid Address");
        
             $scope.invalidAddress = true;
        
       
      }
      else{
        alert("Geocode was not successful for the following reason: " + status);
      }
    
    });
}
    $scope.match=function()
    {

        $scope.passwordMatch=false;

        if($scope.password!=$scope.confirmPassword)
        {
            $scope.passwordMatch=true;
        }
    }

})