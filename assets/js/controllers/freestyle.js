app.controller('freestyleCtrl',function($scope,gameSrvc){
  $scope.test="Freestyle table";

  gameSrvc.addPlayer('David',10000);
  gameSrvc.addPlayer('Comp1',10000);
  gameSrvc.addPlayer('Comp2',10000);

  $scope.players=gameSrvc.getPlayers();

  $scope.deal=function(){
    gameSrvc.deal();
    $scope.canHit=gameSrvc.canHit();
  }
  $scope.hit=function(){
    gameSrvc.hit();
    $scope.canHit=gameSrvc.canHit();
  }
  $scope.stand=gameSrvc.stand();


})
