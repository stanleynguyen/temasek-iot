const router = require('express').Router();
const generatePsswd = require('password-generator');
const mailer = require('nodemailer').createTransport({
  pool: true,
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'temasekpolling@gmail.com',
    pass: 'Temasek123'
  }
});

const dbQuery = require('../models/db');
const adminAuth = require('./middlewares/adminAuth');
const Organiser = require('../models/organiser');

router.use(adminAuth);

router.get('/company/all', (req, res) => {
  dbQuery(
    `SELECT Companies.id, Companies.name,
    CASE WHEN COUNT(Organisers) = 0 THEN '[]'
    ELSE json_agg((SELECT x FROM (SELECT Organisers.id, Organisers.email) x)) END AS organisers
    FROM Companies LEFT JOIN Organisers ON company_id = Companies.id
    GROUP BY Companies.id`,
    (err, results) => {
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
      if (err && err.code === '23503') return res.status(500).send('There is reference to this company');
      if (err) return res.status(500).send('Database Error');
      res.status(200).send('OK');
    }
  );
});

router.get('/organiser/all', (req, res) => {
  dbQuery(
    `SELECT Organisers.id, Organisers.email, Organisers.company_id, Companies.name as companyName
    FROM Organisers, Companies
    WHERE Organisers.company_id=Companies.id`,
    (err, results) => {
      if (err) return res.status(500).send('Database Error');
      res.status(200).json(results);
    });
});

router.post('/organiser', (req, res) => {
  let { email, company_id } = req.body;
  let password = generatePsswd(12, false);
  let hashedPassword = Organiser.encryptPassword(password);
  dbQuery(
    `INSERT INTO Organisers (email, password, company_id)
    VALUES ('${email}', '${hashedPassword}', ${company_id})`,
    (err) => {
      if (err) return res.status(500).send('Database Error');
      mailer.sendMail({
        from: 'temasekpolling@gmail.com',
        to: email,
        subject: 'TMS Polling Organiser Password',
        text: `Your auto-generated password for our service is ${password}.\n
              Please login and change it.`
      }, (err) => {
        if (err) return res.status(500).send('Mailer Error');
        res.status(200).send('OK');
      });
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
