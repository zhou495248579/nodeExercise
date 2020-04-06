const createError = require('http-errors');
const express = require('express');
const session = require('express-session')
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const usersRouter = require('./routes/users');
const loginRoute = require('./routes/login');
const registerRoute = require('./routes/register');
const userMiddleWare = require('./lib/user');
const message = require('./lib/message');
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('photos', __dirname + '/public/images');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
  secret: 'keyboard cat'
}));
app.use(message);
app.use(userMiddleWare);
app.use(express.static(path.join(__dirname, 'public')));

app.use('/users', usersRouter);
app.get('/login',loginRoute.form);
app.post('/login', loginRoute.submit);
app.get('/register',registerRoute.form);
app.post('/register', registerRoute.submit);
app.get('/success', (req,res) => {
  res.render('success', { title: 'success' });
});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
