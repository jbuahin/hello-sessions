// include modules
var bodyParser          = require('body-parser');
var cookieParser        = require('cookie-parser');
var express             = require('express');
var LocalStrategy       = require('passport-local').Strategy;
var passport            = require('passport');
var session             = require('express-session');

// initialize express app
var app = express();
var users = {};

// tell passport to use a local strategy and tell it how to validate a username and password
passport.use(new LocalStrategy(function(username, password, done) {
	if (!users.hasOwnProperty(username)) 
			users[username] = {}
	return done(null, { username: username, pairs: users[username] });
}));

// tell passport how to turn a user into serialized data that will be stored with the session
passport.serializeUser(function(user, done) {
    done(null, users.username );
});

// tell passport how to go from the serialized data back to the user
passport.deserializeUser(function(username, done) {
        done(err, { username: username, pairs: users[username] });
});

// tell the express app what middleware to use
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({ secret: 'secret key', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// home page
app.get('/', function (req, res) {
    if (req.user) return res.send('Hello, ' + req.user.username);
    res.send('Hello, Stranger!');
});

// get key value  health
app.post('/login',passport.authenticate('local'), 
    function(req, res) {
        if (req.user)
		{
				return res.sendStatus(200).send(req.user.pair);
		}
		
);
												
													
// check health
app.get('/health',
    function(req, res) {
        if (req,res)
			return res.sendStatus(200);
    }
);

// specify a URL that only authenticated users can hit
app.get('/protected',
    function(req, res) {
        if (!req.user) return res.sendStatus(401);
        res.send('You have access.');
    }
);

// specify the login url
app.put('/auth',
    passport.authenticate('local'),
    function(req, res) {
        res.send('You are authenticated, ' + req.user.username);
    });

// log the user out
app.delete('/auth', function(req, res) {
    req.logout();
    res.send('You have logged out.');
});

// start the server listening
app.listen(3000, function () {
    console.log('Server listening on port 3000.');
});