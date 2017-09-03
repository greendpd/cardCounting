app.controller('chartCtrl', function($scope,gameSrvc){
  $scope.test="Chart table";
  gameSrvc.clearAllPlayers();
})
