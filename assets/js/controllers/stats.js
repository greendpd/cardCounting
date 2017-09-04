app.controller('statsCtrl',function($scope,$http,gameSrvc,httpSrvc){
  gameSrvc.clearAllPlayers();
  $scope.chartFollowPercent="";
  $scope.gamesPlayed=""
  $scope.averageBet="";


  $http({
    method: "GET",
    url: "/api/getStats/1",
  }).then((response)=>{
    let gamesFollowedChart=0;
    let totalBet=0;
    response.data.forEach((cur,i,arr)=>{
      if(cur.followchart){
        gamesFollowedChart++;
      }

    })
    $scope.chartFollowPercent=100*(gamesFollowedChart/response.data.length).toFixed(4);
    $scope.gamesPlayed=response.data.length;
  })

})
