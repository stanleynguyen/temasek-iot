const passport = require('passport');
const localStrat = require('passport-local').Strategy;

const dbQuery = require('../models/db');
const User = require('../models/organiser');

passport.serializeUser( (user, done) => {
  done(null, user[0].id);
});

passport.deserializeUser( (userId, done) => {
  dbQuery(
    `SELECT * FROM Organisers WHERE id=${userId}`, (err, user) => {
      done(err, user[0]);
    }
  );
});

passport.use(new localStrat( (email, password, done) => {
  dbQuery(
    `SELECT * FROM Organisers WHERE email='${email}'`, (err, user) => {
      if (err) return done(err);
      if (user.length === 0) return done(null, false);
      if (!User.checkPassword(password, user[0].password)) return done(null, false);
      return done(null, user);
    }
  );
}));

module.exports = passport;
