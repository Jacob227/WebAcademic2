var myApp = angular.module('myApp', ['ngRoute']);



myApp.controller('mainControler', function($scope){


	
	//console.log($scope);
});
myApp.config(function ($routeProvider){

	$routeProvider
	.when('/',
	{
		controller: 'mainControler',
		templateUrl: 'partials/mainView.html'
	})
		.otherwise({ redirectTo: '/'})

});


