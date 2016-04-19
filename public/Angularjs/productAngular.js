var product=angular.module('product',[]);
product.controller('product',function($scope,$http)
{

	$scope.addProduct= function(){
		console.log("Button clicked");
		$http({
		method:"POST",
		url:"/doAddProduct",
		data:{
			"productName" : $scope.productName,
			"unit" : $scope.password,
			"price" : $scope.price,
			"productDescription" : $scope.productDescription,
			"ingredients" : $scope.ingredients,
			"file" : $scope.file
		}
		}).success(function(data){
			
		}).error(function(error){
			
		});
	}


});