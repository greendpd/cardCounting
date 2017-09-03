app.controller('freestyleCtrl',function($scope,gameSrvc){
  const humanPlayerNum=0;

  let dealerTop=-1;

  $scope.test="Freestyle table";


  gameSrvc.addPlayer('David',10000);
  gameSrvc.addPlayer('Comp1',10000);
  gameSrvc.addPlayer('Comp2',10000);
  gameSrvc.addPlayer('Comp3',10000);


  $scope.players=gameSrvc.getPlayers();
  $scope.human=$scope.players[humanPlayerNum];


  function updateButtons(){
                            //If it's not human, then run the chart
    $scope.canStand=gameSrvc.canStand(humanPlayerNum);
    $scope.canHit=gameSrvc.canHit(humanPlayerNum);
    $scope.canDouble=gameSrvc.canDouble(humanPlayerNum);
    $scope.canSplit=gameSrvc.canSplit(humanPlayerNum);
  }

  updateButtons();

  $scope.deal=function(){
    gameSrvc.deal();
    $scope.dealerTop=gameSrvc.humanDealerCard();
    $scope.dealerStyles=gameSrvc.getDealerStyles();


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
