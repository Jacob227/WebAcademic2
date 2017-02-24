var myApp = angular.module('myApp', [ 'ngRoute' ]);

myApp.controller('mainControler', function($scope){
	$scope.name = 'dude';
	$scope.getName = function(){
		return 'dude';
	}

	
	//console.log($scope);
});