const auth = require('http-auth');
const basic = auth.basic({ realm: 'Admin' }, (admin, password, done) => {
  done(admin === process.env.ADMIN && process.env.PASSWORD);
});

module.exports = auth.connect(basic);
