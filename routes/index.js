var express = require('express');
var router = express.Router();

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('panel.db');
var check;

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

function add_name_to_db(res, name, surname) {
	var q = 'INSERT INTO STUDENTS(Name, Surname) VALUES(' + '"' + name + '", "' + surname + '")';
	db.serialize(function() {
	  db.run(q);
	});
	db.close();
}

function getAllGroups() {
	db.all('SELECT * FROM Groups', function(err, row) {
		console.log(row);
	});
}

router.get('/authorization', function(req, res, next) {
  var name = req.query.name;
  var surname = req.query.surname;
  res.send(getAllGroups());
  // add_name_to_db(res, name, surname);
  // res.send(name + '<br>' + surname);
  next();
});

router.get('/login', function(req, res, next) {
  res.render('login', { username: 'name', password: 'password'});
});

router.get('/test', function(req, res, next) {
	var d = [
    {
        "id": 1,
        "name": "Item 1",
        "price": "$1"
    },
    {
        "id": 2,
        "name": "Item 2",
        "price": "$2"
    },
    {
        "id": 3,
        "name": "Item 3",
        "price": "$3"
    },
    {
        "id": 4,
        "name": "Item 4",
        "price": "$4"
    },
    {
        "id": 5,
        "name": "Item 5",
        "price": "$5"
    },
    {
        "id": 6,
        "name": "Item 6",
        "price": "$6"
    },
    {
        "id": 7,
        "name": "Item 7",
        "price": "$7"
    },
    {
        "id": 8,
        "name": "Item 8",
        "price": "$8"
    },
    {
        "id": 9,
        "name": "Item 9",
        "price": "$9"
    },
    {
        "id": 10,
        "name": "Item 10",
        "price": "$10"
    },
    {
        "id": 11,
        "name": "Item 11",
        "price": "$11"
    },
    {
        "id": 12,
        "name": "Item 12",
        "price": "$12"
    },
    {
        "id": 13,
        "name": "Item 13",
        "price": "$13"
    },
    {
        "id": 14,
        "name": "Item 14",
        "price": "$14"
    },
    {
        "id": 15,
        "name": "Item 15",
        "price": "$15"
    },
    {
        "id": 16,
        "name": "Item 16",
        "price": "$16"
    },
    {
        "id": 17,
        "name": "Item 17",
        "price": "$17"
    },
    {
        "id": 18,
        "name": "Item 18",
        "price": "$18"
    },
    {
        "id": 19,
        "name": "Item 19",
        "price": "$19"
    },
    {
        "id": 20,
        "name": "Item 20",
        "price": "$20"
    }
];
	/*var d = [{
        id: 1,
        name: 'Item 1',
        price: '$1'
    }, {
        id: 2,
        name: 'Item 2',
        price: '$2'
    }];*/
	res.header("Access-Control-Allow-Origin", "*");
  	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	res.json(d);
});

module.exports = router;
