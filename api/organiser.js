const router = require('express').Router();
const dbQuery = require('../models/db');
const passport = require('../config/passport');
const organiserAuth = require('./middlewares/organiserAuth');

// authenticattion routes
router.post('/authenticate/login', (req, res) => {
  passport.authenticate('local', (err, user) => {
    if (err) return res.status(500).send('Server Error');
    if (!user) return res.status(403).send('Unauthorized');
    req.logIn(user, (err) => {
      if (err) return res.status(500).send('Server Error');
      res.status(200).send('OK');
    });
  })(req, res);
});

router.get('/authenticate/logout', organiserAuth, (req, res) => {
  req.logOut();
  res.status(200).send('OK');
});

// voters operations
router.get('/voter/all', organiserAuth, (req, res) => {
  dbQuery(
    'SELECT * FROM Voters', (err, results) => {
      if (err) return res.status(500).send('Database Error');
      res.status(200).json(results);
    }
  );
});

router.get('/voter/:id', organiserAuth, (req, res) => {
  dbQuery(
    `SELECT * FROM Voters WHERE id=${req.params.id}`, (err, results) => {
      if (err) return res.status(500).send('Database Error');
      res.status(200).json(results);
    }
  );
});

router.post('/voter', organiserAuth, (req, res) => {
  let { name, nric, phone, email, company, shares } = req.body;
  dbQuery(
    `INSERT INTO Voters (name, nric, phone, email, company, shares)
    VALUES ('${name}', '${nric}', '${phone}', '${email}', '${company}', '${shares}')`,
    (err) => {
      if (err) return res.status(500).send('Database Error');
      res.status(200).send('OK');
    }
  );
});

router.put('/voter/:id', organiserAuth, (req, res) => {
  let id = req.params.id;
  let { name, nric, phone, email, company, shares } = req.body;
  dbQuery(
    `UPDATE Voters
    SET name='${name}', nric='${nric}', phone='${phone}', email='${email}', company='${company}', shares='${shares}'
    WHERE id=${id}`,
    (err) => {
      if (err) return res.status(500).send('Database Error');
      res.status(200).send('OK');
    }
  );
});

router.delete('/voter/:id', organiserAuth, (req, res) => {
  dbQuery(
    `DELETE FROM Voters WHERE id=${req.params.id}`, (err) => {
      if (err) return res.status(500).send('Database Error');
      res.status(200).send('OK');
    }
  );
});

// events operations
router.get('/event/all', organiserAuth, (req, res) => {
  dbQuery(
    'SELECT * FROM Events', (err, results) => {
      if (err) return res.status(500).send('Database Error');
      res.status(200).json(results);
    }
  );
});

router.get('/event/:id', organiserAuth, (req, res) => {
  dbQuery(
    `SELECT * FROM Events WHERE id=${req.params.id}`, (err, results) => {
      if (err) return res.status(500).send('Database Error');
      res.status(200).json(results);
    }
  );
});

router.post('/event', organiserAuth, (req, res) => {
  dbQuery(
    `INSERT INTO Events (name)
    VALUES ('${req.body.name}')`,
    (err) => {
      if (err) return res.status(500).send('Database Error');
      res.status(200).send('OK');
    }
  );
});

router.put('/event/:id', organiserAuth, (req, res) => {
  dbQuery(
    `UPDATE Events
    SET name=${req.body.name}
    WHERE id=${req.params.id}`,
    (err) => {
      if (err) return res.status(500).send('Database Error');
      res.status(200).send('OK');
    }
  );
});

router.delete('/event/:id', organiserAuth, (req, res) => {
  dbQuery(
    `DELETE FROM Events WHERE id=${req.params.id}`, (err) => {
      if (err) return res.status(500).send('Database Error');
      res.status(200).send('OK');
    }
  );
});

// questions operations

module.exports = router;
