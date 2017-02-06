const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (token) {
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
      if (err) return res.status(403).send('Unauthorized');
      req.decoded = decoded;
      console.log(decoded);
      next();
    });
  } else {
    return res.status(403).send('Unauthorized');
  }
};