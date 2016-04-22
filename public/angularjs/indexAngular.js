
var app=angular.module('indexAngular',[]);


app.controller('LoginController',function($scope,$http)
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
          if(data.statusCode == 200)
          {
              console.log("After success login");
              window.location.assign("/adminHome");
          }else if (data.statusCode == 401) {
                $scope.invalidLogin = false;
                $scope.unexpectedError = true;
            }

        }).error(function(error) {
                $scope.unexpectedError = false;
                $scope.invalidLogin = true;
        });


    };


});

app.controller('PaginationController',function($scope,$http){

  $http({

    method:"POST",
    url:'/doFetch10ProductsOnIndex'

  }).success(function(data)
  {

    if(data.statusCode==200)
    {
      console.log(data.results);
      $scope.products = data.results;

    }
  }).error(function(error) {
    console.log(error);
  });


});
