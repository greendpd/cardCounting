app.controller('statsCtrl',function($scope,$http,gameSrvc,httpSrvc){
  gameSrvc.clearAllPlayers();
  $scope.user="";
  $scope.chartFollowPercent="";


  $http({
    method: "GET",
    url: "/api/getStats/1",
  }).then((response)=>{
    console.log(response);
  })

})
