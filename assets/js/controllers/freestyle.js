app.controller('freestyleCtrl',function($scope,gameSrvc){
  $scope.test="Freestyle table";

  gameSrvc.addPlayer('David',10000);
  gameSrvc.addPlayer('Comp1',10000);
  gameSrvc.addPlayer('Comp2',10000);

  $scope.players=gameSrvc.getPlayers();

  function updateButtons(){ //~~~need to add it so it is player specific
                            //If it's not human, then run the chart
    $scope.canStand=gameSrvc.canStand();
    $scope.canHit=gameSrvc.canHit();
    $scope.canDouble=gameSrvc.canDouble();
    $scope.canSplit=gameSrvc.canSplit();

  }
  updateButtons();

  $scope.deal=function(){
    gameSrvc.deal();
    updateButtons();
  }
  $scope.hit=function(){
    gameSrvc.hit();
    $scope.canHit=gameSrvc.canHit();
  }
  $scope.stand=function(){
    gameSrvc.stand();
    updateButtons();
  }


})
