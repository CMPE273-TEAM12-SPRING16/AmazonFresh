var adminNgApp = angular.module("adminNgApp", ['ngRoute', 'ng-fusioncharts']);

adminNgApp.config(['$routeProvider', function($routeProvider) {
   $routeProvider.

   when('/apprReqCustomer', {
      templateUrl: 'ApprReqCustomer', controller: 'ApprReqCustomer'
   }).
   when('/apprReqFarmer', {
      templateUrl: 'apprReqFarmer', controller: 'ApprReqFarmer'
   }).
   when('/apprReqProduct', {
      templateUrl: 'apprReqProduct', controller: 'ApprReqProduct'
   }).
   when('/reviewCust', {
      templateUrl: 'reviewCustomer', controller: 'ReviewCustomer'
   }).
   when('/reviewFarmer', {
      templateUrl: 'reviewFarmer', controller: 'ReviewFarmer'
   }).
   when('/reviewProduct', {
      templateUrl: 'reviewProduct', controller: 'ReviewProduct'
   }).
   when('/dailyRevenue', {
      templateUrl: 'DailyRevenue', controller: 'DailyRevenueCtrl'
   }).
   when('/showBills', {
      templateUrl: 'showBills', controller: 'ShowBillsCtrl'
   }).
   when('/',{
      templateUrl: 'apprReqCustomer', controller: 'ApprReqCustomer'
   })

}]);

adminNgApp.controller('ApprReqCustomer', function($scope,$http) {

  $scope.noResult = false;


        $scope.showPendingCustReq = function(){
          console.log("ApprReqCustomer");
           $http({

            method:"POST",
            url:'/doShowPendingCustAprroval'

        }).success(function(data)
        {

            if(data.statusCode==200)
            {
              if(data.results != ""){
                $scope.pendingCustomers = data.results;
              }else{
                $scope.noResult = true;
              }


            }
        }).error(function(error) {
                $scope.unexpectedError = false;
                $scope.invalidLogin = true;
            });
      }
      $scope.showPendingCustReq();

        $scope.approveCustomer = function(customer_id){
          console.log("approveCustomer"+customer_id);
          $http({

            method:"POST",
            url:'/doApproveCustomer',
            data : {"customer_id" : customer_id}

        }).success(function(data)
        {

            if(data.statusCode==200)
            {

                $scope.showPendingCustReq();
            }
        }).error(function(error) {
                $scope.unexpectedError = false;
                $scope.invalidLogin = true;
            });
        }

        $scope.rejectCustomer = function(customer_id){

          console.log("RejectCustomer"+customer_id);
          $http({

            method:"POST",
            url:'/doRejectCustomer',
            data : {"customer_id" : customer_id}

        }).success(function(data)
        {

            if(data.statusCode==200)
            {

                $scope.showPendingCustReq();
            }
        }).error(function(error) {
                $scope.unexpectedError = false;
                $scope.invalidLogin = true;
            });
        }


});

adminNgApp.controller('ApprReqFarmer', function($scope,$http) {


          console.log("ApprReqFarmer");
           $http({

            method:"POST",
            url:'/doShowPendingFarmerAprroval'

        }).success(function(data)
        {

            if(data.statusCode==200)
            {
              if(data.results != ""){
                $scope.pendingFarmers = data.results
              }else{
                $scope.noResult = true;
              }

            }
        }).error(function(error) {
                $scope.unexpectedError = false;
                $scope.invalidLogin = true;
            });

        $scope.approveFarmer = function(customer_id){
          console.log("approveFarmer"+customer_id);
          $http({

            method:"POST",
            url:'/doApproveFarmer',
            data : {"customer_id" : customer_id}

        }).success(function(data)
        {

            if(data.statusCode==200)
            {

                $scope.showPendingFarmerReq();
            }
        }).error(function(error) {
                $scope.unexpectedError = false;
                $scope.invalidLogin = true;
            });
        }

        $scope.rejectFarmer = function(customer_id){

          console.log("RejectFarmer"+customer_id);
          $http({

            method:"POST",
            url:'/doRejectFarmer',
            data : {"customer_id" : customer_id}

        }).success(function(data)
        {

            if(data.statusCode==200)
            {

                $scope.showPendingFarmerReq();
            }
        }).error(function(error) {
                $scope.unexpectedError = false;
                $scope.invalidLogin = true;
            });
        }

});

