app.controller('aboutCtrl',function($scope,gameSrvc){
  $scope.test="about page is working"
  gameSrvc.clearAllPlayers();

})
