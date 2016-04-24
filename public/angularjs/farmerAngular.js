var farmer=angular.module('farmer',['ngFileUpload', 'ngRoute']);
farmer.config(['$routeProvider', function($routeProvider) {
            console.log("Router Provider");
            $routeProvider.
                when('/productList', {
                    templateUrl: 'productList',
                    controller: 'ProductListController'
                }).
                when('/myProfile', {
                    templateUrl: 'myProfile',
                    controller: 'EditProfileController'
                }).
                when('/addProduct', {
                    templateUrl: 'addProductTemplate',
                    controller: 'AddProductController'
                }).
                when('/',{
                    templateUrl: 'productList', controller: 'ProductListController'
                 })
}]);

farmer.controller("ProductListController", function($scope,$http) {
		console.log("ProductListController");
        $scope.getProductList = function(){
            console.log("GetProductList");
        $scope.successUpdateProfile = true;
       $http({

            method:"POST",
            url:'/doShowProductList'

        }).success(function(data)
        {

            if(data.statusCode==200)
            {
                console.log(data.results);
               $scope.productLists = data.results;
            }
        }).error(function(error) {
                $scope.unexpectedError = false;
                $scope.invalidLogin = true;
            });
}
$scope.getProductList();



        $scope.edit_product = function(product){

    	console.log(product)
    	Upload.upload({
		url:"/doEditProduct",
		data:{
			"productId" : $scope.product_id,
			"productName" : $scope.edit_product_name,
			"noOfunits" : $scope.edit_noOfUnits,
			"units" : $scope.edit_units,
			"price" : $scope.edit_price,
			"productDescription" : $scope.edit_productDescription,
			"file" : $scope.file
		}
		}).then(function (resp) { //upload function returns a promise
			console.log(resp.data.statusCode);
            if(resp.data.statusCode == 200){ //validate success
            	console.log("Added");
               $scope.successUpdatedProduct = false;
            } else {

            }
        });
    }

    $scope.setDeleteProduct = function(product){
    	console.log("SetDeleteProduct");
    	console.log(product);
    	$scope.productDelete = product;
    }

});


 farmer.controller("EditProfileController", function($scope,$http) {
        console.log("Edit Profile");
       $http({

            method:"POST",
            url:'/doShowProfile'

        }).success(function(data)
        {
            console.log(data);
            if(data.statusCode==200)
            {

               $scope.first_name = data.results.FIRST_NAME;
               $scope.last_name = data.results.LAST_NAME;
               $scope.ssn = data.results.SSN;
               $scope.email_id = data.results.EMAIL_ID;
               $scope.address = data.results.ADDRESS;
               $scope.city = data.results.CITY;
               $scope.state = data.results.STATE;
               $scope.zip_code = data.results.ZIP;
               $scope.phone = data.results.PHONE_NUMBER;
            }
        }).error(function(error) {
                $scope.unexpectedError = false;
                $scope.invalidLogin = true;
            });


        $scope.updateProfile = function(){
		console.log("updateProfile");
		$http({

            method:"POST",
            url:'/doUpdateProfile',
            data: {
            	"first_name" : $scope.first_name,
            	"last_name" : $scope.last_name,
            	"ssn" : $scope.ssn,
            	"address" : $scope.address,
            	"city" : $scope.city,
            	"state" : $scope.state,
            	"zip" : $scope.zip_code,
            	"phone" : $scope.phone
            }

        }).success(function(data)
        {
         	console.log(data);
            if(data.statusCode==200)
            {
            	console.log("Updated!!!");
            	$scope.successUpdateProfile = false;
            }
        }).error(function(error) {

            });
	}
    });


 farmer.controller("AddProductController", ['Upload','$scope','$http',function(Upload,$scope,$http){
 	$scope.successAddProduct = true;


 	$scope.addProduct = function(){
      Upload.upload({
		url:"/doAddProduct",
		data:{
			"productName" : $scope.productName,
			"noOfunits" : $scope.noOfUnits,
			"units" : $scope.units,
			"price" : $scope.price,
			"productDescription" : $scope.productDescription,
			"file" : $scope.file
		}
		}).then(function (resp) { //upload function returns a promise
			console.log(resp.data.statusCode);
            if(resp.data.statusCode == 200){ //validate success
            	console.log("Added");
               $scope.successAddProduct = false;
            } else {

            }
        });
	}
    }]);

farmer.controller('FarmerPageController',['Upload','$scope','$http',function(Upload,$scope,$http)
{
	$scope.showProductList = true;
	$scope.showPersonalDetails = false;
	$scope.showProdcutDetails = false;
	$scope.successUpdateProfile = true;
	$scope.successAddProduct = true;
	$scope.successUpdatedProduct = true;

  $scope.active1 = "active";
  $scope.active2 = "";
  $scope.active3 = "";

  $scope.activateMe = function(option){
    if(option == 1){
      $scope.active1 = "active";
      $scope.active2 = "";
      $scope.active3 = "";
    }else if(option == 2){
      $scope.active1 = "";
      $scope.active2 = "active";
      $scope.active3 = "";
    }else if(option == 3){
      $scope.active1 = "";
      $scope.active2 = "";
      $scope.active3 = "active";
    }
  }

    $scope.edit_product = function(product){

    	console.log(product)
    	Upload.upload({
		url:"/doEditProduct",
		data:{
			"productId" : $scope.product_id,
			"productName" : $scope.edit_product_name,
			"noOfunits" : $scope.edit_noOfUnits,
			"units" : $scope.edit_units,
			"price" : $scope.edit_price,
			"productDescription" : $scope.edit_productDescription,
			"file" : $scope.file
		}
		}).then(function (resp) { //upload function returns a promise
			console.log(resp.data.statusCode);
            if(resp.data.statusCode == 200){ //validate success
            	console.log("Added");
               $scope.successUpdatedProduct = false;
            } else {

            }
        });
    }

    $scope.delete_product = function(product){

    	console.log("product"+product);
    	$http({

            method:"POST",
            url:'/doDeleteProduct',
            data:{
            	"product_id" : product._id
            }

        }).success(function(data)
        {
            console.log(data);
            if(data.statusCode==200)
            {

            }
        }).error(function(error) {
                $scope.unexpectedError = false;
                $scope.invalidLogin = true;
            });
    }

     $scope.editProduct = function(product){
        	console.log("set edit page");
        	console.log(product);
        	$scope.product_id = product._id,
        	$scope.edit_product_name= product.PRODUCT_NAME,
        	$scope.edit_noOfUnits = product.NOOFUNITS,
        	$scope.edit_units = product.UNIT,
        	$scope.edit_price = product.PRICE,
        	$scope.edit_productDescription = product.PRODUCT_DESCRIPTION,
        	$scope.file = product.FILE_NAME
        }

}]);
