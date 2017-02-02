const router = require('express').Router();
const authy = require('authy')(process.env.AUTHY_API_KEY);

const dbQuery = require('../models/db');

router.post('/register', (req, res) => {
  let { name, nric, country_code, phone, email, company, shares } = req.body;
  dbQuery(
    `INSERT INTO Voters (name, nric, country_code, phone, email, company, shares, phone_verified, organiser_verified)
    VALUES ('${name}', '${nric}', ${country_code}, ${phone}, '${email}', '${company}', '${shares}', FALSE, FALSE)`,
    (err) => {
      if (err) return res.status(500).send('Database Error');
      res.status(200).send('OK');
    }
  );
});

router.post('/getcode', (req, res) => {
  let { countryCode, phone } = req.body;
  authy.phones().verification_start(phone, countryCode, { via: 'sms', locale: 'us' }, (err) => {
    if (err) return res.status(500).send('Authy Error');
    res.status(200).send('OK');
  });
});

router.post('/verfiy-reg', (req, res) => {
  let { countryCode, phone, verifyCode } = req.body;
  authy.phones().verification_check(phone, countryCode, verifyCode, (err, response) => {
    if (err) return res.status(500).send('Authy Error');
    dbQuery(
      `UPDATE Voters
      SET phone_verified=TRUE
      WHERE country_code=${countryCode} AND phone=${phone}`,
      (err) => {
        if (err) return res.status(500).send('Database Error');
        res.status(200).json(response);
      }
    );
  });
});

module.exports = router;
