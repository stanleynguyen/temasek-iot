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

router.get('/my-info', organiserAuth, (req, res) => {
  dbQuery(
    `SELECT name
    FROM Companies
    WHERE id=${req.user.company_id}`,
    (err, company) => {
      if (err) return res.status(500).send('Server Error');
      res.status(200).json({
        email: req.user.email,
        company: company[0].name
      });
    }
  );
});

// voters operations
router.get('/voter/all', organiserAuth, (req, res) => {
  dbQuery(
    `SELECT * FROM Voters
    WHERE phone_verified=TRUE
    AND company_id=${req.user.company_id}`,
    (err, results) => {
      if (err) return res.status(500).send('Database Error');
      res.status(200).json(results);
    }
  );
});

router.get('/voter/:id', organiserAuth, (req, res) => {
  dbQuery(
    `SELECT * FROM Voters
    WHERE id=${req.params.id}
    AND company_id=${req.user.company_id}`,
    (err, results) => {
      if (err) return res.status(500).send('Database Error');
      res.status(200).json(results);
    }
  );
});

router.post('/voter/:id', organiserAuth, (req, res) => {
  dbQuery(
    `UPDATE Voters
    SET organiser_verified=TRUE
    WHERE id=${req.params.id}
    AND company_id=${req.user.company_id}`,
    (err) => {
      if (err) return res.status(500).send('Database Error');
      res.status(200).send('OK');
    }
  );
});

router.delete('/voter/:id', organiserAuth, (req, res) => {
  dbQuery(
    `DELETE FROM Voters
    WHERE id=${req.params.id}
    AND company_id=${req.user.company_id}`,
    (err) => {
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
    `SELECT * FROM Events
    WHERE id=${req.params.id}
    AND company_id=${req.user.company_id}`,
    (err, results) => {
      if (err) return res.status(500).send('Database Error');
      res.status(200).json(results);
    }
  );
});

router.post('/event', organiserAuth, (req, res) => {
  dbQuery(
    `INSERT INTO Events (name, company, started, ended)
    VALUES ('${req.body.name}', ${req.user.company_id}, FALSE, FALSE)`,
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
    WHERE id=${req.params.id}
    AND company_id=${req.user.company_id}`,
    (err) => {
      if (err) return res.status(500).send('Database Error');
      res.status(200).send('OK');
    }
  );
});

router.delete('/event/:id', organiserAuth, (req, res) => {
  dbQuery(
    `DELETE FROM Events
    WHERE id=${req.params.id}
    AND company_id=${req.user.company_id}`,
    (err) => {
      if (err) return res.status(500).send('Database Error');
      res.status(200).send('OK');
    }
  );
});

// questions operations

module.exports = router;
