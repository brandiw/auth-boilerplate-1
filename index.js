// Require in modules
require('dotenv').config();
const express = require('express');
const flash = require('connect-flash');
const layouts = require('express-ejs-layouts');
const moment = require('moment');
const passport = require('./config/passportConfig');
const session = require('express-session');

// Instantiate the express app
const app = express();

// Set up any middleware or settings
app.set('view engine', 'ejs');
app.use(layouts);
app.use('/', express.static('static'));
app.use(express.urlencoded({ extended: false }));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));
app.use(flash()); // After session!
app.use(passport.initialize());
app.use(passport.session());

// Custom middleware: write data to locals for EVERY page
app.use((req, res, next) => {
  res.locals.alerts = req.flash();
  res.locals.currentUser = req.user;
  res.locals.moment = moment;
  next();
});

// Controllers
app.use('/auth', require('./controllers/auth'));
app.use('/profile', require('./controllers/profile'));

// Routes
app.get('/', (req, res) => {
    res.render('home');
});

app.get('*', (req, res) => {
    res.render('404');
});

// LISTEN!
app.listen(process.env.PORT || 3000, () => {
    console.log("☕ Server is now running at port", process.env.PORT);
});
