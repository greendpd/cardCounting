app.controller('chartCtrl', function($scope,gameSrvc){
  $scope.test="Chart table";
  humanPlayerNum=0;
  gameSrvc.clearAllPlayers();
  gameSrvc.addPlayer("User",10000);

  $scope.canBet=false;
  $scope.showBet=false;
  $scope.canDeal=true;

  $scope.players=gameSrvc.getPlayers();
  $scope.human=$scope.players[humanPlayerNum];

  function updateButtons(){
    $scope.showStand=gameSrvc.canStand(humanPlayerNum);
    $scope.showHit=gameSrvc.canHit(humanPlayerNum);
    $scope.showDouble=gameSrvc.canDouble(humanPlayerNum);
    $scope.showSplit=gameSrvc.canSplit(humanPlayerNum);
  }

  $scope.deal=function(){
    console.log(`Human Bet: ${$scope.human.bet}\nHuman money: ${$scope.human.money}`);
    $scope.human.money=10000;
    $scope.human.bet=100;
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
