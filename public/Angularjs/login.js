/**
 * Created by aneri on 17-04-2016.
 */
/**
 * Created by aneri on 10-03-2016.
 */
var login=angular.module('login',[]);
login.controller('login',function($scope,$http)
{

    $scope.invalidLogin=true;
    $scope.unexpectedError=true;

    $scope.submit=function()
    {
  console.log($scope.email);
        $http({

            method:"POST",
            url:'/doLogin',
            data : {
                "email":$scope.email,
                "password":$scope.password
            }

        }).success(function(data)
        {
            debugger;
            if (data.statusCode == 401) {
                $scope.invalidLogin = false;
                $scope.unexpectedError = true;
            }
            if(data.statusCode==200)
            {
                console.log("After success login");
                debugger;
                window.location.assign("/adminHome");
            }
        })
            .error(function(error) {
                $scope.unexpectedError = false;
                $scope.invalidLogin = true;
            });


    };


})