var express = require('express');
var router = express.Router();

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('panel.db');
var check;

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/login', function(req, res, next) {
  	/*getting all groups*/
  	var tab = [];

    function dbHandler(err, row){
        if (err) {
            console.log("Error: " + err);
        } else {
            tab.push(row);
        }
    }    

    function dbFinal(){
  		res.render('login', {'groups' : tab});
    }

    db.each("SELECT * FROM Groups", dbHandler, dbFinal);
});


function add_name_to_db(name, surname, group) {
	var q = 'INSERT INTO Students(Name, Surname, Groups) VALUES(' + '"' + name + '", "' + surname + '", ' + group + ')';
	db.serialize(function() {
	  db.run(q);
	});
}

router.get('/students', function(req, res, next) {
  var name = req.query.name;
  var surname = req.query.surname;
  var group = req.query.group;

  add_name_to_db(name, surname, group);

  /*getting all students*/
  var students = [];

    function dbHandler(err, row){
        if (err) {
            console.log("Error: " + err);
        } else {
            students.push(row);
        }
    }    

    function dbFinal(){
  		res.render('students', {'students' : students, 'current_student' : {'Name': name, 'Surname': surname}});
    }

    db.each("SELECT * FROM Students", dbHandler, dbFinal);
});


router.get('/student/:id', function(req, res) {
	var id = req.params.id;
	var dict = {};
	dict['id'] = id;
	dict['refs'] = [];
	dict['students_from_group'] = [];
	dict['notifications'] = [];
	dict['lessons'] = [];

	function writeResponse(res, d) {
		var r = d['name'];
		console.log(d);
		res.send(r);
	}

    function dbHandler(err, row){
        if (err)
            console.log("Error: " + err);
        else {
        	dict['group_id'] = row.ID;
            dict['group_day'] = row.Day;
            dict['group_time'] = row.Time;
            dict['ref_stat'] = row.Referat_status;
        }
    }    

    function dbFinal(){

		function dbHandler1(err, row){
	        if (err)
	            console.log("Error: " + err);
	      	else {
	            dict['name'] = row.Name;
	            dict['surname'] = row.Surname;
	        }
	    }    

	    function dbFinal1(){
	    	
			function dbHandler2(err, row){
		        if (err)
		            console.log("Error: " + err);
		        else 
		            dict['refs'].push(row);
		    }    

		    function dbFinal2(){
			    function dbHandler3(err, row){
			        if (err)
			            console.log("Error: " + err);
			        else 
			            dict['students_from_group'].push(row);
			    }    

			    function dbFinal3(){
			    	
					function dbHandler4(err, row){
			        if (err)
			            console.log("Error: " + err);
			        else 
			            dict['notifications'].push(row);
				    }    

				    function dbFinal4(){
				    	
						function dbHandler5(err, row){
					        if (err)
					            console.log("Error: " + err);
					        else 
					            dict['lessons'].push(row);
					    }    

					    function dbFinal5(){
					    	
							// writeResponse(res, dict);
					  		res.render('student', dict);
					    }

					    db.each("SELECT * FROM Lessons WHERE Groups = " + dict['group_id'] + " ORDER BY Date", dbHandler5, dbFinal5); 
				    }

				    db.each("SELECT * FROM Notifications WHERE Student = " + id + " OR Groups = " + dict['group_id'], dbHandler4, dbFinal4); 
			    }

			    db.each("SELECT * FROM Students AS s OUTER LEFT JOIN Referats AS r ON s.ID = r.Student WHERE s.Groups = " + dict['group_id'], dbHandler3, dbFinal3);
			}

		    db.each("SELECT * FROM Referats WHERE Student IS NULL", dbHandler2, dbFinal2);
		}

	    db.each("SELECT * FROM Students WHERE ID = " + id, dbHandler1, dbFinal1);
	}

    db.each("SELECT * FROM Groups WHERE ID = (SELECT Groups FROM STUDENTS WHERE ID = " + id + ")", dbHandler, dbFinal);
});

router.get('/grades/:id', function(req, res, next) {
	var id = req.params.id;
	var grades = [];
	function dbHandler(err, row){
        if (err)
            console.log("Error: " + err);
        else 
            grades.push(row);
    }    

    function dbFinal(){
		res.header("Access-Control-Allow-Origin", "*");
	  	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
		res.json(grades);
    }
	db.each("SELECT * FROM Grades WHERE Student = " + id, dbHandler, dbFinal); 
})

router.get('/referats/:student/:id', function(req, res, next) {
	var student = req.params.student;
	var id = req.params.id;
	db.run("UPDATE Referats SET Student = ? WHERE ID = ?", [student, id]);
	res.render('referat', {'id': student});
})

module.exports = router;
