app.controller('freestyleCtrl',function($scope,gameSrvc){
  $scope.test="Freestyle table";

  gameSrvc.addPlayer('David',10000);
  gameSrvc.addPlayer('Comp1',10000);
  gameSrvc.addPlayer('Comp2',10000);

  $scope.players=gameSrvc.getPlayers();

  function updateButtons(){ //~~~need to add it so it is player specific
                            //If it's not human, then run the chart
    $scope.canStand=gameSrvc.canStand(0);
    $scope.canHit=gameSrvc.canHit(0);
    $scope.canDouble=gameSrvc.canDouble(0);
    $scope.canSplit=gameSrvc.canSplit(0);
  }

  updateButtons();

  $scope.deal=function(){
    gameSrvc.deal();
    updateButtons();
  }
  $scope.hit=function(){
    gameSrvc.hit();
    updateButtons();
  }
  $scope.stand=function(){
    gameSrvc.stand();
    updateButtons();
  }

  $scope.double=function(){
    gameSrvc.double();
    updateButtons();
  }

  $scope.split=function(){
    gameSrvc.split();
    updateButtons();
  }


})
