// const auth = require('http-auth');
// const basic = auth.basic({ realm: 'Admin' }, (admin, password, done) => {
//   done(admin === process.env.ADMIN && password === process.env.PASSWORD);
// });

// module.exports = auth.connect(basic);
module.exports = (req, res, next) => {
  var admin = req.query.admin || req.body.admin;
  var password = req.query.basicPassword || req.body.basicPassword;
  var authenticated = admin === process.env.ADMIN && password === process.env.PASSWORD;
  if (!authenticated) return res.status(403).send('Unauthorized');
  next();
};
