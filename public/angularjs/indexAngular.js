
var app=angular.module('indexAngular',[]);


app.controller('LoginController',function($scope,$http)
{
    $scope.isNotApproved=true;
    $scope.isPending=true;
    $scope.invalidLogin=true;
    $scope.unexpectedError=true;

    $scope.submit=function()
    {


      console.log($scope.email);

        $http({

            method:"POST",
            url:'/doLogin',
            data : {
                "email":$scope.email,
                "password":$scope.password
            }


        }).then(function(res){
            console.log(res.data.isApproved);
            if (res.data.statusCode == 200) {

           if(res.data.isApproved==1) {


                   if (res.data.userType == 1) {
                       window.location.assign("/");
                   } else if (res.data.userType == 2) {
                       window.location.assign("/farmerHome");
                   } else if (res.data.userType == 0) {
                       window.location.assign("/adminHome");
                   }
               } }
           else if (res.data.statusCode == 401) {
                   console.log("invalid login");
                   $scope.invalidLogin = false;
                   $scope.unexpectedError = true;
               }


            else if(res.data.isApproved==0)
           {
               $scope.isPending=false;
           }
           else if(res.data.isApproved==2)
           {
               console.log("is approved is 2")
               $scope.isNotApproved=false;
           }
        }, function(res) { //this will be called on error
          console.log(res.data);
        });


    };



});



app.controller('IndexPageController',function($scope,$http){
var product_count = 0;
$scope.products = [];
  $scope.isLoggedIn = false;
    $scope.cart = [];

    $scope.checkOutBtnClass = "btn btn-primary btn-block btn-proceed-to-checkout-disabled";

  //________________________SEARCH THINGS____________________//
  $scope.isSearch = false;
  $scope.searchedProducts = {};
  $scope.searchType = 'Name';

  //________________________SEARCH THINGS OVER____________________//

  //___________________BREAD_CRUMB_START___________________//
  $scope.bcHomeClass = "active";
  $scope.bcSearchResultsClass = "inactive";
  //___________________BREAD_CRUMB_OVER___________________//

    $http({ //GET LOGGED IN USER DETAILS

        method: "POST",
        url: '/getLoggedInUserDetails',
        data: {
        }

    }).then(function (res) {
            $scope.firstName = res.data.firstName;
            $scope.lastName = res.data.lastName;
            $scope.email = res.data.email;
            $scope.city = res.data.city;
            $scope.userId = res.data.userId;
            if(res.data.firstName)
            {
                $scope.isLoggedIn = true;
            }
            console.log("first name"+$scope.firstName+"lastName"+$scope.lastName+" isLoggedIn "+$scope.isLoggedIn);
    });

    $http({ // GET PRODUCTS

      method:"POST",
      url:'/doFetch10ProductsOnIndex',
      data : {
        "count" : product_count
      }

    }).success(function(data)
    {

      if(data.statusCode==200)
      {
        console.log(data.results);

          for(i=0; i<data.results.length; i++){
            $scope.products.push(data.results[i]);
          }


        product_count = product_count + data.results.length;

      }
    }).error(function(error) {
      console.log(error);
    });

    //Search Function..........................................................//
    $scope.doSearch = function(){
      $scope.isSearch = true;
      $scope.searchedProducts = [];
      $scope.bcHomeClass = "inactive";
      $scope.bcSearchResultsClass = "active";
      var searchString = $scope.searchString;
      var searchType;
      if($scope.searchType == 'Name'){//Select search type
        searchType = 1;
      }else if($scope.searchType == 'Farmer'){
        searchType = 2;
      }

      if(searchString != ""){
        $http({
          method : "POST",
          url : '/doSearch',
          data : {
            "searchString" : searchString,
            "searchType" : searchType
          }

        }).then(function(res) {
          if(res.data.statusCode == 200){
            $scope.searchedProducts = res.data.searchResults;
          }

        },function() {

        });

      }else{
        $scope.searchShow = false;
        $scope.searchResult = null;
      }
    }

    $scope.loadProducts = function(){
         $http({ // GET PRODUCTS

      method:"POST",
      url:'/doFetch10ProductsOnIndex',
      data : {
        "count" : product_count
      }

    }).success(function(data)
    {
        if(data.statusCode==200)
      {
        for(i=0;i<30;i++){
            $scope.products.push(data.results[i]);
            $scope.length = data.results.length;
            }
             product_count = product_count + data.results.length;
             console.log(product_count);
        }
    });
}


    //Cart start
    $http({

        method: "POST",
        url: '/getLoggedInUserDetails',
        data: {
        }

    }).then(function (res) {
        $scope.firstName = res.data.firstName;
        $scope.lastName = res.data.lastName;
        $scope.email = res.data.email;
        $scope.city = res.data.city;
        $scope.userId = res.data.userId;
        if(res.data.firstName)
        {
            $scope.isLoggedIn = true;
        }
    });

    $http({

        method: "POST",
        url: '/getCartDetails',
        data: {
        }

    }).then(function (res) {
        $scope.cart = res.data.results.CART_PRODUCTS;
        if($scope.cart.length>0)
        {
            $scope.checkOutBtnClass = "btn btn-primary btn-block btn-proceed-to-checkout-enabled";
        }
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
                        "PRODUCT_NAME" : data.productName,
                        "PRICE" : data.price,
                        "QTY" : 1,
                        "FILE_NAME" : data.fileName}; //change this
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

    $scope.addReview = function(product_id,avg_rating){
        console.log("product_id"+avg_rating);

        $http({
            method: "POST",
            url: '/addProductReview',
            data: {
                "avg_rating" : avg_rating,
                "product_id" : product_id,
                "ratings" : $scope.rating,
                "title" : $scope.title,
                "review" : $scope.review
            }
        }).then(function (res) {
            $scope.firstName = res.data.firstName;
            $scope.lastName = res.data.lastName;
            $scope.email = res.data.email;
            $scope.city = res.data.city;
            $scope.userId = res.data.userId;
            if(res.data.firstName)
            {
                $scope.isLoggedIn = true;
            }
        },function(err){
            console.log(err);
        });
    }

    $scope.doProceedToCheckout = function()
    {
        window.location.assign('/checkout');
    }

    //Cart End
});
