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

   otherwise({
      redirectTo: '/adminHome'
   });

}]);

adminNgApp.controller('ApprReqCustomer', function($scope) {

});

adminNgApp.controller('ApprReqFarmer', function($scope) {

});

adminNgApp.controller('ApprReqProduct', function($scope) {

});
