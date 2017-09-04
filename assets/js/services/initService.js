app.service('initSrvc',function(gameSrvc){
  this.showFreestyleOptions=function(theScope){
    theScope.showCountOption=false;
    theScope.showChartOption=false;
    theScope.showPracticeOptions=false;

    theScope.canBet = true;
    theScope.showBet = true;
    theScope.canDeal = true;
    theScope.title="Freestyle Blackjack"
    theScope.showCash=true;

  }
  this.showCountTrainOptions=function(theScope){
    theScope.showCountOption=true;
    theScope.showChartOption=true;
    theScope.showPracticeOptions=false;

    theScope.canBet = true;
    theScope.showBet = true;
    theScope.canDeal = true;
    theScope.title="Count Training"
    theScope.showCash=true;

  }
  this.showChartTrainOptions=function(theScope){
    gameSrvc.clearAllPlayers();
    gameSrvc.addPlayer("User",10000);
    gameSrvc.setForceResult(true);

    theScope.players=gameSrvc.getPlayers();
    theScope.human=theScope.players[0];
    theScope.showCountOption=false;
    theScope.showChartOption=true;
    theScope.showPracticeOptions=true;
    theScope.canBet=false;
    theScope.showBet=false;
    theScope.canDeal=true;
    theScope.title="Chart Training"
    theScope.showCash=false;


  }


})
