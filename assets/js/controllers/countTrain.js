app.controller('countCtrl',function($scope,gameSrvc){
  gameSrvc.clearAllPlayers();
  gameSrvc.setForceResult(false);

  gameSrvc.addPlayer('David', 10000);
  gameSrvc.addPlayer('Comp1', 10000);
  gameSrvc.addPlayer('Comp2', 10000);
  gameSrvc.addPlayer('Comp3', 10000);


})
