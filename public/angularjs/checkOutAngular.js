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
  $scope.invalidAddress = false;
  $scope.disableNext = false;
  var billId;

  $scope.validateLocation = function(){
    var address = $scope.deliveryDetails.address;
      console.log("Address "+address);
      var geocoder = new google.maps.Geocoder();
      geocoder.geocode( { 'address': address}, function(results, status) {
      console.log(google.maps.GeocoderStatus);
      if (status == google.maps.GeocoderStatus.OK) {
          console.log("Valid Address");
            geocoder.geocode( { 'address': $scope.deliveryDetails.city}, function(results, status) {
             
                if (status == google.maps.GeocoderStatus.OK) {
                     console.log("Valid City");
                     geocoder.geocode( { 'address': $scope.deliveryDetails.state}, function(results, status) {
                    
                       if (status == google.maps.GeocoderStatus.OK) {
                            console.log("Valid State");
                           geocoder.geocode( { 'address': $scope.deliveryDetails.zip}, function(results, status) {
                         
                            if (status == google.maps.GeocoderStatus.OK) {
                               console.log("All Valid zip");
                             }
                             else{
                              $scope.$apply(function(){
                                $scope.invalidAddress = true;
                                $scope.disableNext = true;
                              });
                          }
                        });
                      }else{
                            $scope.$apply(function(){
                              $scope.invalidAddress = true;
                              $scope.disableNext = true;
                           });
                     }
              });
                }else{
                      $scope.$apply(function(){
                              $scope.invalidAddress = true;
                              $scope.disableNext = true;
                           });
              }
      });
    }
      else if(status == google.maps.GeocoderStatus.ZERO_RESULTS){
        
        console.log("Invalid Address");
        $scope.$apply(function(){
             $scope.invalidAddress = true;
             $scope.disableNext = true;
         });
       
      }
  });
}


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
      $http({

        method: "POST",
        url: '/doOrder',
        data: {
          "name" : $scope.userDetails.name,
          "address" : $scope.userDetails.address,
          "city" : $scope.userDetails.city,
          "state" : $scope.userDetails.state,
          "zip" : $scope.userDetails.zip,
          "phone" : $scope.userDetails.phone,
          "products" : $scope.userDetails.cart
        }
        }).then(function (res) {
          $scope.userDetails = res.data.userDetails;
          console.log("Billing id "+res.data.BILL_ID);
          $scope.customerDetails=res.data.customerDetails;
          billId = res.data.BILL_ID;

        });

    }  
  else if(currentPage == 4){
      console.log("Billing id "+billId);
        window.location.assign('/trackOrder/'+billId);
    }
  }







  //Checkout and cart related code
  // Cart Start
          $scope.cart = [];
          $http({

            method: "GET",
            url: '/getCustomerAccountDetails',
            data: {
            }
            }).then(function (res) {
                $scope.deliveryDetails = res.data.userDetails;
                $scope.deliveryDetails.name = res.data.userDetails.firstName +" " + res.data.userDetails.lastName;
                $scope.isLoggedIn = false;
                if($scope.name)
                {
                  $scope.isLoggedIn = true;
                }
                $scope.creditCardNumber = res.data.customerDetails.CREDIT_CARD_DETAILS.CREDIT_CARD_NUMBER;
                $scope.creditCardName = res.data.customerDetails.CREDIT_CARD_DETAILS.CREDIT_CARD_NAME;
                $scope.expiryMonth = res.data.customerDetails.CREDIT_CARD_DETAILS.EXPIRY_MONTH;
                $scope.expiryYear = res.data.customerDetails.CREDIT_CARD_DETAILS.EXPIRY_YEAR;
                $scope.cvv = res.data.customerDetails.CREDIT_CARD_DETAILS.CVV;
               
            });

            $http({

                method: "POST",
                url: '/getCartDetails',
                data: {
                }

            }).then(function (res) {
                    $scope.cart = res.data.results.CART_PRODUCTS;
            });

            $scope.addToCart = function(productId){
                console.log("Clicked"+productId);
                $http({
                    method:"POST",
                    url:"/addToCart",
                    data:{
                        "productId" : productId
                    }
                    }).success(function(data){
                        if(data.statusCode==401)
                            {

                            }
                        else
                            {
                                var length = $scope.cart.length;
                                console.log("cart length: "+$scope.cart.length);
                                console.log("cart"+$scope.cart);
                                $scope.checkOutBtnClass = "btn btn-primary btn-block btn-proceed-to-checkout-enabled";
                                var productFound = false;
                                for(var i=0;i<$scope.cart.length;i++)
                                {
                                    console.log("reached here");
                                    console.log("product id from cart"+$scope.cart[i].PRODUCT_ID );
                                    console.log("produc id passed for product"+productId);
                                    if($scope.cart[i].PRODUCT_ID == productId)
                                    {
                                        $scope.cart[i].QTY += 1;
                                        productFound = true;
                                    }
                                }
                                if(!productFound)
                                {
                                    $scope.cart[length] = {"PRODUCT_ID" : productId,
                                                        "PRODUCT_NAME" : $scope.displayProductDetails.PRODUCT_NAME,
                                                        "PRICE" : $scope.displayProductDetails.PRICE,
                                                        "QTY" : 1,
                                                        "FILE_NAME" : $scope.displayProductDetails.FILE_NAME}; //change this
                            }
                                }
                                socket.emit('test',{id:"test"});

                    }).error(function(error){

            });
            }

            $scope.removeItemFromCart = function(index){

                $http({
                    method:"POST",
                    url:"/removeItemFromCart",
                    data:{
                        "product" : $scope.cart[index]
                    }
                    }).success(function(data){
                        if(data.statusCode==401)
                            {

                            }
                        else
                            {

                            }
                    }).error(function(error){

                });

                console.log(index);
                if($scope.cart.length == 1){
                  $scope.checkOutBtnClass = "btn btn-primary btn-block btn-proceed-to-checkout-disabled";
                  $scope.cart =[];
                 }
                var length = $scope.cart.length;
                $scope.cart = $scope.cart.splice($scope.cart.indexOf($scope.cart[index],1)); //check this one

            }

            $scope.plusQTY = function(index){
                console.log("index"+index);
                $http({
                    method:"POST",
                    url:"/addToCart",
                    data:{
                        "productId" : $scope.cart[index].PRODUCT_ID
                    }
                    }).success(function(data){
                        if(data.statusCode==401)
                            {

                            }
                        else
                            {
                                $scope.cart[index].QTY+=1;
                            }
                    }).error(function(error){

                });

              
            }
            
            $scope.minusQTY = function(index){
    
                $http({
                    method:"POST",
                    url:"/minusQtyInCart",
                    data:{
                        "product" : $scope.cart[index]
                    }
                    }).success(function(data){
                        if(data.statusCode==401)
                            {

                            }
                        else
                            {                                   
                                if($scope.cart[index].QTY == 1)
                                {
                                    $scope.cart = $scope.cart.splice(index,1);
                                }
                                else
                                {
                                    $scope.cart[index].QTY-=1;    
                                }
                            }
                    }).error(function(error){

                });
            }


            $scope.getTotal = function(){
                var total = 0;
                for(var i = 0; i < $scope.cart.length; i++){
                    total += ($scope.cart[i].PRICE * $scope.cart[i].QTY);
                }
                return total;
            }

            $scope.doProceedToCheckout = function()
            {
                window.location.assign('/checkout');
            }
    //Cart End

});
