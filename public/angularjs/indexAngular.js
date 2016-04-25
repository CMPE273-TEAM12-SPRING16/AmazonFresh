
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

        }).then(function(res){

          if(res.data.statusCode == 200)
          {
              if(res.data.userType == 1){
                window.location.assign("/");
              } else if(res.data.userType == 2) {
                window.location.assign("/farmerHome");
              } else if(res.data.userType == 0){
                window.location.assign("/adminHome");
              }
          }else if (res.data.statusCode == 401) {
                $scope.invalidLogin = false;
                $scope.unexpectedError = true;
            }

        }, function(res) { //this will be called on error
          console.log(res.data);
        });


    };


});



app.controller('IndexPageController',function($scope,$http){

  $scope.isLoggedIn = false;
  $scope.isSearch = false;
  $scope.searchedProducts = {};


  //___________________BREAD_CRUMB_START___________________//
  $scope.bcHomeClass = "active";
  $scope.bcSearchResultsClass = "inactive";
  //___________________BREAD_CRUMB_OVER___________________//

    $http({ //GET LOGGED IN USER DETAILS

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

    $http({ // GET PRODUCTS

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

    //Search Function..........................................................//
    $scope.doSearch = function(){
      $scope.isSearch = true;
      $scope.bcHomeClass = "inactive";
      $scope.bcSearchResultsClass = "active";
      var searchString = $scope.searchString;
      if(searchString != ""){
        $http({
          method : "POST",
          url : '/doSearch',
          data : {
            "searchString" : searchString
          }

        }).then(function(res) {
          if(res.data.statusCode == 200){
            $scope.searchedProducts = res.data.searchResults;
          }

        },function() {

        });

      }else{
        $scope.searchShow = false;
        $scope.searchResult = null;
      }
    }

});
