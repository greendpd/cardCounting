let app=angular.module('theApp',['ui.router']).config(function($urlRouterProvider,$stateProvider){
  $urlRouterProvider.otherwise('/');
  $stateProvider
    .state('home',{
      url:'/',
      templateUrl:'./views/home.html',
      controller:'homeCtrl'
    })



})
