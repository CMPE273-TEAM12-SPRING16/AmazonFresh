/**
 * Created by aneri on 21-04-2016.
 */
var customerAccount= angular.module("customerAccount",[]);
customerAccount.controller("customerAccount",function($scope,$http)
{
    $scope.customer_id="";
    $http({

        method: "GET",
        url: '/getCustomerAccountDetails',
        data: {
        }

    }).then(function (res) {
        console.log(res.data.userDetails);
        $scope.userDetails = res.data.userDetails;
         $scope.customer_id = res.data.userDetails.userId;
        console.log($scope.userDetails.FIRST_NAME);
        $scope.customerDetails=res.data.customerDetails;
       
    });


    $scope.submit=function()
    {
        console.log($scope.userDetails.firstName);
        console.log($scope.userDetails.ssn);
        $http({

            method:"POST",
            url:'/doUpdateUserDetails',
            data : {
                "firstName":$scope.userDetails.firstName,
                "lastName":$scope.userDetails.lastName,
                "ssn":$scope.userDetails.ssn,
                "password":$scope.userDetails.password,
                "address":$scope.userDetails.address,
                "city":$scope.userDetails.city,
                "state":$scope.userDetails.state,
                "zip":$scope.userDetails.zip,
                "phone":$scope.userDetails.phone,
                "creditCardNumber":$scope.customerDetails.CREDIT_CARD_DETAILS.CREDIT_CARD_NUMBER,
                "creditCardName":$scope.customerDetails.CREDIT_CARD_DETAILS.CREDIT_CARD_NAME,
                "expiryMonth":$scope.customerDetails.CREDIT_CARD_DETAILS.EXPIRY_MONTH,
                "expiryYear":$scope.customerDetails.CREDIT_CARD_DETAILS.EXPIRY_YEAR,
                "cvv":$scope.customerDetails.CREDIT_CARD_DETAILS.CVV,
                "userType":1
            }

        }).success(function(data)
        {
            if (data.statusCode == 401) {
                $scope.registeredEmail = false;
                $scope.unexpectedError = true;
            }
            if(data.statusCode==200)
            {
                console.log("details updated");
                window.location.assign("/customerAccount");
            }
        })
            .error(function(error) {
                $scope.unexpectedError = false;
                $scope.registeredEmail = true;
            });


    };

    $scope.deleteProfile = function(){
    console.log("Farmer ID "+$scope.farmer_id);
    $http({

            method:"POST",
            url:'/doDeleteProfile',
            data: {
              "farmer_id" : $scope.customer_id
            }
          }).then(function(res){
             window.location.assign('/');
            })
  }


    $scope.match=function()
    {

        $scope.passwordMatch=false;

        if($scope.userDetails.password!=$scope.confirmPassword)
        {

            $scope.passwordMatch=true;

        }

    }
}
);