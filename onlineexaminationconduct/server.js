const express = require('express');
var app = express();
const path = require('path');
const logger = require('morgan');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
//const dotenv = require('dotenv');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const request = require('request');
const errorHandler = require('express-error-handler');
//const methodOverride = require('method-override');

// Models
var User = require('./models/User');

// Controllers
var userController = require('./controllers/user');
var apis = require('./controllers/api');




mongoose.Promise = global.Promise;

//db connection
var dbPath = "mongodb://localhost/onlineExamination3";
mongoose.connect(dbPath || process.env.MONGODB_URI );
mongoose.connection.once('open',function(){
  console.log("Database Connection Established Successfully.");
});
mongoose.connection.on('error', function() {
  console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
  //process.exit(1);
});

//app settings
app.set('port', process.env.PORT || 3000);
app.use(compression());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
  req.isAuthenticated = function() {
    console.log('req headers and req cookies :', req.headers.authorization);
    var token = (req.headers.authorization && req.headers.authorization.split(' ')[1]) || req.cookies.token;
    try {
      return jwt.verify(token, "8073291140");
    } catch (err) {
      return false;
    }
  };

  if (req.isAuthenticated()) {
    var payload = req.isAuthenticated();
    User.findById(payload.sub, function(err, user) {
      req.user = user;
      next();
    });
  } else {
    next();
  }
});
app.delete('/account', userController.ensureAuthenticated, userController.accountDelete);
app.post('/signup', userController.signupPost);
app.post('/login', userController.loginPost);
app.post('/forgot', userController.forgotPost);
app.post('/auth/facebook', userController.authFacebook);
app.get('/auth/facebook/callback', userController.authFacebookCallback);
app.post('/auth/google', userController.authGoogle);
app.get('/auth/google/callback', userController.authGoogleCallback);
//including controllers files
app.use('/api',userController.ensureAuthenticated,  apis);

app.get('*', function(req, res) {
  res.redirect('/#' + req.originalUrl);
});

// error handler
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.sendStatus(err.status || 500);
});


/**
 * Error Handler.
 */
 app.use(errorHandler());


/**
 * Start Express server.
 */
 app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});



 module.exports = app;
