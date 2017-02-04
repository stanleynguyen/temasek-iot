if (process.env.NODE_ENV === 'dev') require('dotenv').load();

const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');

const app = express();
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(require('cookie-parser')());
app.use(require('express-session')({ secret: process.env.SECRET, resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use(require('./api'));

app.listen(process.env.PORT, (err) => {
  if (err) throw err;
  console.log(`UP AND RUNNING AT ${process.env.PORT}`); // eslint-disable-line no-console
});
