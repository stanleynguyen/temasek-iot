const router = require('express').Router();

const dbQuery = require('../models/db');
const adminAuth = require('./middlewares/adminAuth');

router.use(adminAuth);

// voters operations
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

router.put('/voter/:id', (req, res) => {
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

router.delete('/voter/:id', (req, res) => {
  dbQuery(
    `DELETE FROM Voters WHERE id=${req.params.id}`, (err) => {
      if (err) return res.status(500).send('Database Error');
      res.status(200).send('OK');
    }
  );
});

// events operations
router.get('/event/all', (req, res) => {
  dbQuery(
    'SELECT * FROM Events', (err, results) => {
      if (err) return res.status(500).send('Database Error');
      res.status(200).json(results);
    }
  );
});

router.get('/event/:id', (req, res) => {
  dbQuery(
    `SELECT * FROM Events WHERE id=${req.params.id}`, (err, results) => {
      if (err) return res.status(500).send('Database Error');
      res.status(200).json(results);
    }
  );
});

router.post('/event', (req, res) => {
  dbQuery(
    `INSERT INTO Events (name)
    VALUES ('${req.body.name}')`,
    (err) => {
      if (err) return res.status(500).send('Database Error');
      res.status(200).send('OK');
    }
  );
});

router.put('/event/:id', (req, res) => {
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

router.delete('/event/:id', (req, res) => {
  dbQuery(
    `DELETE FROM Events WHERE id=${req.params.id}`, (err) => {
      if (err) return res.status(500).send('Database Error');
      res.status(200).send('OK');
    }
  );
});

// questions operations

module.exports = router;
