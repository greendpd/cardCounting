app.controller('freestyleCtrl',function($scope,gameSrvc){
  const humanPlayerNum=0;
  const TOTALSIZE=1000;
  let cardWidth=Math.floor(TOTALSIZE/14.02);
  let initialWidthOffset=Math.floor(TOTALSIZE/136.36);
  let initialHeightOffset=Math.floor(TOTALSIZE/176.47);
  let spaceBetweenCards=Math.floor(TOTALSIZE/187.5);
  let cardHeight=Math.floor(TOTALSIZE/9.375);
  let spaceHeightBetween=Math.floor(TOTALSIZE/176.47)
  let borderRadius=Math.floor(TOTALSIZE/176.47)

  $scope.test="Freestyle table";


  gameSrvc.addPlayer('David',10000);
  gameSrvc.addPlayer('Comp1',10000);
  gameSrvc.addPlayer('Comp2',10000);


  $scope.theStyle=getCardStyle();
  console.log(getCardStyle());

  $scope.players=gameSrvc.getPlayers();
  $scope.human=$scope.players[humanPlayerNum];

  function updateButtons(){
                            //If it's not human, then run the chart
    $scope.canStand=gameSrvc.canStand(humanPlayerNum);
    $scope.canHit=gameSrvc.canHit(humanPlayerNum);
    $scope.canDouble=gameSrvc.canDouble(humanPlayerNum);
    $scope.canSplit=gameSrvc.canSplit(humanPlayerNum);
  }

  function getCardStyle(machineCard){
    machineCard=29;
    let cardNum=machineCard%13;
    let suit=Math.floor(machineCard/13);
    return `width:${cardWidth}px; height:${cardHeight}px; background:url('../images/cards.svg') -${initialWidthOffset+cardNum*(spaceBetweenCards+cardWidth)}px -${initialHeightOffset+suit*(spaceHeightBetween+cardHeight)}px;background-size:${TOTALSIZE}px auto;border-radius:${borderRadius}px`
  }

  updateButtons();

  $scope.deal=function(){
    gameSrvc.deal();
    $scope.dealerTop=gameSrvc.humanDealerCard();
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
