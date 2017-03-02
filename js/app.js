var myApp = angular.module('myApp', ['ngRoute', 'firebase']);

//var AcademySelected = 'Select Academy';
//var FacultySelected = 'Select Faculty';
//var CourseSelected = 'Select Course';
//var SemesterSelected = 'Select Semester';
//var LecturerSelected = 'Select Lecturer';
//var initVarsDet = 0;

var jQuerySelectedIdList = ['#dropdownAcademy', '#dropdownFaculty', '#dropdownCourse', '#dropdownSem', '#dropdownLec' ];
var selectedToAddList = ['Select Academy', 'Select Faculty', 'Select Course', 'Select Semester','Select Lecturer'];
var snapshotAllSemesterSave;
var listOfAllLecturer = [];
var database;
var initPageAcademyRank = "false";
var initPageLecturerRank = "false";
var initPageLecturerView = "false";
var initPageAcademyView = "false";
 

 function initPages(){
 	sessionStorage.setItem("initPageAcademyRank","false");
	sessionStorage.setItem("initPageLecturerRank","false");
	sessionStorage.setItem("initPageLecturerView","false");
	sessionStorage.setItem("initPageAcademyView","false");

	sessionStorage.setItem("initPageSyllabus","false");
 }

 function initVars() {
 	
 		//sessionStorage.setItem("initVarsDet","1");
 		sessionStorage.setItem("AcademySelected",'Select Academy');
 		sessionStorage.setItem("FacultySelected",'Select Faculty');
 		sessionStorage.setItem("CourseSelected",'Select Course');
 		sessionStorage.setItem("SemesterSelected",'Select Semester');
 		sessionStorage.setItem("LecturerSelected",'Select Lecturer');
 		sessionStorage.setItem("MyScreen",'firstScreen');
 		initPages();
 }

 function initVarSelected(i){
 	switch (i)
 	{
 		case 1: sessionStorage.setItem("FacultySelected", 'Select Faculty'); break;
 		case 2: sessionStorage.setItem("CourseSelected", 'Select Course'); break;
 		case 3: sessionStorage.setItem("SemesterSelected", 'Select Semester'); break;
 		case 4: sessionStorage.setItem("LecturerSelected", 'Select Lecturer'); break;
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
			$('#dropdownFaculty').append('<option value="' + childSnapshot.key + '">' + childSnapshot.key +'</option>');
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
 		//$('#dropdownSem').append('<option>All</option>');
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
 		
		if (sessionStorage.getItem("SemesterSelected") == 'All') {
			listOfAllLecturer = [];
			snapshotAllSemesterSave.forEach(function(childSnapshot) {
				//initAllDropDown(4);
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
		//sessionStorage.setItem("refreshScreen", "0");
		
}


var loadDataFromDB = function() {
	//alert("in loadDataFromDB");
	if (performance.navigation.type == 1) {
	  console.info( "This page is reloaded" );
	  //database = firebase.database().ref().child('Academy');
	}
	else {
		initVars();
	}

	//TODO - add first time
	//sessionStorage.setItem("refreshScreen", "1"); 
	 database = firebase.database().ref().child('Academy');
	// alert(sessionStorage.getItem("AcademySelected"));
	//alert(sessionStorage.getItem("FacultySelected"));
	//var e  = document.getElementById("dropdownAcademy");
	database.once("value", function(snapshot){
		snapshot.forEach(function(childSnapshot) {
			$('#dropdownAcademy').append('<option>'+ childSnapshot.key +'</option>');
			$(".selectpicker").selectpicker('refresh');
			//alert(childSnapshot.key);
		});
		
	});

	$("#dropdownAcademy").on('changed.bs.select', function(e, clickedIndex, newValue, oldValue){
		sessionStorage.setItem("AcademySelected", $(e.currentTarget).val());
		if (sessionStorage.getItem("AcademySelected") != 'Select Academy')
		{
			database.child(sessionStorage.getItem("AcademySelected") + '/Faculty').once("value",onClickAcademy);
		}
		//alert(selected);
	});

	$("#dropdownFaculty").on('changed.bs.select', function(e, clickedIndex, newValue, oldValue){
		sessionStorage.setItem("FacultySelected", $(e.currentTarget).val());

		if (sessionStorage.getItem("FacultySelected") != 'Select Faculty' && sessionStorage.getItem("AcademySelected") != 'Select Academy')
		{
			database.child(sessionStorage.getItem("AcademySelected") + '/Faculty/' + 
				sessionStorage.getItem("FacultySelected") + '/Course').once("value",onClickFaculty);

		}
		//alert(selected);
	});

	$("#dropdownCourse").on('changed.bs.select', function(e, clickedIndex, newValue, oldValue){
		sessionStorage.setItem("CourseSelected", $(e.currentTarget).val());

		if (sessionStorage.getItem("CourseSelected") != 'Select Course' && sessionStorage.getItem("FacultySelected") != 'Select Faculty' 
			&& sessionStorage.getItem("AcademySelected") != 'Select Academy')
		{
			database.child(sessionStorage.getItem("AcademySelected") + '/Faculty/' + sessionStorage.getItem("FacultySelected") 
				+ '/Course/' +sessionStorage.getItem("CourseSelected") ).once("value",onClickCourse);

		}
		//alert(selected);
	});

	$("#dropdownSem").on('changed.bs.select', function(e, clickedIndex, newValue, oldValue){
		sessionStorage.setItem("SemesterSelected", $(e.currentTarget).val());

		//alert(sessionStorage.getItem("SemesterSelected"));
		if (sessionStorage.getItem("CourseSelected") != 'Select Course' && sessionStorage.getItem("FacultySelected") != 'Select Faculty' 
			&& sessionStorage.getItem("AcademySelected") != 'Select Academy'
			&& sessionStorage.getItem("SemesterSelected") != 'Select Semester')
		{
			database.child(sessionStorage.getItem("AcademySelected") + '/Faculty/' + sessionStorage.getItem("FacultySelected")
			 + '/Course/' + sessionStorage.getItem("CourseSelected") +
				'/' + sessionStorage.getItem("SemesterSelected") + '/Lecturer').once("value",onClickSemester);
		}
		//alert(selected);
	});

	$("#dropdownLec").on('changed.bs.select', function(e, clickedIndex, newValue, oldValue){
		sessionStorage.setItem("LecturerSelected", $(e.currentTarget).val());
	});

	if (performance.navigation.type == 1) {
		console.info( "This page is reloaded 222" );
		//$('#dropdownAcademy').selectpicker('val', sessionStorage.getItem("AcademySelected"));
		//$(".selectpicker").selectpicker('refresh');
	}
}

loadDataFromDB();


function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}


var AcademySel = "Select Academy", FacultySel = "Select Faculty", CourseSel = "Select Course";
myApp.controller('mainControler', function($scope,$location,$http,$route){

	$scope.moveToContact = function(view){
		$location.path(view);	
	};

	$scope.moveToPath = function(view){
		$route.reload();
		initPages();
		$location.path(view);	
	};

	$scope.navAcademyCont = function(view){
		$location.path(view);
		initPages();
	};

	$scope.sendEmailToUS = function(){
		var firstName1 = document.getElementById("EfirstName").value;
		var lastName1 = document.getElementById("ElastName").value;
		var Email1 = document.getElementById("Eemail").value;
		var Subject1 = document.getElementById("Esubject").value;
		var Message1 = document.getElementById("EMessage").value;
		console.log("inn sendEmailToUS");
		alert(firstName1 + ' ' + lastName1 + ' ' + Email1 + ' ' + Subject1 + ' ' + Message1);

		if (firstName1!= '' && lastName1 != '' && Email1 != ''
			&& Subject1 != '' && Message1 != '') {
			//window.open('mailto:test@example.com');
			var emailToSent = {
				firstName : firstName1,
				lastName : lastName1,
				Email : Email1,
				Subject : Subject1,
				Message: Message1
			};
			var database2 = firebase.database().ref().child('Email').push();
			database2.set(emailToSent);
			alert("Thank you for contact us");
			//var firebaseMail = firebase.database().ref();
			//firebaseMail.child('Email').push();
			//firebaseMail.set(emailToSent);

		}
		else {
			alert("You must fill all the fields");
		}

	}

	$scope.initDetailsCourse = function(){
		document.getElementById("titleCourse").innerHTML = sessionStorage.getItem("CourseSelected");
		document.getElementById("LecName").innerHTML = sessionStorage.getItem("LecturerSelected");
		document.getElementById("AcademyId").innerHTML = sessionStorage.getItem("AcademySelected");
		database.child(sessionStorage.getItem("AcademySelected") + '/Faculty/' + sessionStorage.getItem("FacultySelected")
			 + '/Course/' + sessionStorage.getItem("CourseSelected") +
				'/' + sessionStorage.getItem("SemesterSelected") + '/Course Details').once("value", function(snapshot){

					document.getElementById("codeCourse").innerHTML = "Code course:&nbsp" + snapshot.val().code_course;
					document.getElementById("Credits").innerHTML = "Credits:&nbsp" + snapshot.val().credits;
					document.getElementById("Time").innerHTML = "Time:&nbsp" + snapshot.val().time;
					document.getElementById("Room").innerHTML = "Room:&nbsp" + snapshot.val().room;
					document.getElementById("Syllabus").innerHTML = "Syllabus:&nbsp" + snapshot.val().syllabus;
					sessionStorage.setItem("initPageSyllabus","true");
					sessionStorage.setItem("MyScreen",'navCourseDet');
					//var table = document.getElementById("tableId");
					//var rowCount = table.rows.length; while(--rowCount) table.deleteRow(rowCount); 
					//	childSnapshot.val().academy_difficulty;
					//alert(childSnapshot.key);

				});
	}

	$scope.navCourseDet = function(view){
		if (sessionStorage.getItem("CourseSelected") != 'Select Course' 
			&& sessionStorage.getItem("FacultySelected") != 'Select Faculty'
		 	&& sessionStorage.getItem("AcademySelected") != 'Select Academy'
			&& sessionStorage.getItem("SemesterSelected") != 'Select Semester' 
			 &&	sessionStorage.getItem("LecturerSelected") != 'Select Lecturer')
		{
			if (sessionStorage.getItem("MyScreen") == 'navCourseDet')
			{
				if(sessionStorage.getItem("initPageSyllabus") == "true")
					$scope.initDetailsCourse();
			}
			else {
				initPages();
			}
			$location.path(view);
		}
		else {
			alert("You must select Academy, Faculty, Course, Semester and Lecturer");
		}
	};

	$scope.initDetailsAddLec = function () {
		
		database = firebase.database().ref().child('Academy');
		database.once("value", function(snapshot){
			snapshot.forEach(function(childSnapshot) {
				$('#dropdownAcademy1').append('<option>'+ childSnapshot.key +'</option>');
				$(".selectpicker").selectpicker('refresh');
				//alert(childSnapshot.key);
			});
			
		});

		$("#dropdownAcademy1").on('changed.bs.select', function(e, clickedIndex, newValue, oldValue){
			AcademySel = $(e.currentTarget).val();
			if (AcademySel != 'Select Academy')
			{
				database.child(AcademySel + '/Faculty').once("value", function(snapshot){
					snapshot.forEach(function(childSnapshot) {

					$('#dropdownFaculty1')
				    .find('option')
				    .remove()
				    .end()
				    .append('<option>'+ 'Select Faculty' +'</option>');

				    $('#dropdownCourse1')
				    .find('option')
				    .remove()
				    .end()
				    .append('<option>'+ 'Select Course' +'</option>');

					$('#dropdownFaculty1').append('<option>'+ childSnapshot.key +'</option>');
					$(".selectpicker").selectpicker('refresh');
					//alert(childSnapshot.key);
					});
				});
				//database.child(sessionStorage.getItem("AcademySelected") + '/Faculty').once("value",onClickAcademy);
			}
			//alert(selected);
		});

		$("#dropdownFaculty1").on('changed.bs.select', function(e, clickedIndex, newValue, oldValue){
			FacultySel = $(e.currentTarget).val();

			if (FacultySel != 'Select Faculty' && AcademySel != 'Select Academy')
			{
				database.child(AcademySel + '/Faculty/' + 
					FacultySel + '/Course').once("value", function(snapshot){
					snapshot.forEach(function(childSnapshot) {

				    $('#dropdownCourse1')
				    .find('option')
				    .remove()
				    .end()
				    .append('<option>'+ 'Select Course' +'</option>');

					$('#dropdownCourse1').append('<option>'+ childSnapshot.key +'</option>');
					$(".selectpicker").selectpicker('refresh');
					//alert(childSnapshot.key);
					});
				});
				//database.child(sessionStorage.getItem("AcademySelected") + '/Faculty/' + 
				//	sessionStorage.getItem("FacultySelected") + '/Course').once("value",onClickFaculty);

			}
			//alert(selected);
		});

		$("#dropdownCourse1").on('changed.bs.select', function(e, clickedIndex, newValue, oldValue){
			CourseSel = $(e.currentTarget).val();
			//alert(selected);
		});


			//alert(document.getElementById("Fname4").innerHTML);
	}

	$scope.SendAddLec = function () {	
		var fullName1 = document.getElementById("inputFname").value;
		var Phone1 = document.getElementById("phone1").value;
		var email1 = document.getElementById("inputEmail").value;
		var LecName1 = document.getElementById("FullnameL").value;
		var NonExisting = document.getElementById("CheckCourse");

		if(AcademySel == 'Select Academy') {
			alert("You must select Academy");
			return;
		}

		if(FacultySel == 'Select Faculty') {
			alert("You must select Faculty");
			return;
		}

		if (fullName1 == "") {
			alert("You must insert Full name");
			return;
		} else if (Phone1 == ""){
			alert("You must insert Phone number");
			return;
		} else if (email1 == "") {
			alert("You must insert email");
			return;
		} else if (LecName1 == "") {
			alert("You must insert Lecturer name");
			return;
		} 

		if (NonExisting.checked){
			var CourseName1 = document.getElementById("FullCourse").value;
			var CodeCourse1 = document.getElementById("FullCourse1").value;
			var Credits1 = document.getElementById("FullCourse2").value;
			var Room1 = document.getElementById("FullCourse3").value;
			var Time1 = document.getElementById("FullCourse4").value;
			var Syllabus1 = document.getElementById("FullCourse5").value;

			if (CourseName1 == "") {
				alert("You must insert Course name");
				return;
			} else if (CodeCourse1 == ""){
				alert("You must insert code course");
				return;
			} else if (Credits1 == "") {
				alert("You must insert credits");
				return;
			} else if (Room1 == "") {
				alert("You must insert Room");
				return;
			} else if (Time1 == "") {
				alert("You must insert Time");
				return;
			} else if (Syllabus1 == "") {
				alert("You must insert syllabus");
				return;
			}
			var lecDetailsAndCourse = {
				fullName : fullName1,
				Phone : phone1,
				email : email1,
				LecName : LecName1,
				CourseName : CourseName1,
				CodeCourse : CodeCourse1,
				Credits : Credits1,
				Room : Room1,
				Time : Time1,
				Syllabus : Syllabus1,
				Academy : AcademySel,
				Faculty : FacultySel
			};

			var database2 = firebase.database().ref().child('Request').push();
			database2.set(lecDetailsAndCourse);
			alert("The Request has been sent");

		} else {
			if(CourseSel == 'Select Course') {
				alert("You must select Course");
				return;
			}
			var lecDetailsAndCourse = {
				fullName : fullName1,
				Phone : phone1,
				email : email1,
				LecName : LecName1,
				Academy : AcademySel,
				Faculty : FacultySel,
				Course : CourseSel
			};

			var database2 = firebase.database().ref().child('Request').push();
			database2.set(lecDetailsAndCourse);
			alert("The Request has been sent");
		}
	}

	$scope.initDetailsAcademy = function () {
		//alert(sessionStorage.getItem("AcademySelected"));
		document.getElementById("detailsAcademyId1").innerHTML = '&nbsp' + sessionStorage.getItem("AcademySelected");
		document.getElementById("detailsFacultyId1").innerHTML = '&nbsp' + sessionStorage.getItem("FacultySelected");
		$('input:radio[id=ch1]').prop('checked', true);
		$('#commentFewWord').val("");
		$('input:checkbox[id=AnnonymosCheck]').prop('checked', true);
		var EN =  document.getElementById('Ename');
		EN.style.display='none';
		$('#textName').val("");
		sessionStorage.setItem("initPageAcademyRank","true");
		sessionStorage.setItem("MyScreen",'moveToRankAcademy');
	}

	$scope.initDetailsLecturer = function () {
		document.getElementById("detailsAcademyId2").innerHTML = '&nbsp' + sessionStorage.getItem("AcademySelected");
		document.getElementById("detailsFacultyId2").innerHTML = '&nbsp' + sessionStorage.getItem("FacultySelected");
		document.getElementById("detailsSemesterId2").innerHTML = '&nbsp' + sessionStorage.getItem("SemesterSelected");
		document.getElementById("detailsLecturerId2").innerHTML = '&nbsp' + sessionStorage.getItem("LecturerSelected");
		document.getElementById("detailsCourseId2").innerHTML = '&nbsp' + sessionStorage.getItem("CourseSelected");
		$('input:radio[id=ch1]').prop('checked', true);
		$('#commentFewWord').val("");
		$('input:checkbox[id=AnnonymosCheck]').prop('checked', true);
		var EN =  document.getElementById('Ename');
		EN.style.display='none';
		$('#textName').val("");
		sessionStorage.setItem("initPageLecturerRank","true");
		sessionStorage.setItem("MyScreen",'moveToRankLecturer');
	}

	var waitFinish = 0;
	$scope.initDetailsAvgTableAcademy = function () {

		var table = document.getElementById("tableA");

		var rowCount = table.rows.length; while(--rowCount) table.deleteRow(rowCount); 
		var rowH = document.getElementById("tableA").rows;
		rowH[0].style.backgroundColor = "rgb(51, 122, 183)" ;
		rowH[0].style.color = "#000000" ;

		waitFinish = 0;
		rankListAcademt = [];
		var avgAcademyDiff = 0, avgFacultySec = 0, avgSocial = 0, avgUnion = 0, avgStudentChar = 0;
		var indexC = 0;
		database.child(sessionStorage.getItem("AcademySelected") + '/Faculty/' + sessionStorage.getItem("FacultySelected") 
			+ '/Rating_faculty').once("value", function(snapshot){
			var numOfChild = snapshot.numChildren();

			snapshot.forEach(function(childSnapshot) {

				rankListAcademt.push(childSnapshot);
				//alert("innn");
				avgAcademyDiff += childSnapshot.val().academy_difficulty;
				avgFacultySec += childSnapshot.val().faculty_secretary;
				avgSocial += childSnapshot.val().social_life;
				avgUnion += childSnapshot.val().student_union;
				avgStudentChar += childSnapshot.val().students_char;
				indexC++;
				var row = table.insertRow(indexC);

				row.insertCell(0).innerHTML = indexC;

				rowH[indexC].cells[0].style.backgroundColor = "rgb(51, 122, 183)";
				rowH[indexC].cells[0].style.color = "#000000";
				rowH[indexC].cells[0].style.fontWeight = "bold";

				if (childSnapshot.val().annonymos == true || childSnapshot.val().rank_name == "") {
					row.insertCell(1).innerHTML = "    -";
				} else {

					row.insertCell(1).innerHTML = childSnapshot.val().rank_name;
				}
				
				row.style.textAlign = "center";

				row.insertCell(2).innerHTML = childSnapshot.val().date;
				row.insertCell(3).innerHTML = childSnapshot.val().academy_difficulty;
				row.insertCell(4).innerHTML = childSnapshot.val().students_char;
				row.insertCell(5).innerHTML = childSnapshot.val().social_life;
				row.insertCell(6).innerHTML = childSnapshot.val().faculty_secretary;
				row.insertCell(7).innerHTML = childSnapshot.val().student_union;
				row.insertCell(8).innerHTML = childSnapshot.val().few_words;
				rowH[indexC].cells[8].style.textAlign = "left";

				if (indexC % 2) {
					row.className = 'cellStyleOdd';
				}
				else {
					row.className = 'cellStyleEven';
				}

			});
			waitFinish = 1;
		});


		sleep(3000).then(() => {

	    	if (waitFinish) {
	    		document.getElementById("detailsAcademyId3").innerHTML = '&nbsp' + sessionStorage.getItem("AcademySelected");
				document.getElementById("detailsFacultyId3").innerHTML = '&nbsp' + sessionStorage.getItem("FacultySelected");
				document.getElementById("detailsdiffId3").innerHTML = '&nbsp' + (avgAcademyDiff / indexC).toFixed(2) ;
				document.getElementById("detailscharacterId3").innerHTML = '&nbsp' + (avgStudentChar / indexC).toFixed(2)   ;
				document.getElementById("detailsSocialId3").innerHTML = '&nbsp' + (avgSocial / indexC).toFixed(2) ;
				document.getElementById("detailssecretaryId3").innerHTML = '&nbsp' + (avgFacultySec / indexC).toFixed(2) ;
				document.getElementById("detailsunionId3").innerHTML = '&nbsp' + (avgUnion / indexC).toFixed(2) ;
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
		
		sessionStorage.setItem("initPageAcademyView","true");
		sessionStorage.setItem("MyScreen",'moveToViewAcademy');
	}


	$scope.initDetailsAvgTableLecturer = function () {

		var numOfRaitingLec = 0;
		var table = document.getElementById("tableB");

		var rowCount = table.rows.length; while(--rowCount) table.deleteRow(rowCount); 
		var rowH = document.getElementById("tableB").rows;


		rowH[0].style.backgroundColor = "rgb(51, 122, 183)" ;
		rowH[0].style.color = "#000000" ;

		//alert(sessionStorage.getItem("SemesterSelected") );

		waitFinish = 0;
		var avgCourseLevel= 0, avgLecAtit = 0, avgMotivation = 0, avgLecInterst = 0;
		var indexC = 0;
		database.child(sessionStorage.getItem("AcademySelected") + '/Faculty/' + sessionStorage.getItem("FacultySelected") 
			+ '/Course/' + sessionStorage.getItem("CourseSelected")  + '/' + sessionStorage.getItem("SemesterSelected")  
			+ '/Lecturer/' + sessionStorage.getItem("LecturerSelected")  +
			'/Rating').once("value", function(snapshot){
			var numOfChild = snapshot.numChildren();
			numOfRaitingLec = numOfChild;
			//if ()
			snapshot.forEach(function(childSnapshot) {

				//alert("innn");
				avgCourseLevel += childSnapshot.val().course_level;
				avgLecAtit += childSnapshot.val().attitude_lecturer_student;
				avgMotivation += childSnapshot.val().ability_to_teach;
				avgLecInterst += childSnapshot.val().teacher_interesting;
				indexC++;
				var row = table.insertRow(indexC);

				row.insertCell(0).innerHTML = indexC;

				rowH[indexC].cells[0].style.backgroundColor = "rgb(51, 122, 183)";
				rowH[indexC].cells[0].style.color = "#000000";
				rowH[indexC].cells[0].style.fontWeight = "bold";

				if (childSnapshot.val().annonymos == true || childSnapshot.val().rank_name == "") {
					row.insertCell(1).innerHTML = "    -";
				} else {

					row.insertCell(1).innerHTML = childSnapshot.val().rank_name;
				}
				
				row.style.textAlign = "center";

				row.insertCell(2).innerHTML = childSnapshot.val().date;
				row.insertCell(3).innerHTML = childSnapshot.val().course_level;
				row.insertCell(4).innerHTML = childSnapshot.val().attitude_lecturer_student;
				row.insertCell(5).innerHTML = childSnapshot.val().ability_to_teach;
				row.insertCell(6).innerHTML = childSnapshot.val().teacher_interesting;
				row.insertCell(7).innerHTML = childSnapshot.val().few_words;
				rowH[indexC].cells[7].style.textAlign = "left";

				if (indexC % 2) {
					row.className = 'cellStyleOdd';
				}
				else {
					row.className = 'cellStyleEven';
				}

			});
			waitFinish = 1;
		});


		sleep(3000).then(() => {

	    	if (waitFinish) {
	    		document.getElementById("detailsAcademyId4").innerHTML = '&nbsp' + sessionStorage.getItem("AcademySelected");
	    		//document.getElementById("detailsAcademyId4").textDecoration = "none";
				document.getElementById("detailsFacultyId4").innerHTML = '&nbsp' + sessionStorage.getItem("FacultySelected");
				document.getElementById("detailsLec4").innerHTML = '&nbsp' + sessionStorage.getItem("LecturerSelected");
				document.getElementById("detailsCourse4").innerHTML = '&nbsp' + sessionStorage.getItem("CourseSelected");
				document.getElementById("detailsSemester4").innerHTML = '&nbsp' + sessionStorage.getItem("SemesterSelected");
				document.getElementById("detailsRevNum4").innerHTML = '&nbsp' + numOfRaitingLec;
				document.getElementById("detailsCourseLevel4").innerHTML = '&nbsp' + (avgCourseLevel / indexC).toFixed(2)   ;
				document.getElementById("detailLecAttit4").innerHTML = '&nbsp' + (avgLecAtit / indexC).toFixed(2) ;
				document.getElementById("detailsMorivation4").innerHTML = '&nbsp' + (avgMotivation / indexC).toFixed(2) ;
				document.getElementById("detailsLecIntr4").innerHTML = '&nbsp' + (avgLecInterst / indexC).toFixed(2) ;
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
		
		sessionStorage.setItem("initPageLecturerView","true");
		sessionStorage.setItem("MyScreen",'moveToViewLecturer');
	}


	$scope.moveToRankAcademy = function(view){
		//alert(view);
		if (sessionStorage.getItem("FacultySelected") != 'Select Faculty' 
			&& sessionStorage.getItem("AcademySelected")  != 'Select Academy')
		{
			if (sessionStorage.getItem("MyScreen") == 'moveToRankAcademy')	{
				if (sessionStorage.getItem("initPageAcademyRank") == "true"){
					//alert("hii");
					$scope.initDetailsAcademy();
				}

			} else {
				initPages();
			}
			$location.path(view);
		}
		else {
			alert("You must select Academy and Faculty");
		}
		
	};

	$scope.moveToViewAcademy = function(view){
		if (sessionStorage.getItem("FacultySelected") != 'Select Faculty' 
			&& sessionStorage.getItem("AcademySelected")  != 'Select Academy')
		{
			if (sessionStorage.getItem("MyScreen") == 'moveToViewAcademy')	{
				
				if (sessionStorage.getItem("initPageAcademyView") == "true" ){
					$scope.initDetailsAvgTableAcademy()
				}
			}
			else {
				initPages();
			}

			$location.path(view);
		}
		else {
			alert("You must select Academy and Faculty");
		}
	};

	$scope.moveToRankLecturer = function(view){
		//alert(view);
	   if (sessionStorage.getItem("CourseSelected") != 'Select Course' 
			&& sessionStorage.getItem("FacultySelected") != 'Select Faculty'
		 	&& sessionStorage.getItem("AcademySelected") != 'Select Academy'
			&& sessionStorage.getItem("SemesterSelected") != 'Select Semester' 
			 &&	sessionStorage.getItem("LecturerSelected") != 'Select Lecturer')
		{
			if (sessionStorage.getItem("MyScreen") == 'moveToRankLecturer')	{
				if (sessionStorage.getItem("initPageLecturerRank") == "true"){
					$scope.initDetailsLecturer();
				}
			} else {
				initPages();
			}
			$location.path(view);
		}
		else {
			alert("You must select Academy, Faculty, Course, Semester and Lecturer");
		}
		
	};

	$scope.moveToViewLecturer = function(view){
		//alert(view);

		if (sessionStorage.getItem("CourseSelected") != 'Select Course' 
			&& sessionStorage.getItem("FacultySelected") != 'Select Faculty'
		 	&& sessionStorage.getItem("AcademySelected") != 'Select Academy'
			&& sessionStorage.getItem("SemesterSelected") != 'Select Semester' 
			 &&	sessionStorage.getItem("LecturerSelected") != 'Select Lecturer')
		{

			if (sessionStorage.getItem("MyScreen") == 'moveToViewLecturer')	{
				$location.path(view);
				if (sessionStorage.getItem("initPageLecturerView") == "true" ){
					$scope.initDetailsAvgTableLecturer();
				}
			}
			else {
				initPages();
			}
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

		var newDBref = database.child(sessionStorage.getItem("AcademySelected") + '/Faculty/' 
			+ sessionStorage.getItem("FacultySelected") + '/Rating_faculty').push();
		newDBref.set(facultyRank);
		alert("Your ranking has beed sent");
		sessionStorage.setItem("initPageAcademyRank","false");
		//sessionStorage.setItem("initPageLecturerRank","false");
		//initPageAcademyRank = false;
		//initPageLecturerRank = false;
		//initAllDropDown(1);
		//loadDataFromDB();
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
			rank_name : userName,
			few_words : FawWords
		};

		var newDBref = database.child(sessionStorage.getItem("AcademySelected") + '/Faculty/' + 
			sessionStorage.getItem("FacultySelected") + '/Course/' + 
			sessionStorage.getItem("CourseSelected") + '/' +
			sessionStorage.getItem("SemesterSelected")  + '/Lecturer/' 
			+ sessionStorage.getItem("LecturerSelected") + 
			'/Rating').push();
		newDBref.set(LecturerRank);
		alert("Your ranking has beed sent");
		//sessionStorage.setItem("initPageAcademyRank","false");
		sessionStorage.setItem("initPageLecturerRank","false");
		//initPageAcademyRank = false;
		//initPageLecturerRank = false;
		//initAllDropDown(1);
		//loadDataFromDB();
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
	.when('/Contact',
		{
		controller: 'mainControler',
		templateUrl: 'partials/contact.html'
		})
	.when('/Syllabus',
		{
		controller: 'mainControler',
		templateUrl: 'partials/CourseDetail.html'
		})
	.when('/contactUs',
		{
		controller: 'mainControler',
		templateUrl: 'partials/contact.html'
		})
		.otherwise({ redirectTo: '/'});

});


