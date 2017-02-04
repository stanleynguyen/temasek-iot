const router = require('express').Router();

const dbQuery = require('../models/db');
const adminAuth = require('./middlewares/adminAuth');
const Organiser = require('../models/organiser');

router.use(adminAuth);

router.get('/company/all', (req, res) => {
  dbQuery('SELECT * FROM Companies', (err, results) => {
    if (err) return res.status(500).send('Database Error');
    res.status(200).json(results);
  });
});

router.post('/company', (req, res) => {
  dbQuery(
    `INSERT INTO Companies(name)
    VALUES('${req.body.name}')`,
    (err) => {
      if (err) return res.status(500).send('Database Error');
      res.status(200).send('OK');
    }
  );
});

router.delete('/company/:id', (req, res) => {
  dbQuery(
    `DELETE FROM Companies WHERE id=${req.params.id}`, (err) => {
      if (err.code === '23503') return res.status(500).send('There is reference to this company');
      if (err) return res.status(500).send('Database Error');
      res.status(200).send('OK');
    }
  );
});

router.get('/organiser/all', (req, res) => {
  dbQuery(
    `SELECT Organisers.email, Organisers.company_id, Companies.name as companyName
    FROM Organisers, Companies
    WHERE Organisers.company_id=Companies.id`,
    (err, results) => {
      if (err) return res.status(500).send('Database Error');
      res.status(200).json(results);
    });
});

router.post('/organiser', (req, res) => {
  let { email, password, company_id } = req.body;
  password = Organiser.encryptPassword(password);
  dbQuery(
    `INSERT INTO Organisers (email, password, company_id)
    VALUES ('${email}', '${password}', '${company_id}')`,
    (err) => {
      if (err) return res.status(500).send('Database Error');
      res.status(200).send('OK');
    }
  );
});

router.get('/organiser/:id', (req, res) => {
  dbQuery(
    `SELECT * FROM Organisers WHERE id=${req.params.id}`, (err, results) => {
      if (err) return res.status(500).send('Database Error');
      res.status(200).json(results);
    }
  );
});

router.delete('/organiser/:id', (req, res) => {
  dbQuery(
    `DELETE FROM Organisers WHERE id=${req.params.id}`, (err) => {
      if (err) return res.status(500).send('Database Error');
      res.status(200).send('OK');
    }
  );
});

module.exports = router;
