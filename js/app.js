var myApp = angular.module('myApp', ['ngRoute']);



myApp.controller('mainControler', function($scope){


	
	//console.log($scope);
});
myApp.controller('AcademyControler', function($scope){


	
	//console.log($scope);
});
myApp.config(function ($routeProvider){

	$routeProvider
	.when('/',
	{
		controller: 'mainControler',
		templateUrl: 'partials/mainView.html'
	})
	.when('RankAcademy',
		{
		controller: 'AcademyControler',
		templateUrl: 'partials/RankAcademy.html'
		})
		.otherwise({ redirectTo: '/'})

});