adminNgApp.controller('ApprReqProduct', function($scope,$http) {

$scope.showPendingProductReq = function(){
          console.log("showPendingProductReq");
           $http({

            method:"POST",
            url:'/doShowPendingProductAprroval'

        }).success(function(data)
        {

            if(data.statusCode==200)
            {
              if(data.results != ""){
                $scope.pendingProducts = data.results
              }else{
                $scope.noResult = true;
              }
            }
        }).error(function(error) {
                $scope.unexpectedError = false;
                $scope.invalidLogin = true;
            });
      }
      $scope.showPendingProductReq();

        $scope.approveProduct = function(product_id){
          console.log("approveProduct"+product_id);
          $http({

            method:"POST",
            url:'/doApproveProduct',
            data : {"product_id" : product_id}

        }).success(function(data)
        {

            if(data.statusCode==200)
            {

                $scope.showPendingProductReq();
            }
        }).error(function(error) {
                $scope.unexpectedError = false;
                $scope.invalidLogin = true;
            });
        }

        $scope.rejectProduct = function(product_id){

          console.log("rejectProduct"+product_id);
          $http({

            method:"POST",
            url:'/doRejectProduct',
            data : {"product_id" : product_id}

        }).success(function(data)
        {

            if(data.statusCode==200)
            {

                $scope.showPendingProductReq();
            }
        }).error(function(error) {
                $scope.unexpectedError = false;
                $scope.invalidLogin = true;
            });
        }
});

adminNgApp.controller('ReviewCustomer', function($scope,$http) {

   $scope.showAllCustomer = function(){
          console.log("ReviewCustomer");
           $http({

            method:"POST",
            url:'/doShowAllCustomer'

        }).success(function(data)
        {

            if(data.statusCode==200)
            {
                console.log(data);
                $scope.pendingCustomers = data.results
            }
        }).error(function(error) {
                $scope.unexpectedError = false;
                $scope.invalidLogin = true;
            });
      }
      $scope.showAllCustomer();

       $scope.approveCustomer = function(customer_id){
          console.log("approveCustomer"+customer_id);
          $http({

            method:"POST",
            url:'/doApproveCustomer',
            data : {"customer_id" : customer_id}

        }).success(function(data)
        {

            if(data.statusCode==200)
            {

                $scope.showAllCustomer();
            }
        }).error(function(error) {
                $scope.unexpectedError = false;
                $scope.invalidLogin = true;
            });
        }

        $scope.rejectCustomer = function(customer_id){

          console.log("RejectCustomer"+customer_id);
          $http({

            method:"POST",
            url:'/doRejectCustomer',
            data : {"customer_id" : customer_id}

        }).success(function(data)
        {

            if(data.statusCode==200)
            {

                $scope.showPendingCustReq();
            }
        }).error(function(error) {
                $scope.unexpectedError = false;
                $scope.invalidLogin = true;
            });
        }

});

adminNgApp.controller('ReviewFarmer', function($scope,$http) {

           $http({

            method:"POST",
            url:'/reviewFarmer'

        }).success(function(data)
        {

            if(data.statusCode==200)
            {

                $scope.pendingFarmers = data.results
            }
        }).error(function(error) {
                $scope.unexpectedError = false;
                $scope.invalidLogin = true;
            });

        $scope.approveFarmer = function(customer_id){
          console.log("approveFarmer"+customer_id);
          $http({

            method:"POST",
            url:'/doApproveFarmer',
            data : {"customer_id" : customer_id}

        }).success(function(data)
        {

            if(data.statusCode==200)
            {

                $scope.showPendingFarmerReq();
            }
        }).error(function(error) {
                $scope.unexpectedError = false;
                $scope.invalidLogin = true;
            });
        }

        $scope.rejectFarmer = function(customer_id){

          console.log("RejectFarmer"+customer_id);
          $http({

            method:"POST",
            url:'/doRejectFarmer',
            data : {"customer_id" : customer_id}

        }).success(function(data)
        {

            if(data.statusCode==200)
            {

                $scope.showPendingFarmerReq();
            }
        }).error(function(error) {
                $scope.unexpectedError = false;
                $scope.invalidLogin = true;
            });
        }

});

