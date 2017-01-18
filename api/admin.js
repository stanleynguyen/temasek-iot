const router = require('express').Router();

const dbQuery = require('../models/db');
const adminAuth = require('./middlewares/adminAuth');

router.use(adminAuth);

router.get('/voter/all', (req, res) => {
  dbQuery(
    'SELECT * FROM Voters', (err, results) => {
      if (err) return res.status(500).send('Database Error');
      res.status(200).json(results);
    }
  );
});

router.get('/voter/:id', (req, res) => {
  dbQuery(
    `SELECT * FROM Voters WHERE id=${req.params.id}`, (err, results) => {
      if (err) return res.status(500).send('Database Error');
      res.status(200).json(results);
    }
  );
});

router.post('/voter', (req, res) => {
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

router.put('/voter', (req, res) => {
  let { id, name, nric, phone, email, company, shares } = req.body;
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

router.delete('/voter/:id', (req, res) => {
  dbQuery(
    `DELETE FROM Voters WHERE id=${req.params.id}`, (err) => {
      if (err) return res.status(500).send('Database Error');
      res.status(200).send('OK');
    }
  );
});

module.exports = router;
