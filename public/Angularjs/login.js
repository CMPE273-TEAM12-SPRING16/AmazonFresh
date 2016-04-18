/**
 * Created by aneri on 17-04-2016.
 */
/**
 * Created by aneri on 10-03-2016.
 */
var Login=angular.module('login',[]);
Login.controller('login',function($scope,$http)
{
    $scope.registeredEmail=true;
    $scope.unexpectedError=true;

    $scope.submit=function()
    {
        $http({
            method:"POST",
            url:'/Login',
            data : {
                "email":$scope.email,
                "password" : $scope.password
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


})