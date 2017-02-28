var myApp = angular.module('myApp', ['ngRoute', 'firebase']);

var AcademySelected = 'Select Academy';
var FacultySelected = 'Select Faculty';
var CourseSelected = 'Select Course';
var SemesterSelected = 'Select Semester';
var LecturerSelected = 'Select Lecturer';

var jQuerySelectedIdList = ['#dropdownAcademy', '#dropdownFaculty', '#dropdownCourse', '#dropdownSem', '#dropdownLec' ];
var selectedToAddList = ['Select Academy', 'Select Faculty', 'Select Course', 'Select Semester','Select Lecturer'];
var snapshotAllSemesterSave;
var listOfAllLecturer = [];
var database;

 function initVarSelected(i){
 	//alert(i);
 	switch (i)
 	{
 		case 1: FacultySelected = 'Select Faculty'; break;
 		case 2: CourseSelected = 'Select Course'; break;
 		case 3: SemesterSelected = 'Select Semester'; break;
 		case 4: LecturerSelected = 'Select Lecturer'; break;
 	}
 }

 function initAllDropDown(index)
 {
	for(var i = index; i < 5; i++){
		$(jQuerySelectedIdList[i])
	    .find('option')
	    .remove()
	    .end()
	    .append('<option>'+ selectedToAddList[i] +'</option>');
	    initVarSelected(i);
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
	//alert("in loadDataFromDB");
	 database = firebase.database().ref().child('Academy');
	//var e  = document.getElementById("dropdownAcademy");
	database.once("value", function(snapshot){
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
			database.child(AcademySelected + '/Faculty').once("value",onClickAcademy);
		}
		//alert(selected);
	});

	$("#dropdownFaculty").on('changed.bs.select', function(e, clickedIndex, newValue, oldValue){
		FacultySelected = $(e.currentTarget).val();

		if (FacultySelected != 'Select Faculty' && AcademySelected != 'Select Academy')
		{
			database.child(AcademySelected + '/Faculty/' + FacultySelected + '/Course').once("value",onClickFaculty);

		}
		//alert(selected);
	});

	$("#dropdownCourse").on('changed.bs.select', function(e, clickedIndex, newValue, oldValue){
		CourseSelected = $(e.currentTarget).val();

		if (CourseSelected != 'Select Course' && FacultySelected != 'Select Faculty' && AcademySelected != 'Select Academy')
		{
			database.child(AcademySelected + '/Faculty/' + FacultySelected + '/Course/' + CourseSelected
				).once("value",onClickCourse);

		}
		//alert(selected);
	});

	$("#dropdownSem").on('changed.bs.select', function(e, clickedIndex, newValue, oldValue){
		SemesterSelected = $(e.currentTarget).val();

		if (CourseSelected != 'Select Course' && FacultySelected != 'Select Faculty' && AcademySelected != 'Select Academy'
			&& SemesterSelected != 'Select Semester')
		{
			database.child(AcademySelected + '/Faculty/' + FacultySelected + '/Course/' + CourseSelected +
				'/' + SemesterSelected + '/Lecturer').once("value",onClickSemester);
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

function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

var initPageAcademyRank = false;
var initPageLecturerRank = false;
var initPageLecturerView = false;
var initPageAcademyView = false;

function initAllPages(){
	 initPageAcademyRank = false;
	 initPageLecturerRank = false;
	 initPageLecturerView = false;
	 initPageAcademyView = false;
}

myApp.controller('mainControler', function($scope,$location,$http){

	//alert("hiiii");
	$scope.moveToPath = function(view){
		//alert(view);

		$location.path(view);
	};

	$scope.navAcademyCont = function(view){
		//alert(view);

		$location.path(view);
	};


	$scope.initDetailsAcademy = function () {
		document.getElementById("detailsAcademyId1").innerHTML = ' ' + AcademySelected;
		document.getElementById("detailsFacultyId1").innerHTML = ' ' + FacultySelected;
		$('input:radio[id=ch1]').prop('checked', true);
		$('#commentFewWord').val("");
		$('input:checkbox[id=AnnonymosCheck]').prop('checked', true);
		var EN =  document.getElementById('Ename');
		EN.style.display='none';
		$('#textName').val("");
		initPageAcademyRank = true;
	}

	$scope.initDetailsLecturer = function () {
		document.getElementById("detailsAcademyId2").innerHTML = ' ' + AcademySelected;
		document.getElementById("detailsFacultyId2").innerHTML = ' ' + FacultySelected;
		document.getElementById("detailsSemesterId2").innerHTML = ' ' + SemesterSelected;
		document.getElementById("detailsLecturerId2").innerHTML = ' ' + LecturerSelected;
		document.getElementById("detailsCourseId2").innerHTML = ' ' + CourseSelected;
		$('input:radio[id=ch1]').prop('checked', true);
		$('#commentFewWord').val("");
		$('input:checkbox[id=AnnonymosCheck]').prop('checked', true);
		var EN =  document.getElementById('Ename');
		EN.style.display='none';
		$('#textName').val("");
		initPageLecturerRank = true;
	}

	var waitFinish = 0;
	$scope.initDetailsAvgTableAcademy = function () {

		var table = document.getElementById("tableA");
		var rowCount = table.rows.length; while(--rowCount) table.deleteRow(rowCount); 
		waitFinish = 0;
		rankListAcademt = [];
		var avgAcademyDiff = 0, avgFacultySec = 0, avgSocial = 0, avgUnion = 0, avgStudentChar = 0;
		var indexC = 0;
		database.child(AcademySelected + '/Faculty/' + FacultySelected + '/Rating_faculty').once("value", function(snapshot){
			var numOfChild = snapshot.numChildren();
			//alert(numOfChild);
			
			//var row = table.insertRow(numOfChild);
			snapshot.forEach(function(childSnapshot) {

				rankListAcademt.push(childSnapshot);
				//alert("innn");
				avgAcademyDiff += childSnapshot.val().academy_difficulty;
				avgFacultySec += childSnapshot.val().faculty_secretary;
				avgSocial += childSnapshot.val().social_life;
				avgUnion += childSnapshot.val().student_union;
				avgStudentChar += childSnapshot.val().students_char;
				indexC++;
				//var row = table.insertRow(indexC);
				var row = table.insertRow(indexC);
				row.insertCell(0).innerHTML = indexC;
				if (childSnapshot.val().annonymos == true || childSnapshot.val().rank_name == "") {
					row.insertCell(1).innerHTML = "    -";
				} else {

					row.insertCell(1).innerHTML = childSnapshot.val().rank_name;
				}
				
				row.insertCell(2).innerHTML = childSnapshot.val().date;
				row.insertCell(3).innerHTML = childSnapshot.val().academy_difficulty;
				row.insertCell(4).innerHTML = childSnapshot.val().students_char;
				row.insertCell(5).innerHTML = childSnapshot.val().social_life;
				row.insertCell(6).innerHTML = childSnapshot.val().faculty_secretary;
				row.insertCell(7).innerHTML = childSnapshot.val().student_union;
				row.insertCell(8).innerHTML = childSnapshot.val().few_words;
				/*
				childSnapshot.forEach(function(childSnapshotSem) {
					switch (indexCh){
						case 0: avgAcademyDiff += childSnapshotSem.val
					}

				});	
				*/

			});
			waitFinish = 1;
		});


		sleep(3000).then(() => {

	    	if (waitFinish) {
	    		document.getElementById("detailsAcademyId3").innerHTML = ' ' + AcademySelected;
				document.getElementById("detailsFacultyId3").innerHTML = ' ' + FacultySelected;
				document.getElementById("detailsdiffId3").innerHTML = ' ' + (avgAcademyDiff / indexC).toFixed(2) ;
				document.getElementById("detailscharacterId3").innerHTML = ' ' + (avgStudentChar / indexC).toFixed(2)   ;
				document.getElementById("detailsSocialId3").innerHTML = ' ' + (avgSocial / indexC).toFixed(2) ;
				document.getElementById("detailssecretaryId3").innerHTML = ' ' + (avgFacultySec / indexC).toFixed(2) ;
				document.getElementById("detailsunionId3").innerHTML = ' ' + (avgUnion / indexC).toFixed(2) ;
			}
			

		});
		$("#progressTimer").show();
		$("#progressTimer").progressTimer({
		    timeLimit: 3.5,
		    warningThreshold: 10,
		    baseStyle: 'progress-bar-warning',
		    warningStyle: 'progress-bar-danger',
		    completeStyle: 'progress-bar-info',
		    onFinish: function() {
		        console.log("I'm done");
		        $("#progressTimer").hide();
		    }
		});
		
/*
		var i = 100;
		var counterBack = setInterval(function(){
		  i--;
		  if (i > 0){
		    $('.progress-bar').css('width', i+'%');
		  } else {
		    clearInterval(counterBack);
		  }
		  
		}, 20);
		*/

		initPageAcademyView = true;
	}

	$scope.moveToRankAcademy = function(view){
		//alert(view);
		if (FacultySelected != 'Select Faculty' && AcademySelected != 'Select Academy')
		{
			$location.path(view);	
			if (initPageAcademyRank){
				//alert("hii");
				$scope.initDetailsAcademy();
			}
		}
		else {
			alert("You must select Academy and Faculty");
		}
		
	};

	$scope.moveToViewAcademy = function(view){
		if (FacultySelected != 'Select Faculty' && AcademySelected != 'Select Academy')
		{
			$location.path(view);
			if (initPageAcademyView){
				$scope.initDetailsAvgTableAcademy()
			}
		}
		else {
			alert("You must select Academy and Faculty");
		}
	};

	$scope.moveToRankLecturer = function(view){
		//alert(view);
		if (SemesterSelected == "All"){
			alert("Could not choose 'All' while ranking (only view)");
		}
		else if (CourseSelected != 'Select Course' && FacultySelected != 'Select Faculty' && AcademySelected != 'Select Academy'
			&& SemesterSelected != 'Select Semester' && LecturerSelected != 'Select Lecturer')
		{
			$location.path(view);
			if (initPageAcademyView){
				$scope.initDetailsLecturer();
			}
		}
		else {
			alert("You must select Academy, Faculty, Course, Semester and Lecturer");
		}
		
	};

	$scope.moveToViewLecturer = function(view){
		//alert(view);

		if (CourseSelected != 'Select Course' && FacultySelected != 'Select Faculty' && AcademySelected != 'Select Academy'
			&& SemesterSelected != 'Select Semester' && LecturerSelected != 'Select Lecturer')
		{
			$location.path(view);
		}
		else {
			alert("You must select Academy, Faculty, Course, Semester and Lecturer");
		}
	};


});

myApp.controller('RankLecturerCont', function($scope,$location){

	$scope.RankClickAcademy = function(view){

		var academy_difficulty1 = parseInt($('input[name="gender1"]:checked').val());
		var students_char1 =  parseInt($('input[name="gender2"]:checked').val());
		var faculty_secretary1 =  parseInt($('input[name="gender3"]:checked').val());
		var student_union1 =  parseInt($('input[name="gender4"]:checked').val());
		var social_life1 =  parseInt($('input[name="gender5"]:checked').val());

		var FawWords = $('#commentFewWord').val();
		//alert(typeof academy_difficulty1);
		var userName = '';
		var annonymos1 = true;
		if ($('#AnnonymosCheck').is(":checked")){
			userName = 'Annonymos_' + Math.floor((Math.random() * 100000) + 1);
		} else { //TODO - check if the user is already exist in DB 
			userName = $('#textName').val();
			annonymos1 = false;
		}
		var today = new Date();
		var dd = today.getDate();
		var mm = today.getMonth()+1; //January is 0!
		var yyyy = today.getFullYear();

		if(dd<10) {
		    dd='0'+dd
		} 

		if(mm<10) {
		    mm='0'+mm
		} 

		today = dd+'-'+mm+'-'+yyyy;
		//alert(today);

		var facultyRank = {
			academy_difficulty: academy_difficulty1,
			students_char : students_char1,
			faculty_secretary : faculty_secretary1,
			student_union : student_union1,
			social_life : social_life1,
			date : today,
			rank_name : userName,
			annonymos : annonymos1,
			few_words : FawWords
		};

		var newDBref = database.child(AcademySelected + '/Faculty/' + FacultySelected + '/Rating_faculty').push();
		newDBref.set(facultyRank);
		alert("Your ranking has beed sent");
		initPageAcademyRank = false;
		initPageLecturerRank = false;
		//initAllDropDown(1);
		$location.path('/');

	};

	$scope.RankClickLecturer = function(view){

		var course_level1 = parseInt($('input[name="gender1"]:checked').val());
		var attitude_lecturer_student1 =  parseInt($('input[name="gender2"]:checked').val());
		var ability_to_teach1 =  parseInt($('input[name="gender3"]:checked').val());
		var teacher_interesting1 =  parseInt($('input[name="gender4"]:checked').val());

		var FawWords = $('#commentFewWord').val();
		//alert(typeof academy_difficulty1);
		var userName = '';
		var annonymos1 = true;
		if ($('#AnnonymosCheck').is(":checked")){
			userName = 'Annonymos_' + Math.floor((Math.random() * 100000) + 1);
		} else { //TODO - check if the user is already exist in DB 
			userName = $('#textName').val();
			annonymos1 = false;
		}
		var today = new Date();
		var dd = today.getDate();
		var mm = today.getMonth()+1; //January is 0!
		var yyyy = today.getFullYear();

		if(dd<10) {
		    dd='0'+dd
		} 

		if(mm<10) {
		    mm='0'+mm
		} 

		today = dd+'-'+mm+'-'+yyyy;
		//alert(today);

		var LecturerRank = {
			course_level: course_level1,
			attitude_lecturer_student : attitude_lecturer_student1,
			ability_to_teach : ability_to_teach1,
			teacher_interesting : teacher_interesting1,
			date : today,
			annonymos : annonymos1,
			few_words : FawWords
		};

		var newDBref = database.child(AcademySelected + '/Faculty/' + FacultySelected + '/Course/' + 
			CourseSelected + '/' + SemesterSelected + '/Lecturer/' + LecturerSelected + 
			'/Rating').push();
		newDBref.set(LecturerRank);
		alert("Your ranking has beed sent");
		initPageAcademyRank = false;
		initPageLecturerRank = false;
		//initAllDropDown(1);
		$location.path('/');

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
	.when('/AddLecCourse',
		{
		controller: 'mainControler',
		templateUrl: 'partials/AddCourseLecturer.html'
		})
	.when('/About',
		{
		controller: 'mainControler',
		templateUrl: 'partials/AboutUs.html'
		})
		.otherwise({ redirectTo: '/'});

});


