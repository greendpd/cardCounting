app.controller('homeCtrl',function($scope,gameSrvc){
  $scope.test="Home Controller Working"
  gameSrvc.clearAllPlayers();
})
