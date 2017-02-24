'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const mongoose = require('mongoose');
const validator = require('validator');

// configuration ===============================================================
const configDB = require('./config/database.js');
mongoose.connect(configDB.url); // connect to our database

const app = express();
const port = process.env.PORT || 5000;
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json

app.set('view engine', 'ejs'); // set up ejs for templating
app.use(express.static(__dirname + '/public'));

var Users = require('./models/user.js');
var Tasks = require('./models/task.js');

// Configure our app
const store = new MongoDBStore({
  uri: configDB.url,
  collection: 'sessions',
});

app.use(bodyParser.urlencoded({
  extended: true,
}));

app.use(session({
  secret: 'thisisasecretsession',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: 'auto',
  },
  store,
}));

function isLoggedIn(req, res, next) {
	if(res.locals.currentUser) {
		next();
	}

}

app.use(function(req, res, next) {;
	if(req.session.userId) {
		Users.findById(req.session.userId, function(err, user) {
			if(!err) {
				res.locals.currentUser = user;
			}
			next();
		});
	}
	else {
		next();
	}
});

function loadUserTasks(req, res, next) {
	if(!res.locals.currentUser) {
		return next();
	}

	Tasks.find({ $or:[
			{owner: res.locals.currentUser},
			{collaborator1: res.locals.currentUser.email},
			{collaborator2: res.locals.currentUser.email},
			{collaborator3: res.locals.currentUser.email}
		]}, function(err, task) {
      if(!err) {
  			res.locals.task = task;
  		}
  		else {
  			console.log('Error loading task.');
  			res.render('index', { errors: 'Error loading task.'} );
  		}
  		next();
	  }
  );
}

app.get('/', loadUserTasks , function (req, res) {
	res.render('index.ejs');
});

app.post('/user/login', function (req, res) {
	var user = Users.findOne({email: req.body.email}, function(err, user) {
		if(err || !user) {
			res.render('index', {errors: "Invalid email address"});
			return;
		}

    user.comparePassword(req.body.password, function(err, isMatch) {
			if(err || !isMatch){
				res.render('index', {errors: 'Invalid password'});
				console.log('\n\nInvalid password.\n\n');
				// res.render('index', {errors: 'Invalid password'});
				return;
	   		}
		   	else{
				req.session.userId = user._id;
				res.redirect('/');
				return;
		   	}

		});
	});

});

app.post('/user/register', function (req, res) {
  if(!validator.isEmail(req.body.email)) {
		return res.render('index.ejs', { errors: 'Bad email'});
	}

  if(req.body.email.length < 1 || req.body.email.length > 50) {
		return res.render('index.ejs', { errors: 'Bad email'});
	}

  if(req.body.name.length < 1 || req.body.name.length > 50) {
    return res.render('index.ejs', { errors: 'Bad name'});
  }

  if(req.body.password.length < 1 || req.body.password.length > 50) {
    return res.render('index.ejs', { errors: 'Bad password'});
  }

  var newUser = new Users();
	newUser.name = req.body.name;
	newUser.email = req.body.email;
	newUser.hashed_password = req.body.password;

  newUser.save(function(err, user){

    if(user && !err){
      req.session.userId = user._id;
      res.redirect('/');
      return;
  	}
  	var errors = "Error registering you.";

  });

// end of Register post
});

app.get('/user/logout', function(req, res){
  req.session.destroy(function(){
    res.redirect('/');
  });
});

//Everything below this can only be done by a logged in user.
//This middleware will enforce that.

app.use(isLoggedIn);

app.post('/task/create', function (req, res) {

  if(req.body.name.length < 1 || req.body.name.length > 50) {
    return res.render('index.ejs', { errors: 'Bad title'});
  }

  if(req.body.collaborator1.length > 1) {
    if(!validator.isEmail(req.body.collaborator1)) {
  		return res.render('index.ejs', { errors: 'Bad collaborator email'});
  	}
  }

  if(req.body.collaborator2.length > 1) {
    if(!validator.isEmail(req.body.collaborator2)) {
      return res.render('index.ejs', { errors: 'Bad collaborator email'});
    }
  }

  if(req.body.collaborator3.length > 1) {
    if(!validator.isEmail(req.body.collaborator3)) {
      return res.render('index.ejs', { errors: 'Bad collaborator email'});
    }
  }

	var newTask = new Tasks();

	newTask.owner = res.locals.currentUser;
	newTask.name = req.body.name;
	newTask.description = req.body.description;
  newTask.collaborator1 = req.body.collaborator1;
  newTask.collaborator2 = req.body.collaborator2;
  newTask.collaborator3 = req.body.collaborator3;
	newTask.isComplete = false;

  newTask.save(function(err, task){

    if(task && !err){
      if(err || !task) {
  			res.render('index', { errors: 'Error saving task to the database.'} );
  		} else {
  			res.redirect('/');
  		}
    }
  });

});


app.get('/task/complete', function(req, res) {

	console.log('Completing task. Id: ', req.query.id);

	task.findById(req.query.id, function(err, completedTask) {
		if(err || !completedTask) {
			console.log('Error finding task on database.');
			res.redirect('/');
		}
		else {
			console.log("Method called.");
			completedTask.completeTask();
			res.redirect('/');
		}
	});
});



app.get('/task/remove', function(req, res) {
	console.log('Removing task. Id: ', req.query.id);

	task.findById(req.query.id, function(err, taskToRemove) {
		if(err || !taskToRemove) {
			console.log('Error finding task on database.');
			res.redirect('/');
		}
		else {
			taskToRemove.remove();
			res.redirect('/');
		}
	});
});

app.listen(port);
console.log('The magic happens on port ' + port);
