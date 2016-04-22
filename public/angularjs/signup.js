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
signUp.controller('signup',function($scope,$http)
{
    $scope.registeredEmail=true;
    $scope.unexpectedError=true;

    $scope.submit=function()
    {
        console.log($scope.email);
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
                "cvv":$scope.cvv
            }

        }).success(function(data)
        {
            if (data.statusCode == 401) {
                $scope.registeredEmail = false;
                $scope.unexpectedError = true;
            }
            if(data.statusCode==200)
            {
                window.location.assign("/redirectToHomepage");
            }
        })
            .error(function(error) {
                $scope.unexpectedError = false;
                $scope.registeredEmail = true;
            });


    };

    $scope.match=function()
    {

    $scope.passwordMatch=false;

    if($scope.password!=$scope.confirmPassword)
    {
        $scope.passwordMatch=true;
    }
}

})