adminNgApp.controller('ReviewProduct', function($scope,$http) {
$scope.reviewProduct = function(){
          console.log("reviewProduct");
           $http({

            method:"POST",
            url:'/reviewProduct'

        }).success(function(data)
        {

            if(data.statusCode==200)
            {

                $scope.pendingProducts = data.results
            }
        }).error(function(error) {
                $scope.unexpectedError = false;
                $scope.invalidLogin = true;
            });
      }
      $scope.reviewProduct();

        $scope.approveProduct = function(product_id){
          console.log("approveProduct"+product_id);
          $http({

            method:"POST",
            url:'/doApproveProduct',
            data : {"product_id" : product_id}

        }).success(function(data)
        {

            if(data.statusCode==200)
            {

                $scope.showPendingProductReq();
            }
        }).error(function(error) {
                $scope.unexpectedError = false;
                $scope.invalidLogin = true;
            });
        }

        $scope.rejectProduct = function(product_id){

          console.log("rejectProduct"+product_id);
          $http({

            method:"POST",
            url:'/doRejectProduct',
            data : {"product_id" : product_id}

        }).success(function(data)
        {

            if(data.statusCode==200)
            {

                $scope.showPendingProductReq();
            }
        }).error(function(error) {
                $scope.unexpectedError = false;
                $scope.invalidLogin = true;
            });
        }

});

adminNgApp.controller('ShowBillsCtrl', function($scope,$http) {
  $scope.noBills = false;
  $http({
    method : "GET",
    url : '/fetchAllBills',

  }).then(function(res) {
    if(res.data.statusCode == 200){
      $scope.allBills = res.data.result;
      console.log($scope.purchaseHistory);
      if($scope.allBills.length == 0){
        $scope.noBills = true;
      }
    }
  },function(err) {
    console.log(err);
  });
});


adminNgApp.controller('DailyRevenueCtrl', function($scope,$http) {

  var monthDisplay = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var monthData = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  $scope.chartMonth = "5";
  $scope.monthDisplay = "May";
  var catArray = [];
  var valArray = [];
  var average = 0;
  for(i=0; i<30; i++){
    catArray.push({
        "label": "'"+i+"'"
    });
    valArray.push({
      "value" : 0
    });
  }

  $scope.myDataSource = {
    "chart": {
      "caption": "Comparison of Daily Revenue",
      "xAxisname": "Date",
      "yAxisName": "Revenues (In USD)",
      "numberPrefix": "$",
      "plotFillAlpha": "80",
      "paletteColors": "#0075c2,#1aaf5d",
      "baseFontColor": "#333333",
      "baseFont": "Helvetica Neue,Arial",
      "captionFontSize": "14",
      "subcaptionFontSize": "14",
      "subcaptionFontBold": "0",
      "showBorder": "0",
      "bgColor": "#ffffff",
      "showShadow": "0",
      "canvasBgColor": "#ffffff",
      "canvasBorderAlpha": "0",
      "divlineAlpha": "100",
      "divlineColor": "#999999",
      "divlineThickness": "1",
      "divLineDashed": "1",
      "divLineDashLen": "1",
      "divLineGapLen": "1",
      "usePlotGradientColor": "0",
      "showplotborder": "0",
      "valueFontColor": "#ffffff",
      "placeValuesInside": "1",
      "showHoverEffect": "1",
      "rotateValues": "1",
      "showXAxisLine": "1",
      "xAxisLineThickness": "1",
      "xAxisLineColor": "#999999",
      "showAlternateHGridColor": "0",
      "legendBgAlpha": "0",
      "legendBorderAlpha": "0",
      "legendShadow": "0",
      "legendItemFontSize": "10",
      "legendItemFontColor": "#666666"
    },
    "categories": [
      {
        "category": catArray
      }
    ],
    "dataset": [
      {
        "seriesname": "Month of "+$scope.monthDisplay,
        "data": valArray
      }
    ],
    "trendlines": [
      {
        "line": [
          {
            "startvalue": average,
            "color": "#1aaf5d",
            "displayvalue": "Daily {br}Average",
            "valueOnRight": "1",
            "thickness": "3",
            "showBelow": "1",
            "tooltext": "Average revenue per Day: "+average
          }
        ]
      }
    ]
  };

  $scope.fetchChart = function(){
    var index = parseInt($scope.chartMonth);
    index = index - 1;
    var month = monthData[index];
    $http({
      method : "POST",
      url : '/fetchDailyRevenue',
      data : {
        "chartMonth" : month
      }

    }).then(function(res) {
      if(res.data.statusCode == 200){
        var catArray = res.data.catArray;
        var valArray = res.data.valArray;
        var average = res.data.average;
        $scope.myDataSource = {
          "chart": {
            "caption": "Comparison of Daily Revenue",
            "xAxisname": "Date",
            "yAxisName": "Revenues (In USD)",
            "numberPrefix": "$",
            "plotFillAlpha": "80",
            "paletteColors": "#0075c2,#1aaf5d",
            "baseFontColor": "#333333",
            "baseFont": "Helvetica Neue,Arial",
            "captionFontSize": "14",
            "subcaptionFontSize": "14",
            "subcaptionFontBold": "0",
            "showBorder": "0",
            "bgColor": "#ffffff",
            "showShadow": "0",
            "canvasBgColor": "#ffffff",
            "canvasBorderAlpha": "0",
            "divlineAlpha": "100",
            "divlineColor": "#999999",
            "divlineThickness": "1",
            "divLineDashed": "1",
            "divLineDashLen": "1",
            "divLineGapLen": "1",
            "usePlotGradientColor": "0",
            "showplotborder": "0",
            "valueFontColor": "#ffffff",
            "placeValuesInside": "1",
            "showHoverEffect": "1",
            "rotateValues": "1",
            "showXAxisLine": "1",
            "xAxisLineThickness": "1",
            "xAxisLineColor": "#999999",
            "showAlternateHGridColor": "0",
            "legendBgAlpha": "0",
            "legendBorderAlpha": "0",
            "legendShadow": "0",
            "legendItemFontSize": "10",
            "legendItemFontColor": "#666666"
          },
          "categories": [
            {
              "category": catArray
            }
          ],
          "dataset": [
            {
              "seriesname": "Month of "+$scope.monthDisplay,
              "data": valArray
            }
          ],
          "trendlines": [
            {
              "line": [
                {
                  "startvalue": average,
                  "color": "#1aaf5d",
                  "displayvalue": "Month{br}Average",
                  "valueOnRight": "1",
                  "thickness": "3",
                  "showBelow": "1",
                  "tooltext": "Current year quarterly target "+average
                }
              ]
            }
          ]
        };

      }
    },function(err) {
      console.log(err);
    });
  }
  $scope.fetchChart();

});






