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

  $scope.activateMe = function(option){
    if(option == 1){
      $scope.activeCustomer = "active";
      $scope.activeFarmer = "";
      $scope.activeProduct = "";
    }else if(option == 2){
      $scope.activeCustomer = "";
      $scope.activeFarmer = "active";
      $scope.activeProduct = "";
    }else if(option == 3){
      $scope.activeCustomer = "";
      $scope.activeFarmer = "";
      $scope.activeProduct = "active";
    }
  }
});
