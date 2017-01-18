const router = require('express').Router();

const dbQuery = require('../models/db');
const adminAuth = require('./middlewares/adminAuth');

router.use(adminAuth);

router.get('/organiser/all', (req, res) => {
  dbQuery('SELECT * FROM Organisers', (err, results) => {
    if (err) return res.status(500).send('Database Error');
    res.status(200).json(results);
  });
});

router.post('/organiser', (req, res) => {
  let { email, password, company_id } = req.body;
  dbQuery(
    `INSERT INTO Organisers (email, password, company_id)
    VALUES ('${email}', '${password}', '${company_id}')`,
    (err) => {
      if (err) return res.status(500).send('Database Error');
      res.status(200).send('OK');
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
