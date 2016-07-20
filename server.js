// require express and other modules
var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),

    //  NEW ADDITIONS
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;


var db = require('./models'),
    Event = db.Event,
    User = db.User;

// middleware for auth
app.use(cookieParser());
app.use(session({
  secret: 'supersecretkey', // change this!
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());


// passport config
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// serve static files from public folder
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));

// We'll serve jQuery and bootstrap from a local bower cache avoiding CDNs
// We're placing these under /vendor to differentiate them from our own assets
app.use('/vendor', express.static(__dirname + '/bower_components'));

var controllers = require('./controllers');

//HTML Routes
//load index.html
app.get('/', function homepage (req, res) {
  if (req.user) {
    res.sendFile(__dirname + '/views/index.html');
  } else {
    res.sendFile(__dirname + '/views/login.html');
  }

});



// show signup view
app.get('/signup', function (req, res) {
  res.sendFile(__dirname + '/views/signup.html');
});


// show login view
app.get('/login', function (req, res) {
  res.sendFile(__dirname + '/views/login.html');
});

// show login error view
app.get('/loginError', function (req, res) {
  res.sendFile(__dirname + '/views/loginError.html');
});
// Show search page
app.get('/search', function (req, res){
  res.sendFile(__dirname + '/views/search.html');
});





//API routes
// app.post('/api/users', controllers.usersController.create);
app.put('/api/users/:_id', controllers.usersController.update);
app.post('/api/events/:_host', controllers.eventsController.create);
app.get('/api/events/', controllers.eventsController.index);
app.get('/api/events/:_event_id/', controllers.eventsController.show);
app.put('/api/events/:_event_id/', controllers.eventsController.update);
app.delete('/api/events/:_event_id/', controllers.eventsController.delete);
app.put('/api/events1/:_event_id/', controllers.eventsController.update1);
app.get('/api/users/:_id', controllers.usersController.show);
app.get('/api/me', function (req, res) {
  res.json(req.user);
});

app.get('/templates/:name', controllers.api.templates);


//Authentication Routes
// sign up new user, then log them in
// hashes and salts password, saves new user to db
app.post('/signup', function (req, res) {
  User.register(new User({ username: req.body.username }), req.body.password,
    function (err, newUser) {
      passport.authenticate('local')(req, res, function() {
        res.redirect('/');
      });
    }
  );
});

// log in user
app.post('/login',
  passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/loginError' }));


// log out user
app.get('/logout', function (req, res) {
  console.log("BEFORE logout", req.user);
  req.logout();
  console.log("AFTER logout", req.user);
  res.redirect('/login');
});



/**********
 * SERVER *
 **********/

// listen on port 3000
app.listen(process.env.PORT || 3000, function () {
  console.log('Express server is running on http://localhost:3000/');
});
