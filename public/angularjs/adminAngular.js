var adminNgApp = angular.module("adminNgApp", ['ngRoute']);

adminNgApp.config(['$routeProvider', function($routeProvider) {
   $routeProvider.

   when('/apprReqCustomer', {
      templateUrl: 'apprReqCustomer', controller: 'ApprReqCustomer'
   }).
   when('/apprReqFarmer', {
      templateUrl: 'apprReqFarmer', controller: 'ApprReqFarmer'
   }).
   when('/apprReqProduct', {
      templateUrl: 'apprReqProduct', controller: 'ApprReqProduct'
   }).
   when('/',{
      templateUrl: 'apprReqCustomer', controller: 'ApprReqCustomer'
   })

}]);

adminNgApp.controller('ApprReqCustomer', function($scope) {

});

adminNgApp.controller('ApprReqFarmer', function($scope) {

});

adminNgApp.controller('ApprReqProduct', function($scope) {

});

adminNgApp.controller('AdminPageCtrl', function($scope){
  $scope.activeCustomer = "active";
  $scope.activeFarmer = "";
  $scope.activeProduct = "";

  $scope.activateCustomer = function(){
    $scope.activeCustomer = "active";
    $scope.activeFarmer = "";
    $scope.activeProduct = "";
  }
  $scope.activateFarmer = function(){
    $scope.activeCustomer = "";
    $scope.activeFarmer = "active";
    $scope.activeProduct = "";
  }
  $scope.activateProduct = function(){
    $scope.activeCustomer = "";
    $scope.activeFarmer = "";
    $scope.activeProduct = "active";
  }

});
