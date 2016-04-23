var checkOutApp = angular.module("checkoutAngular", ['ngRoute']);

checkOutApp.config(['$routeProvider', function($routeProvider) {
   $routeProvider.

   when('deliveryDetails', {
      templateUrl: 'deliveryDetailsCheckout', controller: 'DeliveryDetails'
   }).
   when('/paymentDetails', {
      templateUrl: 'paymentDetailsCheckout', controller: 'PaymentDetails'
   }).
   when('/reviewDetails', {
      templateUrl: 'reviewDetailsCheckout', controller: 'ReviewDetails'
   }).
   when('/confirmDetails',{
      templateUrl: 'confirmDetailsCheckout', controller: 'ConfirmDetails'
   }).
   when('/',{
      templateUrl: 'deliveryDetailsCheckout', controller: 'DeliveryDetails'
   })

}]);

checkOutApp.controller('DeliveryDetails', function($scope,$http) {


});

checkOutApp.controller('PaymentDetails', function($scope,$http) {


});

checkOutApp.controller('ReviewDetails', function($scope) {

});

checkOutApp.controller('AdminPageCtrl', function($scope){

});



checkOutApp.controller('checkOutProcessController', function($scope, $http){


  $scope.classDeliveryAddress = "col-xs-3 bs-wizard-step active";
  $scope.classPaymentDetails = "col-xs-3 bs-wizard-step disabled";
  $scope.classReviewDetails = "col-xs-3 bs-wizard-step disabled";
  $scope.classConfirmation = "col-xs-3 bs-wizard-step disabled";
  $scope.nextHREF = "#paymentDetails";
  $scope.nextNUMBER = 1;
  $scope.buttonLabel = "Next";

  $scope.checkOutNext = function(currentPage){

    if(currentPage == 1){
      $scope.classDeliveryAddress = "col-xs-3 bs-wizard-step complete";
      $scope.classPaymentDetails = "col-xs-3 bs-wizard-step active";
      $scope.nextHREF = "#paymentDetails";
      $scope.buttonLabel = "Next";
      $scope.nextNUMBER = 2;
    } else if(currentPage == 2){
      $scope.classPaymentDetails = "col-xs-3 bs-wizard-step complete";
      $scope.classReviewDetails = "col-xs-3 bs-wizard-step active";
      $scope.nextHREF = "#reviewDetails";
      $scope.buttonLabel = "Confirm Order";
      $scope.nextNUMBER = 3;
    } else if(currentPage == 3){
      $scope.classReviewDetails = "col-xs-3 bs-wizard-step complete";
      $scope.classConfirmation = "col-xs-3 bs-wizard-step active";
      $scope.nextHREF = "#confirmDetails";
      $scope.buttonLabel = "Track Your Order";
      $scope.nextNUMBER = 4;
    } else if(currentPage == 4){
      $scope.nextHREF = "/trackOrder/XXXXXXXXXXXXXXXXXX"; //need to add order ID at the end somehow
    }
  }

});
