app.controller('countCtrl',function($scope,gameSrvc){
  $scope.test="counting table"
  gameSrvc.clearAllPlayers();

})
