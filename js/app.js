var myApp = angular.module('myApp', []);


myApp.config(function ($routeProvider){

	$routeProvider
	.when('/',
	{
		controller: 'mainControler',
		templateUrl: 'mainView.html'
	})
		.when('/RankAcademy',
	{
		controller: 'mainControler',
		templateUrl: 'partials/RankView.html'
	})
		.otherwise({ redirectTo: ''})

});


myApp.controller('mainControler', function($scope){
	$scope.name = 'dude';
	$scope.getName = function(){
		return 'dude';
	}

	
	//console.log($scope);
});