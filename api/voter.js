const router = require('express').Router();
const authy = require('authy')(process.env.AUTHY_API_KEY);
const jwt = require('jsonwebtoken');

const dbQuery = require('../models/db');
const voterAuth = require('./middlewares/voterAuth');

router.post('/register', (req, res) => {
  let { name, nric, country_code, phone, email, company, shares } = req.body;
  dbQuery(
    `INSERT INTO Voters (name, nric, country_code, phone, email, company_id, shares, phone_verified, organiser_verified)
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

// authentication route
router.post('/authenticate/otp', (req, res) => {
  dbQuery(
    `UPDATE Voters
    SET current_event_id=a.event_id
    FROM Voters v INNER JOIN Attendances a ON v.id=a.voter_id
    WHERE v.nric='${req.body.nric}'
    AND a.event_id=${req.body.eventId};
    SELECT country_code, phone
    FROM Voters
    WHERE nric='${req.body.nric}'
    AND phone_verified=TRUE
    AND organiser_verified=TRUE`,
    (err, results) => {
      if (err) return res.status(500).send('Database Error');
      if (results.length === 0) return res.status(403).send('No Verified Voter Found');
      let { country_code, phone } = results[0];
      authy.phones().verification_start(phone, country_code, { via: 'sms', locale: 'us' }, (err) => {
        if (err) return res.status(500).send('Authy Error');
        res.status(200).send('OK');
      });
    }
  );
});

router.post('/authenticate/login', (req, res) => {
  dbQuery(
    `SELECT *
    FROM Voters
    WHERE nric='${req.body.nric}'`,
    (err, results) => {
      if (err) return res.status(500).send('Database Error');
      if (results.length === 0) return res.status(403).send('User Not Found');
      let { country_code, phone } = results[0];
      authy.phones().verification_check(phone, country_code, req.body.verifyCode, (err) => {
        if (err) return res.status(403).send('Unauthorized');
        const token = jwt.sign(results[0], process.env.SECRET, { expiresIn: '12h' });
        res.status(200).json({ success: true, token });
      });
    }
  );
});

router.get('/companies', (req, res) => {
  dbQuery(
    `SELECT *
    FROM Companies`,
    (err, results) => {
      if (err) return res.status(500).send('Database Error');
      res.status(200).json(results);
    }
  );
});

router.get('/my-info', voterAuth, (req, res) => {
  dbQuery(
    `SELECT Voters.*, Companies.name as company_name
    FROM Voters LEFT JOIN Companies ON Voters.company_id=Companies.id
    WHERE Voters.id=${req.user.id}`,
    (err, results) => {
      if (err) return res.status(500).send('Database Error');
      res.status(200).json(results[0]);
    }
  );
});

// voting routes
router.get('/question/all', voterAuth, (req, res) => {
  dbQuery(
    `SELECT id, question, array_to_json(choices) as choices
    FROM Questions
    WHERE event_id=${req.user.current_event_id}
    AND ${req.user.id} NOT IN (
      SELECT voter_id FROM Votes
      WHERE question_id=Questions.id
    )`,
    (err, results) => {
      if (err) return res.status(500).send('Database Error');
      res.status(200).json(results);
    }
  );
});

router.post('/question/:id', voterAuth, (req, res) => {
  dbQuery(
    `INSERT INTO Votes (voter_id, question_id, choice)
    VALUES (${req.user.id}, (
      SELECT q.id
      FROM Questions q
      WHERE q.event_id=${req.user.current_event_id}
      AND q.id=${req.params.id}
    ), ${req.body.choice})`,
    (err) => {
      if (err) return res.status(500).send('Database Error');
      res.status(200).send('OK');
    }
  );
});

router.get('/results', voterAuth, (req, res) => {
  dbQuery(
    `SELECT q.id, q.question, array_to_json(q.choices) as choices,
    CASE WHEN COUNT(v)=0 THEN '[]'
    ELSE json_agg(v) END AS votes
    FROM Questions q LEFT JOIN (
      SELECT v.*, row_to_json(Voters.*) as voter
      FROM Votes v LEFT JOIN Voters ON v.voter_id=Voters.id
      GROUP BY v.id, Voters.id
    ) v ON q.id=v.question_id
    WHERE q.event_id=${req.user.current_event_id}
    GROUP BY q.id`,
    (err, results) => {
      if (err) return res.status(500).send('Database Error');
      res.status(200).json(results);
    }
  );
});

module.exports = router;
