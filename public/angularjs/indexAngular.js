
var app=angular.module('indexAngular',[]);


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
