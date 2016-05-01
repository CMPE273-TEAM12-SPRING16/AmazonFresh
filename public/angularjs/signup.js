/**
 * Created by aneri on 18-04-2016.
 */
/**
 * Created by aneri on 17-04-2016.
 */
/**
 * Created by aneri on 10-03-2016.
 */
var signUp=angular.module('signup',[]);

signUp.controller('signup',function($scope,$http,$rootScope)
{
    $scope.registeredEmail=true;
    $scope.unexpectedError=true;
    $scope.invalidAddress = false;


   
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
                "userType":1,
                "creditCardNumber":$scope.creditCardNumber,
                "creditCardName":$scope.creditCardName,
                "expiryMonth":$scope.expiryMonth,
                "expiryYear":$scope.expiryYear,
                "cvv":$scope.cvv,
                "IS_APPROVED":0
            }

        }).success(function(data)
        {
            console.log($scope.firstName)
            if (data.statusCode == 401) {
                $scope.registeredEmail = false;
                $scope.unexpectedError = true;
            }
            if(data.statusCode==200)
            {
                window.location.assign("/newSignUpCustomer");
            }
        })
            .error(function(error) {
               
                    
                    $scope.unexpectedError = false;
                    $scope.registeredEmail = true;
               
            });
      } else if(status == google.maps.GeocoderStatus.ZERO_RESULTS){
        
        console.log("Invalid Address");
        $scope.invalidAddress = true; 
      }
      else{
        alert("Geocode was not successful for the following reason: " + status);
      }
    });
         console.log(geocoder);
        console.log($scope.email);
        


    };

    $scope.match=function()
    {

        $scope.passwordMatch=false;

    if($scope.password!=$scope.confirmPassword)
    {

        $scope.passwordMatch=true;

    }

    }

});
