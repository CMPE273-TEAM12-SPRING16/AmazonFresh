
var app=angular.module('indexAngular',[]);


app.controller('LoginController',function($scope,$http)
{

    $scope.invalidLogin=true;
    $scope.unexpectedError=true;

    $scope.submit=function()
    {
     console.log("try");
        $http({

            method:"POST",
            url:'/doLogin',
            data : {
                "email":$scope.email,
                "password":$scope.password
            }

        }).success(function(data)
        {
            console.log(data.statusCode+"status code");
            console.log(data.userType+"user type is");
            window.location.assign("/signup");
/*          if(data.statusCode == 200)
          {
              console.log(data.userType);
              console.log("After success login");

              if(data.userType=0)
              {
                  window.location.assign("/adminHome");
              }
              else if(data.userType=1)
              {
                  window.location.assign("/");
              }
              else if(data.userType=2)
              {
                  window.location.assign("/farmerHome");
              }

          }else if (data.statusCode == 401) {
                $scope.invalidLogin = false;
                $scope.unexpectedError = true;
            }*/

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

app.controller('IndexPageController',function($scope,$http){

  $scope.isLoggedIn = false;
    $http({

        method: "POST",
        url: '/getLoggedInUserDetails',
        data: {
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
            console.log("first name"+$scope.firstName+"lastName"+$scope.lastName+" isLoggedIn "+$scope.isLoggedIn);
    });

});