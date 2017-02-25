var myApp = angular.module('myApp', ['ngRoute', 'firebase']);

var AcademySelected = '';
var FacultySelected = '';
var CourseSelected = '';
var SemesterSelected = '';
var LecturerSelected = '';

var jQuerySelectedIdList = ['#dropdownAcademy', '#dropdownFaculty', '#dropdownCourse', '#dropdownSem', '#dropdownLec' ];
var selectedToAddList = ['Select Academy', 'Select Faculty', 'Select Course', 'Select Semester','Select Lecturer'];
var snapshotAllSemesterSave;
var listOfAllLecturer = [];

 function initAllDropDown(index)
 {
	for(var i = index; i < 5; i++){
		$(jQuerySelectedIdList[i])
	    .find('option')
	    .remove()
	    .end()
	    .append('<option>'+ selectedToAddList[i] +'</option>');
	}
 }

 function onClickAcademy(snapshot)
 {
 		initAllDropDown(1);
		snapshot.forEach(function(childSnapshot) {
			//alert(childSnapshot.key);
			$('#dropdownFaculty').append('<option>'+ childSnapshot.key +'</option>');
			$(".selectpicker").selectpicker('refresh');
			//alert(childSnapshot.key);
		});
		
}

 function onClickFaculty(snapshot)
 {
 		initAllDropDown(2);
		snapshot.forEach(function(childSnapshot) {
			//alert(childSnapshot.key);
			$('#dropdownCourse').append('<option>'+ childSnapshot.key +'</option>');
			$(".selectpicker").selectpicker('refresh');
			//alert(childSnapshot.key);
		});
		
}

 function onClickCourse(snapshot)
 {
 		initAllDropDown(3);
 		snapshotAllSemesterSave = snapshot;
 		$('#dropdownSem').append('<option>All</option>');
		snapshot.forEach(function(childSnapshot) {
			//alert(childSnapshot.key);
			$('#dropdownSem').append('<option>'+ childSnapshot.key +'</option>');
			$(".selectpicker").selectpicker('refresh');
			//alert(childSnapshot.key);
		});
		
}

 function onClickSemester(snapshot)
 {
 		initAllDropDown(4);
		if (SemesterSelected == 'All') {
			listOfAllLecturer = [];
			snapshotAllSemesterSave.forEach(function(childSnapshot) {
				initAllDropDown(4);
				childSnapshot.child("Lecturer").forEach(function(childSnapshotSem) {
					var lec = childSnapshotSem.key;
					//alert(lec);
					if ($.inArray(lec,listOfAllLecturer) == -1){
						listOfAllLecturer.push(lec);
						$('#dropdownLec').append('<option>'+ lec +'</option>');
						$(".selectpicker").selectpicker('refresh');
					}

				});	
			});	
		}
		else {
			snapshot.forEach(function(childSnapshot) {
				//alert(childSnapshot.key);
				$('#dropdownLec').append('<option>'+ childSnapshot.key +'</option>');
				$(".selectpicker").selectpicker('refresh');
			});
		}
		
}

var loadDataFromDB = function() {

	var database = firebase.database().ref().child('Academy');
	//var e  = document.getElementById("dropdownAcademy");
	database.on("value", function(snapshot){
		snapshot.forEach(function(childSnapshot) {
			$('#dropdownAcademy').append('<option>'+ childSnapshot.key +'</option>');
			$(".selectpicker").selectpicker('refresh');
			//alert(childSnapshot.key);
		});
		
	});

	$("#dropdownAcademy").on('changed.bs.select', function(e, clickedIndex, newValue, oldValue){
		AcademySelected = $(e.currentTarget).val();
		if (AcademySelected != 'Select Academy')
		{
			database.child(AcademySelected + '/Faculty').on("value",onClickAcademy);
		}
		//alert(selected);
	});

	$("#dropdownFaculty").on('changed.bs.select', function(e, clickedIndex, newValue, oldValue){
		FacultySelected = $(e.currentTarget).val();

		if (FacultySelected != 'Select Faculty' && AcademySelected != 'Select Academy')
		{
			database.child(AcademySelected + '/Faculty/' + FacultySelected + '/Course').on("value",onClickFaculty);

		}
		//alert(selected);
	});

	$("#dropdownCourse").on('changed.bs.select', function(e, clickedIndex, newValue, oldValue){
		CourseSelected = $(e.currentTarget).val();

		if (CourseSelected != 'Select Course' && FacultySelected != 'Select Faculty' && AcademySelected != 'Select Academy')
		{
			database.child(AcademySelected + '/Faculty/' + FacultySelected + '/Course/' + CourseSelected
				).on("value",onClickCourse);

		}
		//alert(selected);
	});

	$("#dropdownSem").on('changed.bs.select', function(e, clickedIndex, newValue, oldValue){
		SemesterSelected = $(e.currentTarget).val();

		if (CourseSelected != 'Select Course' && FacultySelected != 'Select Faculty' && AcademySelected != 'Select Academy'
			&& SemesterSelected != 'Select Semester')
		{
			database.child(AcademySelected + '/Faculty/' + FacultySelected + '/Course/' + CourseSelected +
				'/' + SemesterSelected + '/Lecturer').on("value",onClickSemester);
		}
		//alert(selected);
	});

	$("#dropdownLec").on('changed.bs.select', function(e, clickedIndex, newValue, oldValue){
		LecturerSelected = $(e.currentTarget).val();
		//alert(selected);
	});


	//const btnRankAcademy = document.getElementById('RankAcademyBut');

	//btnRankAcademy.addEventListener('click', e => {
	//	alert("In loadDataFromDB");
	//});

}

loadDataFromDB();


myApp.controller('mainControler', function($scope,$location){

	$scope.navAcademyCont = function(view){
		//alert(view);
		$location.path(view);
	};

	$scope.moveToRankAcademy = function(view){
		//alert(view);
		$location.path(view);
	};

	$scope.moveToViewAcademy = function(view){
		$location.path(view);
	};

	$scope.moveToRankLecturer = function(view){
		//alert(view);
		$location.path(view);
	};

	$scope.moveToViewLecturer = function(view){
		//alert(view);
		$location.path(view);
	};

});

myApp.controller('RankLecturerCont', function($scope,$location){

	$scope.RankClickLecturer = function(view){
		//alert(view);
		//$location.path(view);
	};


});

myApp.controller('AcademyControler', function($scope){


	
	//console.log($scope);
});
myApp.config(function ($routeProvider, $locationProvider){
	$routeProvider
	.when('/',
	{
		controller: 'mainControler',
		templateUrl: 'partials/mainView.html'
	})
	.when('/RankAcademy',
		{
		controller: 'mainControler',
		templateUrl: 'partials/RankAcademy.html'
		})
	.when('/RankLecturer',
		{
		controller: 'mainControler',
		templateUrl: 'partials/RankingLecturer.html'
		})
	.when('/ViewLecturerRaiting',
		{
		controller: 'mainControler',
		templateUrl: 'partials/ViewLecturerRaiting.html'
		})
	.when('/ViewAcademyRaiting',
		{
		controller: 'mainControler',
		templateUrl: 'partials/ViewAcademyRaiting.html'
		})
		.otherwise({ redirectTo: '/'});

});


