var product=angular.module('product',['ngFileUpload']);
product.controller('product',['Upload','$scope','$http',function(Upload,$scope,$http)
{

	$scope.addProduct= function(){
		console.log("Button clicked");
		Upload.upload({
		url:"/doAddProduct",
		data:{
			"productName" : $scope.productName,
			"unit" : $scope.unit,
			"price" : $scope.price,
			"productDescription" : $scope.productDescription,
			"ingredients" : $scope.ingredients,
			"file" : $scope.file
		}
		}).then(function (resp) { //upload function returns a promise
            if(resp.data.error_code === 0){ //validate success
               
            } else {
               
            }
        });
    } ;
    
}]);