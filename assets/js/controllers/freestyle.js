app.controller('freestyleCtrl', function($scope, gameSrvc,initSrvc,deckSrvc) {
  const humanPlayerNum = 0;

  gameSrvc.clearAllPlayers();
  gameSrvc.setForceResult(false);

  gameSrvc.addPlayer('David', 10000);
  gameSrvc.addPlayer('Comp1', 10000);
  gameSrvc.addPlayer('Comp2', 10000);

  initSrvc.showFreestyleOptions($scope);


  $scope.players = gameSrvc.getPlayers();
  $scope.human = $scope.players[humanPlayerNum];
  $scope.currentRemaining=deckSrvc.cardsRemaining();


  function updateButtons() {
    if (!gameSrvc.gameIsLive()) {
      if ($scope.human.wonGame===2) {
        result = "Blackjack!"
      } else if($scope.human.wonGame===1){
          $scope.result = "You Won!!!";
      } else if ($scope.human.wonGame===-1){
        $scope.result = "House wins"
      }else if($scope.human.wonGame===0){
        $scope.result="Push";
      }
    } else {
      $scope.result = "";
    }
    $scope.dealerValue=gameSrvc.getDealerValue();
    $scope.showStand = gameSrvc.canStand(humanPlayerNum);
    $scope.showHit = gameSrvc.canHit(humanPlayerNum);
    $scope.showDouble = gameSrvc.canDouble(humanPlayerNum);
    $scope.showSplit = gameSrvc.canSplit(humanPlayerNum);
    $scope.canBet = !gameSrvc.gameIsLive();
    $scope.canDeal = !gameSrvc.gameIsLive();
    if(gameSrvc.getWillShuffle()){
      $scope.dealButtonText="Shuffle and Deal";
    }else{
      $scope.dealButtonText="Deal";
    }
    $scope.currentRemaining=deckSrvc.cardsRemaining();

  }

  updateButtons();

  $scope.deal = function() {
    gameSrvc.deal();
    $scope.dealerTop = gameSrvc.humanDealerCard();
    $scope.dealerStyles = gameSrvc.getDealerStyles();


    updateButtons();
  }
  $scope.hit = function() {
    gameSrvc.hit();
    updateButtons();
  }
  $scope.stand = function() {
    gameSrvc.stand();
    updateButtons();
  }

  $scope.double = function() {
    gameSrvc.double();
    updateButtons();
  }

  $scope.split = function() {
    gameSrvc.split();
    updateButtons();
  }
})