adminNgApp.controller('AdminPageCtrl', function($scope, $http){
  $scope.activeCustomer = "active";
  $scope.activeFarmer = "";
  $scope.activeProduct = "";

  //________________________SEARCH THINGS____________________//
  $scope.isSearch = false;
  $scope.isSearch1 = false;
  $scope.isSearch2 = false;
  $scope.searchResults = [];
  $scope.searchType = 'Customer Name';
  $scope.noSearchResult = false;
  //________________________SEARCH THINGS OVER____________________//

  $scope.activateMe = function(option){
    $scope.isSearch = false;
    $scope.isSearch1 = false;
    $scope.isSearch2 = false;
    $scope.isSearch3 = false;
    $scope.searchResult = null;
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
    else if(option == 4){
      $scope.activeRevCustomer = "active";
      $scope.activeRevFarmer = "";
      $scope.activeRevProduct = "";
    }
    else if(option == 5){
      $scope.activeRevCustomer = "";
      $scope.activeRevFarmer = "active";
      $scope.activeRevProduct = "";
    }
    else if(option == 6){
      $scope.activeRevCustomer = "";
      $scope.activeRevFarmer = "";
      $scope.activeRevProduct = "active";
    }
  }

  //Search Function..........................................................//
  $scope.doSearch = function(){
    $scope.isSearch = true;
    $scope.searchResults = null;
    $scope.noSearchResult = false;
    var searchString = $scope.searchString;
    var searchType;
    console.log($scope.searchType);
    if($scope.searchType == 'Customer Name'){//Select search type
      $scope.isSearch1 = true;
      $scope.isSearch2 = false;
      $scope.isSearch3 = false;
      searchType = 1;
    }else if($scope.searchType == 'Farmer Name'){
      $scope.isSearch1 = true;
      $scope.isSearch2 = false;
      $scope.isSearch3 = false;
      searchType = 2;
    }else if($scope.searchType == 'Product Name'){
      $scope.isSearch1 = false;
      $scope.isSearch2 = true;
      $scope.isSearch3 = false;
      searchType = 3;
    }else if($scope.searchType == 'Bill ID'){
      $scope.isSearch1 = false;
      $scope.isSearch2 = false;
      $scope.isSearch3 = true;
      searchType = 4;
    }

    if(searchString != ""){
      $http({
        method : "POST",
        url : '/doSearchAdmin',
        data : {
          "searchString" : searchString,
          "searchType" : searchType
        }

      }).then(function(res) {
        if(res.data.statusCode == 200){
          $scope.searchResults = res.data.searchResults;
          if($scope.searchResults.length == 0){
            $scope.noSearchResult = true;
          }
        }

      },function() {

      });

    }else{
      $scope.isSearch = false;
      $scope.searchResult = null;
    }
  }
});
