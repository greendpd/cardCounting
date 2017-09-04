app.controller('countCtrl',function($scope,gameSrvc,initSrvc){
  gameSrvc.clearAllPlayers();
  gameSrvc.setForceResult(false);
  let humanPlayerNum=0;

  gameSrvc.addPlayer('David', 10000);
  gameSrvc.addPlayer('Comp1', 10000);
  gameSrvc.addPlayer('Comp2', 10000);
  gameSrvc.addPlayer('Comp3', 10000);

  initSrvc.showCountTrainOptions($scope);
  $scope.players = gameSrvc.getPlayers();
  $scope.human = $scope.players[humanPlayerNum];

  $scope.currentCount=gameSrvc.getCount();



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
    $scope.showStand = gameSrvc.canStand(humanPlayerNum);
    $scope.showHit = gameSrvc.canHit(humanPlayerNum);
    $scope.showDouble = gameSrvc.canDouble(humanPlayerNum);
    $scope.showSplit = gameSrvc.canSplit(humanPlayerNum);
    $scope.canBet = !gameSrvc.gameIsLive();
    $scope.canDeal = !gameSrvc.gameIsLive();
  }


    $scope.deal=function(){
      $scope.currentCount=gameSrvc.getCount();
      console.log(`Human Bet: ${$scope.human.bet}\nHuman money: ${$scope.human.money}`);
      $scope.human.money=10000;
      $scope.human.bet=100;
      gameSrvc.deal(true,true);
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
