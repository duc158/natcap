var task = require('./models/task')

module.exports = function(app, passport) {

// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    // task SECTION =========================
    app.get('/task', isLoggedIn, function(req, res) {

      res.render('task.ejs', {
        user : req.user

      });

    });

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/task', // redirect to the secure  section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/task', // redirect to the secure task section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

// =============================================================================
// CREATE A NEW TASK ===========================================================
// =============================================================================

        app.post('/task/create', function (req, res) {

          var newTask = new task();

        	newTask.owner = res.locals.currentUser;
        	newTask.title = req.body.title;
        	newTask.description = req.body.description;
        	newTask.collaborator1 = req.body.collaborator1;
        	newTask.collaborator2 = req.body.collaborator2;
        	newTask.collaborator3 = req.body.collaborator3;
        	newTask.isComplete = false;

        	console.log("Creating task...\n");
        	newTask.save(function(err, task) {
        		if(err || !task) {
        			console.log('Error saving task to the database.');
        			res.render('index', { errors: 'Error saving task to the database.'} );
        		}
        		else {
        			// console.log('New task added: ', task.title);
        			res.redirect('/task');
        		}
        	});


        });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
